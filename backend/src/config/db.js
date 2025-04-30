// Mock database connection to run without MongoDB
const connectDB = async () => {
  try {
    console.log('Using in-memory task storage');
    return {
      connection: {
        host: 'in-memory'
      }
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 