const mongoose = require('mongoose');
const { config } = require('../config/secret')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${config.userMongo}:${config.passMongo}@cluster0.2eqk6.mongodb.net/project2`);
    console.log("mongo connect project2...")
}