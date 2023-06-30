import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import prisma from '../lib/prisma'

export async function memoriesRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: { createdAt: 'asc' },
    })

    return memories.map(({ id, coverUrl, content }) => {
      return {
        id,
        coverUrl,
        excerpt: content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsScheme = z.object({ id: z.string().uuid() })
    const { id } = paramsScheme.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({ where: { id } })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send('Unauthorized')
    }

    return memory
  })

  app.post('/memories', async (request, reply) => {
    const bodyScheme = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodyScheme.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        userId: request.user.sub,
        content,
        coverUrl,
        isPublic,
      },
    })

    return reply.send(memory)
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsScheme = z.object({ id: z.string().uuid() })
    const { id } = paramsScheme.parse(request.params)

    const bodyScheme = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodyScheme.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({ where: { id } })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send('Unauthorized')
    }

    memory = await prisma.memory.update({
      where: { id },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return reply.send(memory)
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsScheme = z.object({ id: z.string().uuid() })
    const { id } = paramsScheme.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({ where: { id } })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send('Unauthorized')
    }

    await prisma.memory.delete({ where: { id } })
  })
}
