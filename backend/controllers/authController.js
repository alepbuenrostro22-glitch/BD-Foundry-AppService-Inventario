const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sql } = require("../config/db");

// [POST] Registrar un nuevo usuario en la BD
const registrar = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Verificar si el usuario ya existe
    const requestCheck = new sql.Request();
    requestCheck.input("username", sql.VarChar, username);
    const check = await requestCheck.query(
      "SELECT id FROM Usuarios WHERE username = @username",
    );

    if (check.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: ">> RECHAZADO: El nombre de usuario ya está en uso." });
    }

    // 2. Encriptar la contraseña (Hashing)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Guardar en Azure SQL
    const requestInsert = new sql.Request();
    requestInsert.input("username", sql.VarChar, username);
    requestInsert.input("password_hash", sql.VarChar, passwordHash);

    await requestInsert.query(
      "INSERT INTO Usuarios (username, password_hash) VALUES (@username, @password_hash)",
    );

    res.status(201).json({
      mensaje: ">> REGISTRO EXITOSO: Usuario creado en la base de datos.",
    });
  } catch (error) {
    console.error(">> ERROR EN REGISTRO:", error);
    res
      .status(500)
      .json({ error: "Fallo al registrar el usuario en Azure SQL." });
  }
};

// [POST] Iniciar sesión y generar JWT
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar al usuario en la BD
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    const result = await request.query(
      "SELECT * FROM Usuarios WHERE username = @username",
    );

    if (result.recordset.length === 0) {
      return res
        .status(401)
        .json({ error: ">> ACCESO DENEGADO: Credenciales inválidas." });
    }

    const usuario = result.recordset[0];

    // 2. Comparar la contraseña encriptada
    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validPassword) {
      return res
        .status(401)
        .json({ error: ">> ACCESO DENEGADO: Credenciales inválidas." });
    }

    // 3. Generar el JWT
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.status(200).json({
      mensaje: ">> ACCESO CONCEDIDO",
      token: token,
    });
  } catch (error) {
    console.error(">> ERROR EN LOGIN:", error);
    res.status(500).json({ error: "Fallo en el inicio de sesión." });
  }
};

module.exports = { registrar, login };
