// netlify/functions/submitVoto.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // configure isso no Netlify
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { name, cpf, phone, ratings } = JSON.parse(event.body);

    const result = await pool.query(
      `INSERT INTO votos_feira (
        nome, cpf, telefone,
        scotland, usa, canada, england, ireland, new_zealand, malta
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        name,
        cpf,
        phone,
        ratings.Scotland || false,
        ratings.USA || false,
        ratings.Canada || false,
        ratings.England || false,
        ratings.Ireland || false,
        ratings["New Zealand"] || false,
        ratings.Malta || false,
      ]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Voto salvo com sucesso!" }),
    };
  } catch (err) {
    console.error("Erro ao inserir no banco:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao salvar no banco de dados." }),
    };
  }
};
