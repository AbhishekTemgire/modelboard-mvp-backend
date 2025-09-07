

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 4000;


// CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Log each request
app.use(logger);

// Mount all API routes
app.use("/api", routes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend server running with nodemon!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
