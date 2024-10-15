import type { NextApiRequest ,NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { error } from "console";

const prisma = new PrismaClient()

interface UserResponse{
    username?: string;
    password?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserResponse>
){
    const {method} = req;
    if (method == 'POST'){
        const {username, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.users.create({
            data:{
                username: username,
                password: hashedPassword
            }
        })
        console.log('Usuario creado', user)
        return res.status(200).json({username, password})
    }
    }
