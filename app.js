import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js';
import cookieParser from "cookie-parser";

import listingsRouter from './routes/listings.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3001;
const DEFAULT_CLIENT_ORIGINS = [
  'https://stay-x-gamma.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://stayxnet.xyz'
];
const allowedOrigins = [
  ...new Set(
    (process.env.CLIENT_ORIGINS || "")
      
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
      .concat(DEFAULT_CLIENT_ORIGINS)
  ),
];

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/listings', listingsRouter);
app.use('/auth', AuthRoute);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    allowedOrigins,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
