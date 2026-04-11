import {Request, Response} from "express"
import { createUserService, loginUserService, refreshTokenService, logoutService } from "../service/auth-service";

export const registerUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                message : " email or password required"
            });
        }

        const registerResult = await createUserService (email, password)

        if (registerResult.error){
            return res.status(400).json({
                message : " result.error"
            });
        }

        return res.status(201).json(registerResult);

    } catch(error){

        console.error(" Error in registerUser:", error);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message : "email or password required"
            });
        }

        const { accessToken, refreshToken } = await loginUserService(email, password)

            res.cookie('secure-cookie-jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // secure: true 
            })

            return res.status(200).json({
                mesaage : " Login Successfully!", accesstoken: accessToken
            })
        
    }catch(error){
        console.log("Error in LoginUser", error);
        
        if(error instanceof Error) {
            return res.status(401).json({
                message: error.message
            });
        }
        
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }

}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies['secure-cookie-jwt'];

        if(!token){
            return res.status(401).json({
                message: "No Refresh Token Provide!"
            })
        }

        const refreshTokenResult = await refreshTokenService(token)

        if(refreshTokenResult){
            res.json({
                message: "Refresh Token Success!",
                accessToken: refreshTokenResult
            });
        }

    } catch (error) {
        console.log("Refresh Token Error:", error);
        res.status(403).json({
            message: "Invalid or Expired Refresh Token"
        });
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies['secure-cookie-jwt'];
        
        if(!refreshToken){
            return res.status(401).json({
                message: "No Refresh Token provided"
            });
        }

        await logoutService(refreshToken)

        res.clearCookie('secure-cookie-jwt');

        return res.status(200).json({
            message: "Logout Success!"
        });
        
    } catch (error) {
        console.log("Logout User Erorr:", error);

        // เปิดดูข้อความ error ที่ Service ส่งมา
        if(error instanceof Error) {
            return res.status(401).json({
                message: error.message
            });
        }

        res.status(401).json({
            message: "Internal Server Error"
        });
    }
}