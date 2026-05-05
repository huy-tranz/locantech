import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { requireAdmin } from '@/middleware/admin.middleware'
import { cleanupOrphanUploads } from '@/utils/upload-cleanup.util'

const router = Router()

const allowedFolders = new Set(['products', 'banners'])
const uploadRoot = path.resolve(process.cwd(), 'uploads')

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = String(req.params.folder || '')
    if (!allowedFolders.has(folder)) {
      cb(new Error('Invalid upload folder'), '')
      return
    }

    const destination = path.join(uploadRoot, folder)
    fs.mkdirSync(destination, { recursive: true })
    cb(null, destination)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60)

    cb(null, `${Date.now()}-${safeName || 'image'}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'))
      return
    }

    cb(null, true)
  },
})

router.post('/admin/uploads/:folder', ...requireAdmin, upload.single('file'), (req, res) => {
  const folder = String(req.params.folder || '')
  if (!allowedFolders.has(folder)) {
    return res.status(400).json({ error: 'Invalid upload folder' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  res.status(201).json({
    filename: req.file.filename,
    url: `/uploads/${folder}/${req.file.filename}`,
  })
})

router.post('/admin/uploads/cleanup/orphans', ...requireAdmin, async (req, res, next) => {
  try {
    const minAgeMs = Number(req.body?.minAgeMs) || 60 * 60 * 1000
    const dryRun = Boolean(req.body?.dryRun)
    const result = await cleanupOrphanUploads({ minAgeMs, dryRun })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default router
