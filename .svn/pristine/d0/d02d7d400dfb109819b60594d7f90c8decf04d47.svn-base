import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import { userService } from '@/services/user.service'
import { Role } from '@prisma/client'

const router = Router()

// GET /admin/users
router.get('/admin/users', ...requireAdmin, async (_req, res) => {
  const users = await userService.getAllAdmin()
  res.json(users)
})

// GET /admin/customers
router.get('/admin/customers', ...requireAdmin, async (_req, res) => {
  const customers = await userService.getAllCustomers()
  res.json(customers)
})

// GET /admin/users/:id
router.get('/admin/users/:id', ...requireAdmin, async (req, res) => {
  const user = await userService.getById(req.params.id)
  if (!user) { res.status(404).json({ error: 'Không tìm thấy người dùng' }); return }
  res.json(user)
})

// POST /admin/users
router.post('/admin/users', ...requireAdmin, async (req, res) => {
  const { name, email, phone, role, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Thiếu thông tin bắt buộc' }); return
  }
  const user = await userService.create({ name, email, phone, role: role || Role.ADMIN, password })
  res.status(201).json(user)
})

// PATCH /admin/users/:id
router.patch('/admin/users/:id', ...requireAdmin, async (req, res) => {
  const user = await userService.update(req.params.id, req.body)
  res.json(user)
})

// DELETE /admin/users/:id
router.delete('/admin/users/:id', ...requireAdmin, async (req, res) => {
  await userService.delete(req.params.id)
  res.json({ success: true })
})

export default router
