import bcrypt from "bcrypt";
import postgres from "postgres";
import {
  invoices,
  customers,
  revenue,
  users,
} from "../../lib/mocks/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedMonthlyPaidInvoices() {
  // Generate paid invoices for the past 12 months
  const customerIds = [
    "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    "3958dc9e-712f-4377-85e9-fec4b6a6442b",
    "76d65c26-f784-44a2-ac19-586678f7d33f",
    "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
  ];

  const invoices = [];
  const now = new Date();

  // Generate 3-5 invoices per month for the last 12 months
  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthOffset,
      1,
    );
    const monthStr = monthDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Generate 3-5 invoices for this month
    const invoicesInMonth = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < invoicesInMonth; i++) {
      const randomCustomer =
        customerIds[Math.floor(Math.random() * customerIds.length)];
      const amount = Math.floor(Math.random() * 40000) + 10000; // 100-400 in cents = $1-$4

      invoices.push({
        customer_id: randomCustomer,
        amount: amount,
        status: "paid",
        date: monthStr,
      });
    }
  }

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedCustomers();
      await seedInvoices();
      await seedRevenue();
      await seedMonthlyPaidInvoices();
    });

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Seed error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
