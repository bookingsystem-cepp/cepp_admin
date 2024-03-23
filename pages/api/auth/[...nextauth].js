import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['jinokrit@gmail.com', '64010022@kmitl.ac.th'];

const DEFAULT_SCORES = 100;
const DEFAULT_YEAR = new Date().getFullYear();

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session, token, user}) => {
      if (adminEmails.includes(session?.user?.email)) {
        if (user) {
          // If user is present, update user data with default values
          const updatedUser = {
            ...user,
            username: user.email.split('@')[0],
            firstname: user.name.split(' ')[0],
            lastname: user.name.split(' ')[1],
            tel: null,
            year: DEFAULT_YEAR,
            scores: DEFAULT_SCORES,
          };
          
          // Update user data in the database
          await MongoDBAdapter(clientPromise).updateUser(updatedUser);
  
          // Return updated session
          return { ...session, user: updatedUser };
        }
        return session;
      } else {
        return false;
      }
    },
  }
}

export default NextAuth(authOption)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOption);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}