import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signUp = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.json({ message: "Password does not match confirm password" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.json({ message: "User already registered" });
  }

  const hashedPassword = bcryptjs.hashSync(password, parseInt(process.env.saltRounds));

  try {
    const savedUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: `Done, Hello ${userName}`, savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: "Email is not registered" });
    }

    const isPasswordMatched = bcryptjs.compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ isLogin: true, id: user.id }, process.env.tokenKey, { expiresIn: "2h" });
    res.json({ message: "Welcome, you are logged in", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in" });
  }
};
