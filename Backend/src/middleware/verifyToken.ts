import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
		return;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; name?: string };

		if (!decoded) {
			res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
			return;
		}

		(req as any).userId = decoded.userId;
		(req as any).userName = decoded.name;
		next();
	} catch (error: any) {
		console.log("Error in verifyToken ", error);
		if (error.name === 'JsonWebTokenError') {
			res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
			return;
		}
		res.status(500).json({ success: false, message: "Server error" });
		return;
	}
};
