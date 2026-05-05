import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import { settingsService } from '@/services/settings.service'

const router = Router()

// GET /settings
// Public site metadata used by storefront pages. Keep admin writes protected below.
router.get('/settings', async (_req, res) => {
  const config = await settingsService.get()
  res.json(config)
})

// GET /admin/settings
router.get('/admin/settings', ...requireAdmin, async (_req, res) => {
  const config = await settingsService.get()
  res.json(config)
})

// PATCH /admin/settings
router.patch('/admin/settings', ...requireAdmin, async (req, res) => {
  const config = await settingsService.update(req.body)
  res.json(config)
})

export default router
