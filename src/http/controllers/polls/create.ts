import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPollBody = z.object({
    title: z.string(),
    options: z.array(z.string()),
  })
  const { title, options } = createPollBody.parse(request.body)
  const pollCreated = await prisma.poll.create({
    data: {
      title,
      options: {
        createMany: {
          data: options.map((option) => {
            return { title: option }
          }),
        },
      },
    },
  })
  return reply.status(201).send(pollCreated)
}
