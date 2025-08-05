import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'


dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173'
];

app.use(cors({origin: allowedOrigins, credentials: true}));

app.use(cookieParser());

//helps read json data
app.use(express.json());
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)



//Routes
app.get('/', (req, res) => {
    res.send("This is the landing page.");
});


export default app;
