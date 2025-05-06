import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import { SignJWT } from "jose";
import { withTryCatch } from "../../../../utils/withTryCatch";
import { successResponse } from "../../../../utils/successResponse";
import { HttpException } from "../../../../utils/HttpException";
const signin = async (request: Request) => {

  const { email, password } = await request.json();
  if (!email || !password) throw new HttpException('Email and password are required', 400)


  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) throw new HttpException("Invalid credentials", 401)


  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hashedPassword !== user.password) throw new HttpException('Invalid credentials', 401)

  // Create JWT token
  const token = await new SignJWT({ userId: user.id, role: user.role.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return successResponse({
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    },
    status: 200,
  });
}
export const POST = withTryCatch(signin)