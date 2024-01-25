import { and, eq, ilike, sql } from 'drizzle-orm'
import fastify from 'fastify'
import { z } from 'zod'
import { db } from './lib/db'
import { orders, users } from './schema'

const app = fastify()

app.get('/orders', async (request, reply) => {
  const { pageIndex, orderNumber, customerName } = z
    .object({
      pageIndex: z.coerce.number().default(0),
      orderNumber: z.string().optional().default(''),
      customerName: z.string().optional().default(''),
    })
    .parse(request.query)

  const [ordersCount] = await db
    .select({
      count: sql<number>`cast(count(${orders.id}) as int)`,
    })
    .from(orders)
    .where(
      and(
        ilike(orders.id, `%${orderNumber}%`),
        ilike(users.name, `%${customerName}%`),
      ),
    )
    .innerJoin(users, eq(users.id, orders.customerId))

  const allOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        ilike(orders.id, `%${orderNumber}%`),
        ilike(users.name, `%${customerName}%`),
      ),
    )
    .innerJoin(users, eq(users.id, orders.customerId))
    .offset(pageIndex * 10)
    .limit(10)

  return reply.send({
    orders: allOrders,
    meta: { pageIndex, totalCount: ordersCount.count },
  })
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🔥 HTTP server running!')
  })
