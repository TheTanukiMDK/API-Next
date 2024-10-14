import type { NextApiRequest ,NextApiResponse } from "next";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { error } from "console";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface LoginResponse{
    token?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>
){
    const {method} = req 
    
    if(method == 'POST'){
        const {username, password} = req.body

        //buscar el usuario en base de datos (arreglo)
        //const userBd = users.find((u) => u.username === username)
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if (!user){
            return res.status(401).json({error:"El usuario no existe en la base dde datos"})
        }
        //const isPasswordValid = await bcrypt.compare(password, userBd.password)

        /*if(!isPasswordValid){
            return res.status(401).json({error:'Contraseña incorrecta'});
        }*/

        //generar el token JWT
        const token = jwt.sign(
            {userId: user.id, username: user.username},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );
        return res.status(200).json({token})
    }

    if(method != 'POST'){
        res.setHeader('Allow', ['POST'])
        return res.status(405).end(`Metodo ${method} no permitido`)
    }
}