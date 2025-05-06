"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import * as crypto from 'crypto';

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = signinSchema.safeParse(Object.fromEntries(formData));
  

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }
    
    await createSession(user.id.toString());

    redirect("/home");
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error; //redirect internally throws an error so it should be called outside of try/catch blocks. Re-throw for Next.js to handle the redirect
    }
    console.error("Login error:", error);
    return {
      errors: {
        email: ["An error occurred during login"],
      },
    };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/signin");
}
