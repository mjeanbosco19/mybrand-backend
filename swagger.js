const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My brand project API',
      version: '1.0.0',
      description: 'Blogs, Comments, Likes and Users apis documentation',
      contact: {
        name: 'Jean Bosco Mugiraneza',
        email: 'admin@bosco.io',
        url: 'web.com',
      },
    },
    servers: [
      {
        url: 'https://brand-q646.onrender.com/',
        description: 'Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './routes/blogRoutes.js',
    './routes/userRoutes.js',
    './routes/commentRoutes.js',
  ],
};
export default options;
