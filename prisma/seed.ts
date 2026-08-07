import {
  PrismaClient,
  AccountType,
  CategoryType,
  TransactionType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  // Truncate tables to prevent duplication errors on re-runs
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'hashedpassword123',
      role: 'user',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'hashedpassword456',
      role: 'user',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'hashedpassword789',
      role: 'user',
    },
  });

  console.log('Seeding Accounts...');
  const aliceBank = await prisma.account.create({
    data: {
      user_id: user1.id,
      name: 'Alice Checking',
      type: AccountType.bank,
      balance: 15000000.0,
    },
  });
  const aliceWallet = await prisma.account.create({
    data: {
      user_id: user1.id,
      name: 'Alice GoPay',
      type: AccountType.e_wallet,
      balance: 500000.0,
    },
  });

  const bobBank = await prisma.account.create({
    data: {
      user_id: user2.id,
      name: 'Bob Savings',
      type: AccountType.bank,
      balance: 25000000.0,
    },
  });
  const bobCash = await prisma.account.create({
    data: {
      user_id: user2.id,
      name: 'Bob Wallet',
      type: AccountType.cash,
      balance: 750000.0,
    },
  });

  const charlieBank = await prisma.account.create({
    data: {
      user_id: user3.id,
      name: 'Charlie Checking',
      type: AccountType.bank,
      balance: 8000000.0,
    },
  });
  const charlieWallet = await prisma.account.create({
    data: {
      user_id: user3.id,
      name: 'Charlie OVO',
      type: AccountType.e_wallet,
      balance: 350000.0,
    },
  });

  console.log('Seeding Categories...');
  const catSalary = await prisma.category.create({
    data: { name: 'Salary', type: CategoryType.income },
  });
  const catFreelance = await prisma.category.create({
    data: { name: 'Freelance', type: CategoryType.income },
  });
  const catFood = await prisma.category.create({
    data: { name: 'Food & Dining', type: CategoryType.expense },
  });
  const catUtilities = await prisma.category.create({
    data: { name: 'Utilities', type: CategoryType.expense },
  });
  const catTransport = await prisma.category.create({
    data: { name: 'Transportation', type: CategoryType.expense },
  });
  const catEntertainment = await prisma.category.create({
    data: { name: 'Entertainment', type: CategoryType.expense },
  });

  console.log('Seeding Transactions...');
  await prisma.transaction.createMany({
    data: [
      // User 1 Transactions
      {
        account_id: aliceBank.id,
        category_id: catSalary.id,
        type: TransactionType.income,
        amount: 10000000.0,
        description: 'Monthly Salary',
        transaction_date: new Date('2026-06-01'),
      },
      {
        account_id: aliceBank.id,
        category_id: catUtilities.id,
        type: TransactionType.expense,
        amount: 500000.0,
        description: 'Electricity Bill',
        transaction_date: new Date('2026-06-03'),
      },
      {
        account_id: aliceWallet.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 75000.0,
        description: 'Lunch',
        transaction_date: new Date('2026-06-05'),
      },
      {
        account_id: aliceWallet.id,
        category_id: catTransport.id,
        type: TransactionType.expense,
        amount: 30000.0,
        description: 'Taxi fare',
        transaction_date: new Date('2026-06-07'),
      },
      {
        account_id: aliceBank.id,
        category_id: catEntertainment.id,
        type: TransactionType.expense,
        amount: 150000.0,
        description: 'Cinema ticket',
        transaction_date: new Date('2026-06-10'),
      },

      // User 2 Transactions
      {
        account_id: bobBank.id,
        category_id: catSalary.id,
        type: TransactionType.income,
        amount: 18000000.0,
        description: 'Base Salary',
        transaction_date: new Date('2026-06-01'),
      },
      {
        account_id: bobBank.id,
        category_id: catFreelance.id,
        type: TransactionType.income,
        amount: 5000000.0,
        description: 'Web Dev Project',
        transaction_date: new Date('2026-06-04'),
      },
      {
        account_id: bobCash.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 120000.0,
        description: 'Groceries',
        transaction_date: new Date('2026-06-06'),
      },
      {
        account_id: bobCash.id,
        category_id: catTransport.id,
        type: TransactionType.expense,
        amount: 200000.0,
        description: 'Fuel',
        transaction_date: new Date('2026-06-08'),
      },
      {
        account_id: bobBank.id,
        category_id: catUtilities.id,
        type: TransactionType.expense,
        amount: 800000.0,
        description: 'Internet & WiFi',
        transaction_date: new Date('2026-06-12'),
      },
      {
        account_id: bobCash.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 45000.0,
        description: 'Coffee',
        transaction_date: new Date('2026-06-15'),
      },
      {
        account_id: bobBank.id,
        category_id: catEntertainment.id,
        type: TransactionType.expense,
        amount: 300000.0,
        description: 'Concert Ticket',
        transaction_date: new Date('2026-06-18'),
      },

      // User 3 Transactions
      {
        account_id: charlieBank.id,
        category_id: catSalary.id,
        type: TransactionType.income,
        amount: 7000000.0,
        description: 'Part-time Pay',
        transaction_date: new Date('2026-06-02'),
      },
      {
        account_id: charlieWallet.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 50000.0,
        description: 'Dinner',
        transaction_date: new Date('2026-06-04'),
      },
      {
        account_id: charlieBank.id,
        category_id: catUtilities.id,
        type: TransactionType.expense,
        amount: 250000.0,
        description: 'Water Bill',
        transaction_date: new Date('2026-06-09'),
      },
      {
        account_id: charlieWallet.id,
        category_id: catTransport.id,
        type: TransactionType.expense,
        amount: 25000.0,
        description: 'Bus pass',
        transaction_date: new Date('2026-06-11'),
      },
      {
        account_id: charlieBank.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 150000.0,
        description: 'Weekly groceries',
        transaction_date: new Date('2026-06-14'),
      },
      {
        account_id: charlieWallet.id,
        category_id: catEntertainment.id,
        type: TransactionType.expense,
        amount: 100000.0,
        description: 'Gaming subscription',
        transaction_date: new Date('2026-06-16'),
      },
      {
        account_id: charlieBank.id,
        category_id: catFreelance.id,
        type: TransactionType.income,
        amount: 1500000.0,
        description: 'Logo Design',
        transaction_date: new Date('2026-06-20'),
      },
      {
        account_id: charlieWallet.id,
        category_id: catFood.id,
        type: TransactionType.expense,
        amount: 35000.0,
        description: 'Snacks',
        transaction_date: new Date('2026-06-22'),
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
