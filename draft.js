const express = require('express');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'DEV',
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World 🇵🇹 🙌' });
});

app.post('/', upload.single('picture'), async (req, res) => {
  return res.json({ picture: req.file.path });
});
// Add upload middleware to blog creation route
router.post('/create', upload.single('imageCover'), createBlog);