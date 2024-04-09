import express from 'express';
import morgan from 'morgan';
import routes from './root-routers'
import dotenv from 'dotenv'
import { connectDatabase, globalErrorHandler } from '@authorization-provider/core';
import session from 'express-session';

const mode = process.argv[2] ?? 'development'
console.log('🚀 ~ mode:', mode)
dotenv.config({ path: `.env.${mode}` })

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
connectDatabase()

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'secret',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   secure: true,
  // }
}));

// parse json request body
app.use(express.json())

// parse urlencoded response body
app.use(express.urlencoded({ extended: true}))

app.use(morgan('dev'))

app.use('/', routes)

app.use(globalErrorHandler)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
