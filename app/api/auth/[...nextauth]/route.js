import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        id: {},
      },
      async authorize(credentials) {
        try {
          const teacherRef = doc(db, "teachers", credentials.id);
          const teacherDoc = await getDoc(teacherRef);

          if (!teacherDoc.exists()) {
            throw new Error("Teacher not found");
          }

          const teacherData = teacherDoc.data();
          const { isVerified, password } = teacherData;

          if (!isVerified) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            await updateDoc(teacherRef, {
              password: hashedPassword,
              isVerified: true,
            });

            return {
              id: teacherDoc.id,
              email: teacherData.email,
              name: teacherData.name,
            };
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: teacherDoc.id,
            email: teacherData.email,
            name: teacherData.name,
          };
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          isAdmin: token.isAdmin, 
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const GET = handler;
export const POST = handler;
