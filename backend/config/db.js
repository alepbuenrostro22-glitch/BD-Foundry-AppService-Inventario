// backend/config/db.js
// Configuración de la conexión a la base de datos Azure SQL

const sql = require("mssql");
require("dotenv").config();

// Configuración de la base de datos utilizando variables de entorno
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Obligatorio para conexiones a Azure SQL
    trustServerCertificate: false, // Obligatorio para conexiones a Azure SQL
  },
};

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log(">> [AZURE SQL] Conexión establecida correctamente.");
    return pool;
  } catch (error) {
    console.error(">> [AZURE SQL] Error al conectar:", error.message);
    process.exit(1); // Detiene el servidor si falla la conexión
  }
};

module.exports = { sql, connectDB };
