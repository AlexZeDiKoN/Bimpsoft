import UB from '@unitybase/ub-pub'
// import EuSignCrypto from './euSignCrypto'
import EuSign from './eusign'
import { addEncryptionToConnection } from './injectEncription'

const authParams = { authSchema: 'CERT' }
const ubHost = 'http://10.8.17.6:1236/UnityBase'
// const ubHost = 'http://localhost:883'

export async function getConnectionUB () {
  const signer = EuSign.createEuSign()
  let isRepeat = false
  let authFailReason

  const connection = await UB.connect({
    host: ubHost,
    onCredentialRequired: function () {
      if (!isRepeat) {
        isRepeat = true
        return Promise.resolve(authParams)
      } else {
        const reason = authFailReason || 'Failed to log in'
        return Promise.reject(reason)
      }
    },
    onAuthorizationFail: function (reason, conn, isRepeat) {
      authFailReason = reason
      if (isRepeat) {
        throw new Error(reason)
      }
    },
    onNeedChangePassword: function (reason) { },
    onGotApplicationConfig: function (/** @type {UBConnection} */ connection) {
      addEncryptionToConnection(connection, signer) // , advParam
    },
  })

  /** @type {UBSession} session */
  const session = await connection.authorize()
  console.warn(session.authHeader())
  // debugger
  window.connection = connection
  window.session = session

  return connection
}
