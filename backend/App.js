const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post("/upload", upload.single("video"), (req, res) => {
  try {
    res.status(200).json({
      message: "Video uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.log("upload error-->", err);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
