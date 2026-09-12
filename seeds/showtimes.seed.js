import { faker } from "@faker-js/faker"
import pg from "pg";
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
      const movieTitles = [];
      const studioNames = []
      const broadcastTime = [];

      for (let j = 0; j < batchSize; j++) {
        movieTitles.push(faker.lorem.sentence(3));
        studioNames.push(faker.helpers.arrayElement(['Blok M Square', 'Garage Cirebon', "Sungai Bambu"]))
        broadcastTime.push(faker.date.between({ from: '2025-01-01', to: '2026-09-08' }))
      }

      const query = `
        INSERT INTO showtimes (movie_title, studio_name, broadcast_time)
        SELECT * FROM UNNEST($1::text[], $2::text[], $3::timestamp[])
      `;

      await client.query(query, [movieTitles, studioNames, broadcastTime]);
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