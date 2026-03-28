import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookies from 'cookie-parser';
import AuthRoute from './routes/AuthRoute.js';

import listingsRouter from './routes/listings.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.set("trust proxy", 1);
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(cookies());
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
  res.send('Hello World!');
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
