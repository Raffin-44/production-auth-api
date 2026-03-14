import bcrypt from "bcrypt"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

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

export const loginUserService = async (email: string , password: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if(!user){
        return false
    }

    const ismatch = await bcrypt.compare(password, user.password)

    if(!ismatch){
        return false;
    }

    return true;

}