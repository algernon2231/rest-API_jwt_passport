import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
mongoose.Promise = global.Promise;

mongoose.set('strictQuery', true);
// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    else console.log('Database connected');
});
