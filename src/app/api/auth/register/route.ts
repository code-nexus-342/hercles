import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const name = typeof body.name === "string" ? body.name.trim() : null;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Account already exists for this email." }, { status: 409 });
        }

        const passwordHash = await hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                passwordHash,
                name: name || null,
                role: "USER",
            },
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Unable to register right now." }, { status: 500 });
    }
}
