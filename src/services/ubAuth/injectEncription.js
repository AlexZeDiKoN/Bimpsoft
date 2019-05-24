import UB from '@unitybase/ub-pub'

/**
 * Call this function in onGotApplicationConfig handler to inject a encryption
 * @param {UBConnection} conn
 * @param {EuSign} cryptoProvider
 */
export function addEncryptionToConnection (conn, cryptoProvider) {
  /**
   * UBUacCrypto instance used for PKI relative operations (read keys / signatures)
   * @private
   * @readonly
   * @type {EuSign}
   * @memberOf {UBConnection}
   */
  conn._pki = null

  /**
   * Return instance of UBUacCrypto for PKI operation
   * @memberOf {UBConnection}
   * @returns {Promise<UBUacCrypto>}
   */
  conn.pki = function () {
    return new Promise(function (resolve, reject) {
      if (!conn._pki) {
        conn._pki = cryptoProvider
        conn._pkiInit = conn._pki._configure()
      }
      conn._pkiInit.then(function () {
        resolve(conn._pki)
      }, function (reason) {
        reject(reason)
      })
    })
  }
  /**
   * CERT auth schema implementation
   * @param authParams
   * @returns {Promise}
   */
  conn.authHandshakeCERT = async function (authParams) {
    const me = this
    // let secretWord
    const urlParams = {
      AUTHTYPE: authParams.authSchema,
      userName: '1234567890',
    }

    if (authParams.password && !me.simpleCertAuth) {
      urlParams.password = authParams.password
    }
    if (authParams.registration) {
      urlParams.registration = authParams.registration
    }

    await conn.pki()
    const certificateRequest = Promise.all([
      conn._pki.getOwnSignCertificate(),
      conn._pki.getOwnEncryptCertificate(),
    ])
    const [ signCertificate, encryptCertificate ] = await certificateRequest

    // simple cert auth
    const convertToBase64Request = Promise.all([
      conn._pki.BASE64Encode(signCertificate),
      conn._pki.BASE64Encode(encryptCertificate),
    ])
    const [ , base64EncryptCert ] = await convertToBase64Request // base64SignCert

    const certInfo = await conn._pki.parseCertificate(encryptCertificate)

    const reqData = base64EncryptCert
    me.emit('defineLoginName', me, urlParams, certInfo, null)

    const initialRequestXhr = conn.xhr({
      url: 'auth',
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      params: urlParams,
      responseType: 'arraybuffer',
      data: reqData,
    })
      .then(() => {
        throw new UB.UBError('msgInvalidCertAuth')
      }, (result) => result)

    const initialRequest = await initialRequestXhr

    if ((initialRequest instanceof Error) || (initialRequest instanceof UB.UBError)) {
      throw initialRequest
    }

    let serverMessage
    if (initialRequest.status !== 401) {
      if (initialRequest.data && initialRequest.data instanceof ArrayBuffer && initialRequest.data.byteLength > 1) {
        try {
          // noinspection JSCheckFunctionSignatures
          const respObj = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(initialRequest.data)))
          if ((respObj.errCode === 65 || respObj.errCode === 0) && respObj.errMsg && /<<<.*>>>/.test(respObj.errMsg)) {
            serverMessage = respObj.errMsg.match(/<<<(.*)>>>/)[ 1 ]
          }
        } catch (err) {
          // console.error(err.stack)
        }
        if (serverMessage) {
          throw new UB.UBError(serverMessage)
        }
      }
      throw new UB.UBError('msgInvalidCertAuth')
    }

    // begin phrase 2 of auth.
    // wait for response WWW-Authenticate: CERT connectionId server_certificate
    // and encrypted by client certificate secret word in body
    const authData = initialRequest.headers('WWW-Authenticate')
    if (!authData && (authData.substr(0, 5) !== 'CERT ')) {
      throw new Error('invalidCertAuthRespAuthType')
    }

    const aValues = authData.split(' ')
    if (aValues.length !== 3) {
      throw new Error('invalidCertAuthResponse')
    }

    urlParams.CONNECTIONID = aValues[ 1 ]
    const recipientCertificate = await conn._pki.BASE64Decode(aValues[ 2 ])

    const envelop = await UB.base64FromAny(initialRequest.data)

    if (!envelop || (envelop === '')) {
      throw new Error('invalidCertAuthEnvelop')
    }

    // decrypt secret word using client private key
    const secretWordUint8Array = await conn._pki.Develop(envelop)
    const secretWordB64 = await conn._pki.BASE64Encode(secretWordUint8Array)
    // memorize it
    const secretWord = window.atob(secretWordB64)

    // encrypt secret word with server public key
    const encryptedWord = await conn._pki.EnvelopToRecipients(recipientCertificate, secretWordUint8Array)
    const encryptedWordB64 = UB.base64toArrayBuffer(encryptedWord)
    if (encryptedWordB64.byteLength === 0) { throw new Error('invalidCertAuthEnvelopOut') }

    // add fingerprint
    // urlParams.FP = lastFP
    // urlParams.KMN = lastKeyMediaName
    // repeat request with encrypted secret word
    const secretWordResponse = await me.xhr({
      url: 'auth',
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      params: urlParams,
      data: encryptedWordB64,
    })
    secretWordResponse.secretWord = secretWord
    return secretWordResponse
  }

  return Promise.resolve(true)
}
