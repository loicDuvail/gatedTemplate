const pool = require("mssql");

const sqlConfigs = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

(async () => {
  try {
    await pool.connect(sqlConfigs);
  } catch (err) {
    console.log(err);
  }
})();

module.exports = pool;
