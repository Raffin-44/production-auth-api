import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

// กำหนด Request ใหม่ ให้สามารถใช้งาน req.user ได้ใน TypeScript
export interface AuthRequest extends Request{
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message : "Not authorized, no header"
            });
        }
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({
            message : "Invalid Token or Token Expired"
        });
    }
}