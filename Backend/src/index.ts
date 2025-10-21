import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB";

import authRoutes from "./routes/auth.route";
import purchaseRoutes from "./routes/purchase.route";
import adminRoutes from "./routes/admin.route";
import apiRouter from './routes/api.route';
import uploadRouter from './routes/upload.route';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5000");
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRouter);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/upload', uploadRouter);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req: Request, res: Response) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});