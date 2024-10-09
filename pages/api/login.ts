import type { NextApiRequest ,NextApiResponse } from "next";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { error } from "console";

interface User {
    id:1;
    username:string;
    password:string;
}

interface LoginResponse{
    token?: string;
    error?: string;
}

//Registros (Simulacion de base de datos)

const users:User[] = [
    { 
    id: 1,
    username: "PABLO2",
    password: "1234",
    }
]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>
){
    const {method} = req 
    
    if(method == 'POST'){
        const {username, password} = req.body

        //buscar el usuario en base de datos (arreglo)
        const userBd = users.find((u) => u.username === username)
        

        if (!userBd){
            return res.status(401).json({error:"El usuario no existe en la base dde datos"})
        }
        //const isPasswordValid = await bcrypt.compare(password, userBd.password)

        /*if(!isPasswordValid){
            return res.status(401).json({error:'Contraseña incorrecta'});
        }*/

        //generar el token JWT
        const token = jwt.sign(
            {userId: userBd.id, userName: userBd.username},
            process.env.JWT_SECRET as string,
            {expiresIn: '50s'}
        );
        return res.status(200).json({token})
    }

    if(method != 'POST'){
        res.setHeader('Allow', ['POST'])
        return res.status(405).end(`Metodo ${method} no permitido`)
    }
}