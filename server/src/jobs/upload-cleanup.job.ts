import { cleanupOrphanUploads } from '@/utils/upload-cleanup.util'

const DEFAULT_INTERVAL_MS = 6 * 60 * 60 * 1000
const DEFAULT_MIN_AGE_MS = 60 * 60 * 1000

function toPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function startUploadCleanupJob() {
  if (process.env.UPLOAD_CLEANUP_ENABLED === 'false') {
    console.log('Upload cleanup job disabled')
    return null
  }

  const intervalMs = toPositiveNumber(process.env.UPLOAD_CLEANUP_INTERVAL_MS, DEFAULT_INTERVAL_MS)
  const minAgeMs = toPositiveNumber(process.env.UPLOAD_CLEANUP_MIN_AGE_MS, DEFAULT_MIN_AGE_MS)

  const run = async () => {
    try {
      const result = await cleanupOrphanUploads({ minAgeMs })
      if (result.deleted > 0 || result.errors.length > 0) {
        console.log('Upload cleanup result:', {
          scanned: result.scanned,
          deleted: result.deleted,
          errors: result.errors.length,
        })
      }
    } catch (error) {
      console.error('Upload cleanup job failed:', error)
    }
  }

  const initialTimer = setTimeout(run, Math.min(5 * 60 * 1000, intervalMs))
  const intervalTimer = setInterval(run, intervalMs)

  return {
    stop() {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    },
  }
}
