import { NextFunction, Request, Response, Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import { userService } from '@/services/user.service'
import { Role, UserStatus } from '@prisma/client'

const router = Router()

const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req, res, next).catch(next)

const parseRole = (role?: string) => {
  if (role === Role.ADMIN || role === Role.CUSTOMER || role === Role.SUPERADMIN) return role
  return Role.ADMIN
}

const parseStatus = (status?: string) => {
  if (status === UserStatus.ACTIVE || status === UserStatus.SUSPENDED || status === UserStatus.DELETED) return status
  return undefined
}

router.get('/admin/users', ...requireAdmin, asyncHandler(async (_req, res) => {
  const users = await userService.getAllAdmin()
  res.json(users)
}))

router.get('/admin/customers', ...requireAdmin, asyncHandler(async (_req, res) => {
  const customers = await userService.getAllCustomers()
  res.json(customers)
}))

router.get('/admin/users/:id', ...requireAdmin, asyncHandler(async (req, res) => {
  const user = await userService.getById(String(req.params.id))
  if (!user) {
    res.status(404).json({ error: 'Khong tim thay nguoi dung' })
    return
  }
  res.json(user)
}))

router.post('/admin/users', ...requireAdmin, asyncHandler(async (req, res) => {
  const { name, email, phone, role, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Thieu thong tin bat buoc' })
    return
  }

  const user = await userService.create({ name, email, phone, role: parseRole(role), password })
  res.status(201).json(user)
}))

router.patch('/admin/users/:id', ...requireAdmin, asyncHandler(async (req, res) => {
  const { status, role, ...data } = req.body
  const user = await userService.update(String(req.params.id), {
    ...data,
    role: role ? parseRole(role) : undefined,
    status: parseStatus(status),
  })
  res.json(user)
}))

router.delete('/admin/users/:id', ...requireAdmin, asyncHandler(async (req, res) => {
  await userService.delete(String(req.params.id))
  res.json({ success: true })
}))

export default router
