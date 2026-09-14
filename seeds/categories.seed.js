import { faker } from "@faker-js/faker"
import pg from "pg";
import slugify from 'slugify';
import "dotenv/config";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function seedData() {
  const client = await pool.connect()

  try {
    console.log("Menghasilkan dan memasukan data dummy ke database...")

    const totalData = 100000
    const batchSize = 10000

    console.time("Waktu Seeding")

    for (let i = 0; i < totalData; i += batchSize) {
      const names = [];
      const slugs = []

      for (let j = 0; j < batchSize; j++) {
        const generatedName = faker.lorem.sentence(3)
        
        names.push(generatedName);
        slugs.push(slugify(generatedName, { lower: true, strict: true }));
      }

      const query = `
        INSERT INTO categories (name, slug)
        SELECT * FROM UNNEST($1::text[], $2::text[])
      `;

      await client.query(query, [names, slugs]);
      console.log(`Progress: ${i + batchSize} / ${totalData} baris dimasukkan.`);
    }

    console.timeEnd('Waktu Seeding');
    console.log('Seeding selesai dan sukses!');
  } catch (err) {
    console.error(`Gagal melakukan seeding: `, err)
  } finally {
    client.release()

    await pool.end()
  }
}


seedData()