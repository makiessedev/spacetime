'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Cookie from 'js-cookie'

import api from '@/lib/api'
import { MediaPicker } from './MediaPicker'

export function NewMemoryForm() {
  const router = useRouter()

  async function handleMemorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formDatas = new FormData(event.currentTarget)

    const fileToUpload = formDatas.get('media')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const response = await api.post('/upload', uploadFormData)

      coverUrl = response.data.url
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formDatas.get('content'),
        isPublic: formDatas.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleMemorySubmit} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex cursor-pointer items-center gap-1.5 text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>
      <MediaPicker />

      <textarea
        name="content"
        id="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiência que você quer lembrar para sempre!"
      />

      <button
        type="submit"
        className="font-alt inline-block self-end rounded-full bg-green-500 px-5 py-3 text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar lembrança
      </button>
    </form>
  )
}
