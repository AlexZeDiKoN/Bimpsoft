const fs = require('fs')
const path = require('path')

try {
  const major = (process.env.CURRENT_VERSION || '').split('.')
  console.info('Incrementing build number...')
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
  const metadata = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const parts = metadata.version.split('.')
  if (parts.length > 2) {
    if (major.length === 2) {
      parts[0] = major[0]
      parts[1] = major[1]
    }
    parts[parts.length - 1] = parseInt(parts[parts.length - 1]) + 1
  }
  metadata.version = parts.join('.')
  fs.writeFileSync(packageJsonPath, JSON.stringify(metadata, null, 2))
  console.info(`Current build number: ${metadata.version}`)
} catch (err) {
  console.error(err)
}
