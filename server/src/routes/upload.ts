import { createWriteStream } from 'fs'
import { randomUUID } from 'crypto'
import { extname, resolve } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

import { FastifyInstance } from 'fastify'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_800, // 5mb
      },
    })

    if (!upload) return reply.status(400).send()

    const mimeTypeRegex = /^(image|video)\/[a-zA-z]*/
    const isValidFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFormat) return reply.status(400).send('Invalid format')

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const filename = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', filename),
    )

    await pump(upload.file, writeStream)

    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/${filename}`, fullURL).toString()

    return reply.status(201).send({ url: fileURL })
  })
}
