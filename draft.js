beforeAll(async () => {
  try {
    // Connect to the database
    mongoose.connect(
      'mongodb://bosco:etite@ac-d364pw5-shard-00-00.qgktwu4.mongodb.net:27017,ac-d364pw5-shard-00-01.qgktwu4.mongodb.net:27017,ac-d364pw5-shard-00-02.qgktwu4.mongodb.net:27017/?ssl=true&replicaSet=atlas-5gh9rp-shard-0&authSource=admin&retryWrites=true&w=majority'
    );
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
