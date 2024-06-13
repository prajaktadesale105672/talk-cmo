// import mysql from 'mysql2';
// import mysql from 'mysql2/promise';

// const db = (environment) => {
//   // Load environment-specific database configuration from the .env file
//   const dbConfig = {
//     host: process.env[`DB_HOST_${environment}`],
//     user: process.env[`DB_USER_${environment}`],
//     password: process.env[`DB_PASSWORD_${environment}`],
//     database: process.env[`DB_NAME_${environment}`],
//   };
//   // console.log(dbConfig);
//   return mysql.createPool(dbConfig);
// };
// export default db;

 
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const createDatabasePool = async (environment) => {
  // Load environment-specific database configuration from the .env file
  const dbConfig = {
    host: process.env[`DB_HOST_${environment}`],
    user: process.env[`DB_USER_${environment}`],
    password: process.env[`DB_PASSWORD_${environment}`],
    database: process.env[`DB_NAME_${environment}`],
  };
  try {
    const pool = mysql.createPool(dbConfig);
    return pool;
  } catch (error) {
    console.error('Error creating the database connection pool:', error);
    throw error;
  }
};

export default createDatabasePool;




 