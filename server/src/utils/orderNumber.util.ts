import { prisma } from '@/config/database'

/**
 * Generate a human-readable order number
 * Format: LA-YYYYMMDD-XXX (e.g., LA-20260324-001)
 */
export const generateOrderNumber = async (): Promise<string> => {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
  const prefix = `LA-${dateStr}-`

  // Count orders today
  const count = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
  })

  const seq = String(count + 1).padStart(3, '0')
  return `${prefix}${seq}`
}

/**
 * Generate a repair ticket number
 * Format: REP-YYYYMMDD-XXX (e.g., REP-20260324-001)
 */
export const generateTicketNumber = async (): Promise<string> => {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  const prefix = `REP-${dateStr}-`

  const count = await prisma.repairRequest.count({
    where: {
      ticketNumber: {
        startsWith: prefix,
      },
    },
  })

  const seq = String(count + 1).padStart(3, '0')
  return `${prefix}${seq}`
}
