import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

interface AccessPayload extends JwtPayload {
  sub: string
  email: string
  role: string
  type: 'access'
}

interface RefreshPayload extends JwtPayload {
  sub: string
  type: 'refresh'
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export const generateAccessToken = (payload: Omit<AccessPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })

export const generateRefreshToken = (payload: Omit<RefreshPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })

export const verifyAccessToken = (token: string): AccessPayload => {
  const payload = jwt.verify(token, ACCESS_SECRET) as AccessPayload
  if (payload.type !== 'access') throw new Error('Not an access token')
  return payload
}

export const verifyRefreshToken = (token: string): RefreshPayload => {
  const payload = jwt.verify(token, REFRESH_SECRET) as RefreshPayload
  if (payload.type !== 'refresh') throw new Error('Not a refresh token')
  return payload
}
