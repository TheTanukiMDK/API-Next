import type { NextApiRequest ,NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { userAgent } from "next/server";
import { error } from "console";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface AuthenticatedRequest extends NextApiRequest{
    user?:{
        userId: number;
        userName: string;
    }
}

export default async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse
){
    const { authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Sin autorizacion'})
    }

    try {
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) 
        
        const user = await prisma.users.findUnique({
            where:{id: decoded.userId}
        })
        //decodificar el token y alamcenar en request
        req.user = decoded as {userId: number; userName: string};
        if(!user){
            return res.status(401).json({ error: 'Usuario no autorizado' });
        }


        return res.status(200).json({message: 'La ruta esta protegida para este usuario', user: req.user})

    } catch(err){
        return res.status(401).json({error: 'TOKEN INVALIDO'})
    }

} 