/** @type {{EndUserLibraryLoader: EndUserLibraryLoader, EUSignCP: EUSignCP}} */
const IEUSignCP = require('@DZVIN/EuSign')
const cmpServer = process.env.NODE_ENV !== 'production' ? 'ca.iit.com.ua' : 'ca.iit.com.ua'


export default class EuSign {
  constructor () {
    /** @type {EUSignCP} */
    this._library = null
    /** @type {Promise<EUSignCP>} */
    this._loadPromise = this._initialize()
  }

  static createEuSign () {
    return new EuSign()
  }

  /**
   * Загрузка библиотеки
   * @return {Promise<EUSignCP>}
   * @private
   */
  _initialize () {
    return new Promise((resolve, reject) => {
      // import('@DZVIN/EuSign').then((module) => {
      // const IEUSignCP = module.default

      const loader =
        new IEUSignCP.EndUserLibraryLoader(
          IEUSignCP.EndUserLibraryLoader.LIBRARY_TYPE_SIGN_AGENT,
          'euSign',
          IEUSignCP.EndUserLibraryLoader.EU_UA_LANG)

      loader.onload = (library) => {
        this._library = library
        if (library.IsInitialized) {
          resolve(library)
          return
        }

        library.Initialize(
          () => {
            resolve(library)
          },
          (message) => {
            reject(message)
          },
        )
      }

      loader.onerror = (msg, errorCode, libraryOrNull) => {
        reject(msg)
      }

      loader.load()
    })
    // })
  }

  async _configure () {
    const cmpSettings = await this.getCMPSettings()
    cmpSettings.SetUseCMP(true)
    cmpSettings.SetAddress(cmpServer)
    cmpSettings.SetPort('80')
    await this.setCMPSettings(cmpSettings)

    const listOfAlmazDevices = await this.getKeyMediaDevices(6)
    const firstAvailable = listOfAlmazDevices[0]
    await this.readPrivateKeySilently(6, firstAvailable.ID, '12345677')
  }

  /**
   * Формування геша даних у вигляді BASE64-строки. Повертається геш значення
   * @param {Uint8Array} data
   * @returns {Promise}
   * @resolve {String.<base64>}
   */
  Hash (data) {
    return this.callFunc('EnvelopToRecipients', [ data ])
  }

  /**
   * Перетворення строки в масив байт з використанням кодування встановленого функцією SetCharset.
   * Повертаються закодовані дані у вигляді масиву байт
   * @param {string} data
   * @returns {Promise}
   * @resolve {Uint8Array}
   */
  StringToBytes (data) {
    return this.callFunc('StringToBytes', [ data ])
  }

  /**
   * Перетворення масиву байт в строку з використанням кодування встановленого функцією SetCharset.
   * Повертається декодована строка
   * @param {Uint8Array} data
   * @returns {Promise}
   * @resolve {string}
   */
  BytesToString (data) {
    return this.callFunc('BytesToString', [ data ])
  }

  /**
   * Подписать с параметрами по умолчанию
   * @param {Uint8Array|String} data
   * @returns {Promise}
   * @resolve {String.<base64>}
   */
  sign (data) {
    return this.isPrivateKeyReaded()
      .then((isReaded) => {
        if (!isReaded) {
          return this.readPrivateKey()
        }
      })
      .then(() => this.callFunc('Sign', [ data ]))
      .then((signature) => signature)
  }

  /**
   *
   * @param {Uint8Array} recipientCert
   * @param data
   * @param signData
   * @return {Promise}
   * @constructor
   */
  EnvelopToRecipients (recipientCert, data, signData = false) {
    const arrayList = this._library.CreateArrayList()
    arrayList.add(recipientCert)
    return this.callFunc('EnvelopToRecipients', [ arrayList, signData, data ])
  }

  /**
   * @param {Uint8Array} recipientCert
   * @param {Uint8Array} data
   * @return {Promise<string>} envelopedData
   */
  RawEnvelop (recipientCert, data) {
    return this.callFunc('RawEnvelop', [ recipientCert, data ])
  }

  /**
   * @param {string} envelopedData
   * @param {boolean} showSenderInfo
   * @return {Promise}
   * @constructor
   */
  Develop (envelopedData, showSenderInfo = false) {
    return this.callFunc('Develop', [ envelopedData, showSenderInfo ])
  }

  /**
   *
   * @param {Uint8Array} data
   * @return {Promise<string>}
   */
  BASE64Encode (data) {
    return this.callFunc('BASE64Encode', [ data ])
  }

  /**
   *
   * @param {string} data
   * @return {Promise<Uint8Array>}
   */
  BASE64Decode (data) {
    return this.callFunc('BASE64Decode', [ data ])
  }

  parseCertificate (certificate) {
    return this.callFunc('ParseCertificate', [ certificate ])
  }

  enumOwnCertificates (index) {
    return this.callFunc('EnumOwnCertificates', [ index ])
  }

  getOwnCertificate () {
    return this.callFunc('GetOwnCertificate', [])
  }

  getOwnSignCertificate () {
    return this.callFunc('GetOwnCertificate', [ 0x01, 0x0001 ])
  }

  getOwnEncryptCertificate () {
    return this.callFunc('GetOwnCertificate', [ 0x01, 0x0010 ])
  }

  getInstallPath () {
    return this.callFunc('GetInstallPath', [])
  }

  readPrivateKeySilently (typeIndex, devIndex, password) {
    return this.callFunc('ReadPrivateKeySilently', [ typeIndex, devIndex, password ])
  }

  /**
   * @param {Boolean} appendCertificate
   * @param {Uint8Array|String} data
   * @returns {Promise}
   * @resolve {String.<base64>}
   */
  signInternal (appendCertificate, data) {
    return this.callFunc('SignInternal', [ appendCertificate, data ])
  }

  /**
   *
   * @param {String.<base64>} sign
   * @param {Uint8Array|String} data
   * @returns {Promise}
   * @resolve {EndUserSignInfo}
   */
  verify (sign, data) {
    return this.callFunc('Verify', [ sign, data ])
  }

  getCertificatesCount () {
    return this.callFunc('GetCertificatesCount')
  }

  getKeyMediaTypes () {
    const me = this
    return new Promise((resolve, reject) => {
      let dIndex = 0

      const portionSize = 50
      const resList = []
      let isFinished = false

      function loadPortion () {
        let dPortion = 0
        const promises = []
        while (dPortion < portionSize) {
          const enumPromise = me.callFunc('EnumKeyMediaTypes', [ dIndex ], true)
          // eslint-disable-next-line no-loop-func
            .then((r) => {
              if (r[0] === '') {
                isFinished = true
              } else {
                resList.push({ ID: r[1][0], name: r[0] })
              }
            })

          promises.push(enumPromise)
          dIndex++
          dPortion++
        }
        Promise.all(promises)
          .then(function () {
            next()
          })
      }

      function next () {
        if (!isFinished) {
          loadPortion()
        } else {
          const lst = resList.sort(function (a, b) { return a.ID < b.ID ? -1 : (a.ID === b.ID ? 0 : 1) })
          resolve(lst)
        }
      }

      loadPortion()
    })
  }

  /**
   * Получение списка носителей указаного типа
   * @param {number} typeIndex
   * @return {Promise<any>}
   */
  getKeyMediaDevices (typeIndex) {
    const me = this
    return new Promise((resolve, reject) => {
      let dIndex = 0

      const resList = []

      function readNext () {
        return me.callFunc('EnumKeyMediaDevices', [ typeIndex, dIndex ], true)
          .then(function (r) {
            dIndex++
            if (r[0] === '') {
              const lst = resList.sort(function (a, b) { return a.ID < b.ID ? -1 : (a.ID === b.ID ? 0 : 1) })
              resolve(lst)
            } else {
              resList.push({ ID: r[1][1], name: r[0] })
              readNext()
            }
          })
      }

      readNext()
    })
  }

  getPrivateKeyMedia () {
    return this.callFunc('GetPrivateKeyMedia', [])
  }

  getPrivateKeyOwnerInfo () {
    return this.callFunc('GetPrivateKeyOwnerInfo')
  }

  setUIMode (showUI) {
    return this.callFunc('SetUIMode', [ showUI ])
  }

  enumKeyMediaTypes (i) {
    return this.callFunc('EnumKeyMediaTypes', [ i ])
  }

  enumKeyMediaDevices (index, type = 6) {
    return this.callFunc('GetPrivateKeyMedia', [ type, index ])
  }

  isPrivateKeyReaded () {
    return this.callFunc('IsPrivateKeyReaded', [])
  }

  readPrivateKey () {
    return this.callFunc('ReadPrivateKey', [])
  }

  isHardwareKeyMedia () {
    return this.callFunc('IsHardwareKeyMedia', [])
  }

  getKeyInfo (keyMedia) {
    return this.callFunc('GetKeyInfo', [ keyMedia ])
  }

  getCMPSettings () {
    return this.callFunc('GetCMPSettings', [])
  }

  setCMPSettings (cmpSettings) {
    return this.callFunc('SetCMPSettings', [ cmpSettings ])
  }

  doesNeedSetSettings () {
    return this.callFunc('DoesNeedSetSettings', [])
  }

  /**
   *
   * @param {String} name
   * @param {Array} params
   * @param {Boolean} [resolveWithRequest=false]
   * @returns {Promise}
   */
  async callFunc (name, params, resolveWithRequest) {
    await this._loadPromise
    return this._callFuncInternal(name, params, resolveWithRequest)
  }

  _callFuncInternal (name, params, resolveWithRequest) {
    return new Promise((resolve, reject) => {
      const prm = [].concat(params || [])
      const func = this._library[name]
      if (!func || (typeof func !== 'function')) {
        reject(new Error('Function "' + name + '" not found in library'))
      }

      prm.push(
        (res) => {
          if (resolveWithRequest) {
            resolve([ res, params ])
          } else {
            resolve(res)
          }
        },
        (err) => {
          console.error(err)
          reject(err)
        })

      func.apply(this._library, prm)
    })
  }
}
