import express from 'express';
import morgan from 'morgan';
import blogRouter from './routes/blogRoutes.js';
import userRouter from './routes/userRoutes.js';
import commentRouter from './routes/commentRoutes.js';
// import contactRouter from './routes/contactRoutes.js';
// import viewRouter from './routes/viewRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import options from './swagger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();
const app = express();

const specs = swaggerJSDoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Allow cross-origin requests
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/comments', commentRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Not found',
  });
});

// ROUTES
// app.use('/', viewRouter);


// app.use('/api/v1/contacts', contactRouter);

export default app;
