import next, { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'GET'){
        try{
            const products = await prisma.productos.findMany()
            res.status(200).json(products) 
        }catch(error){
            res.status(500).json({messaga:'Error al obtener', error})
        }
    }else if(req.method === 'POST'){
        const { nombre, descripcion, precio, stock } = req.body
        if(!nombre || !precio || !descripcion || !stock){
            return res.status(400).json({message: 'Te faltan campos para llenar', error})
        }
        try{
            const newProduct = await prisma.productos.create({
                data:{
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                    stock: parseInt(stock)
                }
            })
            res.status(201).json({newProduct})
        }catch(error){
            res.status(500).json({message:'Error al crear el producto', error})
        }
    }else if(req.method === 'PUT'){
        const { id, nombre, descripcion, precio, stock } = req.body
        if(!nombre || !precio || !descripcion || !stock){
            return res.status(400).json({message: 'Te faltan campos para llenar', error})
        }
        try{
            const updateProduct = await prisma.productos.update({
                where:{id: parseInt(id)},
                data:{
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                    stock: parseInt(stock)
                }
            })
            res.status(201).json({updateProduct})
        }catch(error){
            res.status(500).json({message:'Error al actualizar el producto', error})
        }
    }else if(req.method === 'DELETE'){
        const {id} = req.query

        if(!id){
            return res.status(400).json({message: 'por favor ingresa el id del producto', error})
        }

        try{
            const deleteProduct = await prisma.productos.delete({
                where: {id: parseInt(id as string)},
            })
            res.status(201).json({deleteProduct})
        }catch(Error){
            res.status(500).json({message: 'Error al eliminar el producto', error})
        }
    } else{
        res.status(405).json({message: 'Metodo no permitido o incorrecto', error})
    }
}