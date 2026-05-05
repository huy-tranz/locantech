import api from './axios'

export type UploadFolder = 'products' | 'banners'

export interface UploadResponse {
  filename: string
  url: string
}

const uploadApi = {
  image: async (folder: UploadFolder, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post<UploadResponse>(`/admin/uploads/${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
  },
}

export default uploadApi
