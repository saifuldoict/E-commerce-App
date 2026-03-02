import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./database/db.js";
import router from "./routes/router.js";
import authRoute from "./routes/authRoute.js"
import "./config/passport.js"
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use('/auth',authRoute)
app.use("/user", router);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}).catch(err => {
  console.error("DB connection failed:", err);
});
