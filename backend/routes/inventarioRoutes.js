// backend/routes/inventarioRoutes.js
// Rutas para el manejo del inventario

const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middleware/auth");
const {
  registrarEntrada,
  obtenerInventario,
  actualizarRegistro,
  eliminarRegistro,
} = require("../controllers/inventarioController");

// [GET] Leer todo el inventario
router.get("/", verificarToken, obtenerInventario);

// [POST] Crear un nuevo registro vía IA
router.post("/registrar", verificarToken, registrarEntrada);

// [PUT] Actualizar un registro específico por su ID
router.put("/:id", verificarToken, actualizarRegistro);

// [DELETE] Eliminar un registro específico por su ID
router.delete("/:id", verificarToken, eliminarRegistro);

module.exports = router;
