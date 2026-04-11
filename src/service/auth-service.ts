import bcrypt from "bcrypt"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import jwt from 'jsonwebtoken'
import { error } from "node:console"

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString});
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export const createUserService = async (email: string , password: string ) => {

    const user = await prisma.user.findUnique({
        where: {
            email : email
        }
    })

    if(user){
        return {error : "email is already registered"}
    }
    
    const saltRounds = 12;
    const hashedPassword =  await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
        data: {
            email : email,
            password : hashedPassword
        }
    })

    return{
        id : newUser.id,
        email : email
    }
}

export const loginUserService = async (email: string , password: string) :Promise<{ accessToken: string, refreshToken: string}> => {
    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if(!user){
        throw new Error ('Invalid email or password!'); 
    }

    const ismatch = await bcrypt.compare(password, user.password)

    if(!ismatch){
        throw new Error ('Invalid email or passwprd!')
    }

    const payload = {userId: user.id, email: user.email};
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d'})

    // Update Refresh Token เก็บไว้ใน DB 
    await prisma.user.update({ 
        where : {
            id : user.id
        },
        data : {
            refreshToken : refreshToken
        }
    });

    return {accessToken, refreshToken};

}


export const refreshTokenService = async (refreshToken: string) => {
    const Refreshtoken = await prisma.user.findFirst({ 
        where: {
            refreshToken : refreshToken
        }
    })

    if(!Refreshtoken){
       throw new Error('Refresh token Invalid')
    }

    const ValidToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;

    const payloadForNewToken = {
        id: ValidToken.id
    };

    const newAccessToken = jwt.sign(payloadForNewToken, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15m'});

    return newAccessToken;

}

export const logoutService = async (refreshToken: string) => {
    const user = await prisma.user.findFirst({
        where : {
            refreshToken : refreshToken
        }
    })

    if(!user){
        throw new Error ('Invalid or Expired Refresh Token');
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: null
        }
    });
}