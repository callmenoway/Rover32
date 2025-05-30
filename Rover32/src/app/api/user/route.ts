import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { hash } from "bcrypt"
import * as z from "zod"

//? Schema per la validazione dell'input utente
const userSchema = z
    .object({
        username: z.string().min(1, 'Username is required').max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must have than 8 characters')
    })

export async function POST(req: Request) {
    try{
        //? Parsing e validazione del body della richiesta
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        //! Controllo se esiste già un utente con la stessa email
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email}
        });
        if(existingUserByEmail) {
            return NextResponse.json({user: null, message: "User with this email alredy exists"}, {status: 409})
        }

        //! Controllo se esiste già un utente con lo stesso username
        const existingUserByUsername = await db.user.findFirst({
            where: { username: username }
        });
        if(existingUserByUsername) {
            return NextResponse.json({user: null, message: "User with this username alredy exists"}, {status: 409})
        }

        //? Hash della password con bcrypt
        const hashedPassword = await hash(password, 10);
        //? Creazione del nuovo utente nel database
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        
        //? Rimozione della password dall'oggetto restituito
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: newUserPassword, ...rest } = newUser;

        //? Risposta di successo con i dati dell'utente (senza password)
        return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201});
    }catch(error){
        //! Gestione degli errori generici
        console.error("Error: " + error);
        return NextResponse.json({message: "Something went wrong!"}, {status: 500});
    }
}