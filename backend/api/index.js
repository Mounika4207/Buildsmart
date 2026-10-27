const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
  return app(req, res);
};
