const argon2 = require("argon2");
const pool = require("./connection.js");

const createUser = async(username, email, password) => {
  try {
    const hash = await argon2.hash(password);
    const query = `
      INSERT INTO users(username, email, passwordHash)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [username, email, hash];

    await pool.query(query, values);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Username or email already exists");
    }
    throw new Error(error, "Error creating User");
  }
}

module.exports = {
    createUser
}