const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar el inicializador de la base de datos
const { connectDB } = require("./config/db");

// Importar los enrutadores
const inventarioRoutes = require("./routes/inventarioRoutes");
const authRoutes = require("./routes/authRoutes"); // <-- AQUÍ IMPORTAMOS LA AUTENTICACIÓN

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());

// REGISTRO DE RUTAS
app.use("/api/auth", authRoutes); // <-- AQUÍ MONTAMOS LA RUTA QUE TE DA ERROR 404
app.use("/api/inventario", inventarioRoutes); // <-- RUTAS PROTEGIDAS

// Ruta de diagnóstico
app.get("/", (req, res) => {
  res.status(200).send(">> [SYSTEM] Backend Operativo.");
});

// INICIO DEL SERVIDOR
app.listen(PORT, async () => {
  console.log(`>> [EXPRESS] Servidor inicializado en el puerto ${PORT}`);
  await connectDB();
});
