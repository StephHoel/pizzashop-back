import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { orders, users } from './schema'
import { db } from './lib/db'

const main = async () => {
  const customer1Id = createId()
  const customer2Id = createId()

  await db.insert(users).values([
    {
      id: customer1Id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      id: customer2Id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])

  const ordersToInsert: (typeof orders.$inferInsert)[] = []

  // eslint-disable-next-line prettier/prettier
  for (let i = 0;i < 80;i++) {
    ordersToInsert.push({
      customerId: faker.helpers.arrayElement([customer1Id, customer2Id]),
      status: 'pending',
      totalInCents: faker.number.int({
        min: 2900,
        max: 7900,
      }),
      createdAt: faker.date.recent({ days: 7 }),
    })
  }

  await db.insert(orders).values(ordersToInsert)
}

main()
