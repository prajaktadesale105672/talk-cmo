
import e from 'express';
import createDatabasePool from './db.mjs'; // Import the database pool creation function
import dotenv from 'dotenv';

dotenv.config();
// console.log('process.env:', process.env.JWT_SECRET_KEY);
const initializeApp = async () => {
  try {
    const environment = process.env.NODE_ENV || 'DEV';
    const pool = await createDatabasePool(environment);
    console.log('Database connected.' + environment);
    const connection = await pool.getConnection();
    connection.release(); // Release the connection
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const pool = await initializeApp();

export default pool;

