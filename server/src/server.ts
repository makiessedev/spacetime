import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import 'dotenv/config'

import { memoriesRoute } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { fastifyStatic } from '@fastify/static'
import { resolve } from 'path'

const app = fastify()

app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(multipart)

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'spacetime',
})

app.register(authRoutes)
app.register(uploadRoutes)

app.register(memoriesRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('server running on http://localhost:3333')
})
