import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Initialize Express app
// const app = express();

// Connect to MongoDB database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

if (!process.env.DATABASE) {
  console.log('Error: Database connection string is undefined');
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => console.log('Database connected successful!'))
  .catch((error) => console.log(`Error connecting to database: ${error}`));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
