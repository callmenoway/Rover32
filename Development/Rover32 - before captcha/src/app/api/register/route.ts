import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import * as z from "zod";
import { hash } from "bcrypt";

//? Schema per la validazione degli input dell'utente
const userSchema = z
    .object({
        username: z.string().min(1, 'Username is required').max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must have than 8 characters')
    });

//? Handler POST per la registrazione di un nuovo utente
export async function POST(req: Request) {
    try {
        //? Estrazione e validazione dei dati dalla richiesta
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        //! Verifica se l'email esiste già nel database
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 });
        }

        //! Verifica se l'username esiste già nel database
        const existingUserByUsername = await db.user.findFirst({
            where: { username: username }
        });
        if (existingUserByUsername) {
            return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 409 });
        }

        //? Hashing della password con bcrypt (10 rounds)
        const hashedPassword = await hash(password, 10);
        
        //? Creazione del nuovo utente nel database
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        //? Rimozione della password dall'oggetto utente restituito
        const { password: newUserPassword, ...rest } = newUser;

        //? Risposta con successo
        return NextResponse.json({ user: rest, message: "User created successfully" });

    } catch (error) {
        //! Gestione degli errori generici
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}

//TODO Implementare verifica dell'email tramite token
//TODO Aggiungere validazione più forte per le password (simboli, maiuscole, numeri)
//TODO Implementare protezione contro attacchi di forza bruta con rate limiting
