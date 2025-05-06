import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import { SignJWT } from "jose";
import { withTryCatch } from "../../../../utils/withTryCatch";
import { successResponse } from "../../../../utils/successResponse";
import { HttpException } from "../../../../utils/HttpException";
const signup = async (request: Request) => {
  const { email, password } = await request.json();
  const username = email.slice(0, email.indexOf('@'))

  if (!email || !password) throw new HttpException('Email and password are required',400)

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new HttpException("User already exists", 400);

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const userRole = await prisma.role.findFirst({ where: { name: "USER" }, });
  if (!userRole) throw new HttpException("Default role not found", 500)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name:username,
      roleId: userRole.id,
    },
  });

  // const token = await new SignJWT({ userId: user.id, role: userRole.name })
  //   .setProtectedHeader({ alg: "HS256" })
  //   .setExpirationTime("24h")
  //   .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return successResponse({
      data: {
        // token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: userRole.name,
        },
      },
      status: 201,
      message: 'User created successfully'
    });
  
}


export const POST = withTryCatch(signup)