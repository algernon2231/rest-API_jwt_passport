import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import morgan from 'morgan';
import appRoutes from './modules/index.js'
import './config/database.js';
import passport from 'passport';

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

appRoutes(app);

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(PORT, err => {
    if (err) throw err;
    else {
        console.log('Server is running at port ' + PORT);
    }
})