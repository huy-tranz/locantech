import 'dotenv/config'
import { cleanupOrphanUploads } from '../../src/utils/upload-cleanup.util'
import { prisma } from '../../src/config/database'

function readArg(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length)
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const minAgeMs = Number(readArg('min-age-ms') || 60 * 60 * 1000)
  const result = await cleanupOrphanUploads({ dryRun, minAgeMs })
  console.log(JSON.stringify(result, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
