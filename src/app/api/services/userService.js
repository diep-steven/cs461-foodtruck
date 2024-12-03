const argon2 = require("argon2");
const pool = require("./connection.js");

const createUser = async(username, email, password) => {
  try {
    const hash = await argon2.hash(password);
    const query = `
      INSERT INTO Users(username, email, passwordHash)
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

const loginUser = async(username, password) => {
    try {
        const query = `
            SELECT * FROM Users
            WHERE UPPER(username) = $1`;
            const values = [username.toUpperCase()];
            const result = await pool.query(query, values);
            const user = result.rows[0];

            if(!user) {
                console.log("User doesn't exst");
                throw new Error("Account does not exist");
            }
            const isPassCorrect = await argon2.verify(user.passwordhash, password);

            if (!isPassCorrect) {
                console.log("Pass not correct");
                return undefined;
            }
            return user;
    } catch (error) {
        throw new Error("Login failed");
    }

}

const updateUser = async (id, details) => {
  if (!details || Object.keys(details).length === 0) {
    throw new Error("No details provided");
  }

  const fields = [];
  const values = [];
  let paramNumber = 1;

  Object.keys(details).forEach((key) => {
    fields.push(`${key} = $${paramNumber}`);
    values.push(details[key]);
    paramNumber++;
  });

  const query = `
    UPDATE Users 
    SET ${fields.join(", ")} 
    WHERE userId = $${paramNumber} 
    RETURNING *`;
  values.push(parseInt(id));

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Account does not exist");
    }
    return result.rows;
  } catch (error) {
    handleDatabaseError(error, "Could not update user");
  }
};

const getUserByToken = async (token) => {
  if (!token) {
    throw new Error("No token provided for this site");
  }

  try {
    const query = `
      SELECT userid, username, email 
      FROM Users 
      WHERE usertoken = $1`;
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return null;
    }

    if (result.rows.length > 1) {
      throw new Error("Non-unique result: multiple users found with the same token.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error("Problem with database");
  }
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    getUserByToken,
}