import 'dotenv/config'
import app from './app'
import { prisma } from '@/config/database'
import { startUploadCleanupJob } from '@/jobs/upload-cleanup.job'

const PORT = parseInt(process.env.PORT || '3001', 10)
let uploadCleanupJob: ReturnType<typeof startUploadCleanupJob> = null

async function main() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Connected to PostgreSQL database')

    app.listen(PORT, () => {
      uploadCleanupJob = startUploadCleanupJob()
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📚 API docs: http://localhost:${PORT}/api/health`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  uploadCleanupJob?.stop()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  uploadCleanupJob?.stop()
  await prisma.$disconnect()
  process.exit(0)
})

main()
