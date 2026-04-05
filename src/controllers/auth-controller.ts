import {Request, Response} from "express"
import { createUserService, loginUserService, refreshTokenService } from "../service/auth-service";

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

        const loginResult = await loginUserService(email, password)

        if(!loginResult){
            return res.status(400).json({
                message : "Invalid email or password"
            });
        }else{
            return res.status(200).json({
                mesaage : " Login Successfully!", token: loginResult
            })
        }

    }catch(error){
        console.log("Error in LoginUser", error);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }

}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const {token} = req.body;
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