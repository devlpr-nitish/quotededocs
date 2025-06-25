import { hashPassword } from "@/lib/password-hash";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    try {
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json({user, message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

}