const fs = require('fs')

console.info('Incrementing build number...')

try {
  const metadata = JSON.parse(fs.readFileSync('package.json'))
  const parts = metadata.version.split('.')
  parts[2] = parseInt(parts[2]) + 1
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
