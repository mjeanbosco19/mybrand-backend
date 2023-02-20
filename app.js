import express from 'express';
import morgan from 'morgan';
// import blogRouter from './routes/blogRoutes.js';
import userRouter from './routes/userRoutes.js';
// import commentRouter from './routes/commentRoutes.js';
// import contactRouter from './routes/contactRoutes.js';
// import viewRouter from './routes/viewRoutes.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
// app.use('/', viewRouter);
// app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/comments', commentRouter);
// app.use('/api/v1/contacts', contactRouter);

export default app;
