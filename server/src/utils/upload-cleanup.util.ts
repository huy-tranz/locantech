import fs from 'fs/promises'
import path from 'path'
import { prisma } from '@/config/database'

const uploadRoot = path.resolve(process.cwd(), 'uploads')

function normalizeUploadUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/uploads/')) return null

  const cleanPath = value.split('?')[0].replace(/\\/g, '/')
  const filename = path.basename(cleanPath)

  if (!filename || filename.startsWith('sample-')) return null

  return cleanPath
}

function uniqueUploadUrls(values: unknown[]) {
  return [...new Set(values.map(normalizeUploadUrl).filter((value): value is string => Boolean(value)))]
}

function resolveUploadPath(url: string) {
  const relativePath = url.replace(/^\/uploads\//, '')
  const fullPath = path.resolve(uploadRoot, relativePath)

  if (!fullPath.startsWith(uploadRoot + path.sep)) {
    return null
  }

  return fullPath
}

async function isUploadStillReferenced(url: string) {
  const [
    productThumbnailCount,
    productImagesCount,
    categoryCount,
    bannerCount,
    newsCount,
    serviceCount,
    siteConfigCount,
  ] = await Promise.all([
    prisma.product.count({ where: { thumbnail: url } }),
    prisma.product.count({ where: { images: { has: url } } }),
    prisma.category.count({ where: { image: url } }),
    prisma.banner.count({ where: { image: url } }),
    prisma.news.count({ where: { image: url } }),
    prisma.service.count({ where: { image: url } }),
    prisma.siteConfig.count({ where: { metaImage: url } }),
  ])

  return (
    productThumbnailCount +
      productImagesCount +
      categoryCount +
      bannerCount +
      newsCount +
      serviceCount +
      siteConfigCount >
    0
  )
}

export async function cleanupUnreferencedUploads(values: unknown[]) {
  const urls = uniqueUploadUrls(values)

  for (const url of urls) {
    if (await isUploadStillReferenced(url)) continue

    const fullPath = resolveUploadPath(url)
    if (!fullPath) continue

    try {
      await fs.unlink(fullPath)
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        console.warn(`Could not delete upload file ${fullPath}:`, error)
      }
    }
  }
}

export function collectChangedUploads(before: unknown[], after: unknown[]) {
  const beforeUrls = uniqueUploadUrls(before)
  const afterUrls = new Set(uniqueUploadUrls(after))

  return beforeUrls.filter((url) => !afterUrls.has(url))
}

async function listUploadFiles(dir = uploadRoot): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) return listUploadFiles(fullPath)
        if (entry.isFile()) return [fullPath]
        return []
      }),
    )

    return files.flat()
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
}

function uploadPathToUrl(fullPath: string) {
  const relativePath = path.relative(uploadRoot, fullPath).replace(/\\/g, '/')
  if (!relativePath || relativePath.startsWith('..')) return null
  return `/uploads/${relativePath}`
}

export interface OrphanCleanupOptions {
  minAgeMs?: number
  dryRun?: boolean
}

export async function cleanupOrphanUploads(options: OrphanCleanupOptions = {}) {
  const minAgeMs = options.minAgeMs ?? 60 * 60 * 1000
  const now = Date.now()
  const files = await listUploadFiles()
  const result = {
    scanned: files.length,
    deleted: 0,
    skippedReferenced: 0,
    skippedYoung: 0,
    skippedSample: 0,
    errors: [] as Array<{ file: string; error: string }>,
    deletedFiles: [] as string[],
  }

  for (const file of files) {
    const url = uploadPathToUrl(file)
    if (!url) continue

    if (path.basename(file).startsWith('sample-')) {
      result.skippedSample += 1
      continue
    }

    const stat = await fs.stat(file)
    if (now - stat.mtimeMs < minAgeMs) {
      result.skippedYoung += 1
      continue
    }

    if (await isUploadStillReferenced(url)) {
      result.skippedReferenced += 1
      continue
    }

    if (!options.dryRun) {
      try {
        await fs.unlink(file)
      } catch (error: any) {
        if (error?.code !== 'ENOENT') {
          result.errors.push({ file, error: error?.message || String(error) })
          continue
        }
      }
    }

    result.deleted += 1
    result.deletedFiles.push(url)
  }

  return result
}
