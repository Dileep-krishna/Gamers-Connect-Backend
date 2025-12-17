// 1. Import express
const express = require("express");

// 5. Import cors
const cors = require("cors");

// 8. Import router
const router = require("./router");

// 7. Import dotenv
require("dotenv").config();

// 11. Connect db
require("./db/connection");

// Import path to handle file paths
const path = require("path");

// 2. Create express app
const GamersConnect = express();

// 6. Tell srver to use cors
GamersConnect.use(cors());

// 10. Parse incoming JSON requests
GamersConnect.use(express.json());

// Serve static files from the uploads folder
GamersConnect.use(
  "/imguploads",
  express.static(path.join(__dirname, "imguploads"))
);

// 9. Tell server to use router
GamersConnect.use(router);

// 3. Create port
const PORT = 3000;

//error
// app.use((err, req, res, next) => {
//   console.error("Global error handler:", err);
//   res.status(500).json({ success: false, message: "Server error" });
// });


// 4. Start server
GamersConnect.listen(PORT, () => {
  console.log(`server running successfully at ${PORT}`);
});
