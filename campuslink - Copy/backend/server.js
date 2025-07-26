require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const connectDB = require('./config/database');
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const sessionRoutes = require('./routes/sessions');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sessions', sessionRoutes);

// ✅ Email route for complaint resolution with category-based messages
app.post("/send-resolution-email", async (req, res) => {
  const { email, name, category, description } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your_email@gmail.com", // Replace with your Gmail
      pass: process.env.EMAIL_PASS || "your_app_password",    // Replace with your App Password
    },
  });

  // 📨 Custom message by category
  let resolutionMessage = "";

  switch (category.toLowerCase()) {
    case "water":
      resolutionMessage = `Your complaint about water issues has been addressed. We’ve ensured proper plumbing or water supply.`;
      break;
    case "electricity":
      resolutionMessage = `The electricity-related complaint has been resolved. Electrical lines or systems have been checked and fixed.`;
      break;
    case "internet":
      resolutionMessage = `We’ve looked into your internet connectivity issue. The network is now stable and functional.`;
      break;
    case "cleaning":
      resolutionMessage = `The cleaning request has been fulfilled. The concerned area has been cleaned.`;
      break;
    case "food":
      resolutionMessage = `Your food-related concern has been communicated to the mess management and necessary changes were made.`;
      break;
    default:
      resolutionMessage = `Your complaint has been resolved. Thank you for your patience.`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || "your_email@gmail.com",
    to: email,
    subject: `Complaint Resolved: ${category}`,
    text: `Hello ${name},\n\n${resolutionMessage}\n\nComplaint Description:\n${description}\n\nThank you,\nHostel Management`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});


// Default route for login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
