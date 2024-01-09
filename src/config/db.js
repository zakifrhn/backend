const { Pool } = require("pg");
require("dotenv/config");

//connect to database
// const pool = new Pool({
//   user: process.env.DB_USERNAME,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// })

//connect to vercel database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
module.exports = pool;
