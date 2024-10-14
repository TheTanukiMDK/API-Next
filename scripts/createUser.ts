import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { error } from "console";

const prisma = new PrismaClient()

async function createUser(){
    const hashedPassword = await bcrypt.hash('algo_test', 10)
    
        const user = await prisma.user.create({
            data:{
                username: 'universe',
                password: hashedPassword
            }
        })

        console.log('usuario creado', user)
    }

createUser().catch((e) => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})
