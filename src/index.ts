import express from "express";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";

import remindersRouter from "./routers/reminders.js";

dotenv.config();

const PORT = 8000;
const app = express();
const dbUri = process.env.DATABASE_URI as string;

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose config
mongoose.set("strictQuery", true);

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Routes
app.use("/reminders", remindersRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`)
);
