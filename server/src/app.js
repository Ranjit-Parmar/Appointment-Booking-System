import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./config/database.js";
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import walletRoutes from "./routes/walletRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js'
import { errorHandler } from "./utils/errorHandler.js";
import bodyParser from "body-parser";


const port = process.env.PORT || 5000;
dbConnection();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  credentials: true, 
}));

// Routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/appointment', appointmentRoutes);

app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`, 404);
  next(error);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("server is running on", port);
});
