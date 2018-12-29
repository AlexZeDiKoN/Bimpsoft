const fs = require('fs')

console.info('Incrementing build number...')

try {
  const major = (process.env[`CURRENT_VERSION`] || '').split('.')
  const metadata = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  const parts = metadata.version.split('.')
  if (parts.length > 2) {
    if (major.length === 2) {
      parts[0] = major[0]
      parts[1] = major[1]
    }
    parts[parts.length - 1] = parseInt(parts[parts.length - 1]) + 1
  }
  metadata.version = parts.join('.')
  fs.writeFileSync('package.json', JSON.stringify(metadata, null, 2))
  console.info(`Current build number: ${metadata.version}`)
  fs.writeFileSync('./src/version.json', JSON.stringify({
    version: metadata.version,
    warning: 'Do not modify this file manually!',
  }, null, 2))
} catch (err) {
  console.error(err)
}
