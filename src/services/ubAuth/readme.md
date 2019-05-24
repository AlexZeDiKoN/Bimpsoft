```js
import EuSign from './utils/crypto/eusign'
const signer = EuSign.createEuSign()
const cmpServer = process.env.NODE_ENV !== 'production' ? 'ca.iit.com.ua' : 'ca.iit.com.ua'

signer.getCMPSettings()
  .then((/** {EndUserCMPSettings} */ settings) => {
    settings.SetUseCMP(true)
    settings.SetAddress(cmpServer)
    settings.SetPort('80')
    return signer.setCMPSettings(settings)
  })
  .then(() => signer.getKeyMediaTypes()) // получить список доступных типов носителей Алмаз - 6
  .then((deviceTypes) => logTableAndReturn(deviceTypes))
  .then(() => signer.getKeyMediaDevices(6)) // получить список устройств заданного типа
  .then((devices) => logTableAndReturn(devices))
  .then((devices) => devices[0]) // Здесь можно получить список устройств заданного типа
  .then((almazDevice) => signer.readPrivateKeySilently(6, almazDevice.ID, '12345677')) // считать ключ (тип, индекс носителя, пароль)
  .then(() => signer.sign('42')) // подписание с параметрами по умолчанию
  .then((signed) => logAndReturn(signed))
  .then((signed) => signer.verify(signed, '42')) // проверка подписи
  .then((/** EndUserSignInfo */ signatureInfo) => logAndReturn(signatureInfo))
  .catch((error) => console.log)
  .then(() => signer.sign('24')) // подписание которое провали проверку
  .then((signed) => logAndReturn(signed))
  .then((signed) => signer.verify(signed, '42'))
  .then((/** EndUserSignInfo */ signatureInfo) => logAndReturn(signatureInfo))
  .catch((error) => console.log)

function logTableAndReturn (obj) {
  if (process.env.NODE_ENV !== 'production') {
    console.table(obj)
  }
  return obj
}

function logAndReturn (obj) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(obj)
  }
  return obj
}
```
