import {Request, Response} from "express"
import { createUserService, loginUserService } from "../service/auth-service";

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
                mesaage : " Login Successfully!"
            })
        }

    }catch(error){
        console.log("Error in LoginUser", error);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }

}