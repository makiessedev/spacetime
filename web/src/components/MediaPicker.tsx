'use client'

import { ChangeEvent, useState } from 'react'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) return

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        accept="image/*"
        type="file"
        name="media"
        id="media"
        className="hidden"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          className="aspect-video w-full rounded-lg object-cover"
          alt=""
        />
      )}
    </>
  )
}
