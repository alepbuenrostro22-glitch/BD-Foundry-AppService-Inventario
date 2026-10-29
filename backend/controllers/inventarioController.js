const { sql } = require("../config/db");
const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

// Define el nombre del agente tal como lo creaste en el portal de Azure Foundry
const agentName = "InventarioIA";

// Interfaz para procesar el texto con la IA de Azure Foundry
const procesarInventarioIA = async (texto) => {
  try {
    // 1. Inicializar el cliente usando la identidad del sistema o Azure CLI local
    const projectClient = new AIProjectClient(
      process.env.FOUNDRY_ENDPOINT,
      new DefaultAzureCredential(),
    );

    // 2. Conectar al agente específico
    const openAIClient = projectClient.getOpenAIClient({
      azureConfig: { allowPreview: true, agentName },
    });

    // 3. Crear la conversación con las reglas estrictas (Prompt Engineering)
    const conversation = await openAIClient.conversations.create({
      items: [
        {
          type: "message",
          role: "user",
          content: `Eres un asistente de almacén automatizado.
                    REGLA 1: Extrae la información del texto inferior y devuélvela ESTRICTAMENTE como un JSON válido.
                    REGLA 2: El JSON debe contener exactamente estas claves: producto (string), cantidad (entero), precio_unitario (decimal), marca (string), sku (string).
                    REGLA 3: Si no encuentras el SKU o la marca, asigna "N/A". No agregues texto fuera de las llaves del JSON.
                    Texto a analizar:\n\n${texto}`,
        },
      ],
    });

    // 4. Ejecutar la inferencia
    const response = await openAIClient.responses.create({
      conversation: conversation.id,
    });

    // 5. Limpiar el formato Markdown devuelto por el modelo (como en tu Azure Function)
    const cleanJson = response.output_text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error(">> [AI FOUNDRY SDK] Error de inferencia:", error.message);
    throw error;
  }
};

// Controladores del inventario
// Rutas del CRUD: Crear, Leer, Actualizar, Eliminar

// [POST] Procesar texto con IA e insertar en BD
const registrarEntrada = async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un texto para analizar." });
    }

    const datosExtraidos = await procesarInventarioIA(texto);

    const query = `
            INSERT INTO Inventario (producto, cantidad, precio_unitario, marca, sku)
            OUTPUT Inserted.*
            VALUES (@producto, @cantidad, @precio_unitario, @marca, @sku)
        `;

    const request = new sql.Request();
    request.input("producto", sql.VarChar, datosExtraidos.producto);
    request.input("cantidad", sql.Int, datosExtraidos.cantidad);
    request.input(
      "precio_unitario",
      sql.Decimal(10, 2),
      datosExtraidos.precio_unitario,
    );
    request.input("marca", sql.VarChar, datosExtraidos.marca);
    request.input("sku", sql.VarChar, datosExtraidos.sku);

    const resultado = await request.query(query);

    res.status(201).json({
      mensaje:
        ">> INGRESO EXITOSO: Datos procesados por IA y guardados en SQL.",
      datosGuardados: resultado.recordset[0],
    });
  } catch (error) {
    console.error(">> ERROR EN CONTROLADOR:", error);
    res
      .status(500)
      .json({ error: "Fallo en el procesamiento de datos o conexión a BD." });
  }
};

// [GET] Leer todo el inventario ordenado por fecha
const obtenerInventario = async (req, res) => {
  try {
    const request = new sql.Request();
    const resultado = await request.query(
      "SELECT * FROM Inventario ORDER BY fecha_ingreso DESC",
    );

    res.status(200).json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar la base de datos." });
  }
};

// [PUT] Actualizar un registro existente por ID
const actualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto, cantidad, precio_unitario, marca, sku } = req.body;

    const query = `
            UPDATE Inventario
            SET producto = @producto,
                cantidad = @cantidad,
                precio_unitario = @precio_unitario,
                marca = @marca,
                sku = @sku
            WHERE id = @id
        `;

    const request = new sql.Request();
    request.input("id", sql.Int, id);
    request.input("producto", sql.VarChar, producto);
    request.input("cantidad", sql.Int, cantidad);
    request.input("precio_unitario", sql.Decimal(10, 2), precio_unitario);
    request.input("marca", sql.VarChar, marca);
    request.input("sku", sql.VarChar, sku);

    const resultado = await request.query(query);

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }

    res
      .status(200)
      .json({ mensaje: ">> ACTUALIZACIÓN EXITOSA: Registro modificado." });
  } catch (error) {
    console.error(">> ERROR AL ACTUALIZAR:", error);
    res.status(500).json({ error: "Fallo al actualizar la base de datos." });
  }
};

// [DELETE] Eliminar un registro por ID
const eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    const resultado = await request.query(
      "DELETE FROM Inventario WHERE id = @id",
    );

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }

    res
      .status(200)
      .json({ mensaje: ">> ELIMINACIÓN EXITOSA: Registro borrado." });
  } catch (error) {
    console.error(">> ERROR AL ELIMINAR:", error);
    res.status(500).json({ error: "Fallo al eliminar en la base de datos." });
  }
};

module.exports = {
  registrarEntrada,
  obtenerInventario,
  actualizarRegistro,
  eliminarRegistro,
};
