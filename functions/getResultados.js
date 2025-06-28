const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

exports.handler = async () => {
  try {
    const res = await pool.query("SELECT * FROM votos_feira ORDER BY id DESC");

    const data = res.rows.map((row) => ({
      name: row.nome,
      cpf: row.cpf,
      phone: row.telefone,
      ratings: {
        Scotland: row.scotland,
        USA: row.usa,
        Canada: row.canada,
        England: row.england,
        Ireland: row.ireland,
        "New Zealand": row.new_zealand,
        Malta: row.malta,
      },
      timestamp: row.created_at,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao buscar resultados" }),
    };
  }
};
