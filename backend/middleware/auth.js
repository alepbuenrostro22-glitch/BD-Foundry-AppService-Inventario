// backend/middleware/auth.js
// Middleware de autenticación para proteger rutas
// sirve para verificar el token JWT en las solicitudes entrantes
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  // 1. Extraer la cabecera de autorización
  const authHeader = req.headers["authorization"];
  // El formato estándar es "Bearer <token>", por lo que separamos el string
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Si no hay token, abortar la petición con código 401 (No Autorizado)
  if (!token) {
    return res.status(401).json({
      error:
        ">> ACCESO DENEGADO: Identidad no verificada. Se requiere un token de seguridad.",
    });
  }

  // 3. Validar criptográficamente la firma del token usando la llave del .env
  jwt.verify(token, process.env.JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      return res.status(403).json({
        error:
          ">> ACCESO DENEGADO: El token ha expirado o su firma fue alterada.",
      });
    }

    // 4. Si el token es legítimo, adjuntar la información del usuario a la petición
    req.usuario = usuarioDecodificado;

    // 5. Ceder el control al siguiente controlador (ej. la función que guarda el inventario)
    next();
  });
};

module.exports = { verificarToken };
