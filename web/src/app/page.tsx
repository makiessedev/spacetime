import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt'

import { EmptyMemory } from '@/components/EmptyMemory'
import api from '@/lib/api'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Memory = {
  id: string
  coverUrl: string
  excerpt: string
  userId: string
  createdAt: string
}

dayjs.locale(ptBr)

export default async function Home() {
  const token = cookies().get('token')?.value

  if (!token) return <EmptyMemory />

  const memoriesResponse = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = memoriesResponse.data

  console.log(memories)

  if (memories.length === 0) return <EmptyMemory />

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map(({ coverUrl, createdAt, excerpt, id, userId }) => {
        return (
          <div key={id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              src={coverUrl}
              width={592}
              height={280}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">{excerpt}</p>
            <Link
              href={``}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
