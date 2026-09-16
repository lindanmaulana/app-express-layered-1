import { faker } from "@faker-js/faker";
import pg from "pg";
import slugify from "slugify";
import "dotenv/config";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function seedData() {
  const client = await pool.connect();

  try {
    console.log("Menghasilkan dan memasukan data dummy ke database...");

    const totalData = 100000;
    const batchSize = 10000;

    console.time("Waktu Seeding");

    const existingCategories = await client.query("SELECT id FROM categories LIMIT 1000");
    const categoryIdsList = existingCategories.rows.map((row) => row.id);

    if (categoryIdsList.length === 0)
      throw new Error(
        "Tidak ada kategori di database. Masukan data kategori terlebih dahulu",
      );

    for (let i = 0; i < totalData; i += batchSize) {
      const categoryIds = [];
      const names = [];
      const sku = [];
      const prices = [];
      const stocks = [];

      for (let j = 0; j < batchSize; j++) {
        if (i + j >= totalData) break;

        const generatedName = faker.lorem.sentence(3);
        const uniqueSuffix = faker.string.alphanumeric(5)
        const baseSku = slugify(generatedName, {lower: true, strict: true})
        const finalSku = `${baseSku}-${uniqueSuffix}`
        
        const randomCategoryId = faker.helpers.arrayElement(categoryIdsList);

        categoryIds.push(randomCategoryId)
        names.push(generatedName);
        sku.push(finalSku);
        prices.push(faker.number.int({ min: 10000, max: 500000 }));
        stocks.push(faker.number.int({ min: 0, max: 100 }));
      }

      const query = `
        INSERT INTO products (category_id, name, sku, price, stock)
        SELECT * FROM UNNEST($1::integer[], $2::text[], $3::text[], $4::integer[], $5::integer[])
      `;

      await client.query(query, [categoryIds, names, sku, prices, stocks]);
      console.log(
        `Progress: ${Math.min(i + batchSize, totalData)} / ${totalData} produk dimasukkan.`,
      );
    }

    console.timeEnd("Waktu Seeding");
    console.log("Seeding selesai dan sukses!");
  } catch (err) {
    console.error(`Gagal melakukan seeding: `, err);
  } finally {
    client.release();

    await pool.end();
  }
}

seedData();
