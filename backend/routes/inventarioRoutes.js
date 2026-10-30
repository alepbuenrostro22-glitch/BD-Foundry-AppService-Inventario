// backend/routes/inventarioRoutes.js
// Rutas para el manejo del inventario

const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middleware/auth");
const {
  procesarInstruccionInteligente,
  obtenerInventario,
  actualizarRegistro,
  eliminarRegistro,
} = require("../controllers/inventarioController");

// [GET] Leer todo el inventario
router.get("/", verificarToken, obtenerInventario);

// [POST] Procesar texto con IA (Crea o Actualiza según la intención)
router.post("/procesar", verificarToken, procesarInstruccionInteligente);

// [PUT] Actualizar un registro específico por su ID (Manual)
router.put("/:id", verificarToken, actualizarRegistro);

// [DELETE] Eliminar un registro específico por su ID
router.delete("/:id", verificarToken, eliminarRegistro);

module.exports = router;
