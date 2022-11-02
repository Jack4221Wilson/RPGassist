const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const userTest = await prisma.users.create({
     data: { user_key: 'JackAWilson', pass_word: 'test1234', name: 'Jack Wilson'}
    })
  console.log(userTest)
}

main()
  .catch(e => {
    console.error(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })