import api from './axios'

export interface SiteConfig {
  id: string
  siteName: string
  hotline: string
  email: string
  address: string
  workingHours: string
  facebook?: string
  zalo?: string
  footerText?: string
  seoTitle?: string
  seoDescription?: string
  metaImage?: string
}

export default {
  get: () => api.get('/admin/settings').then((r) => r.data as SiteConfig),
  update: (data: Partial<SiteConfig>) => api.patch('/admin/settings', data).then((r) => r.data as SiteConfig),
}
