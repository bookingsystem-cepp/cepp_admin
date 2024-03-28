import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import axios from 'axios';

const adminEmails = ['jinokrit@gmail.com', '64010022@kmitl.ac.th','64010001@kmitl.ac.th'];

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
    // async signIn(user, account, profile) {
    //   // You can perform additional actions after successful sign-in
    //   return true;
    // },
    // async redirect(url, baseUrl) {
    //   // Redirect to the desired page after sign-in
    //   return baseUrl;
    // },
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
    
          // const res = await axios.post(
          //   process.env.API_PATH+'/api/auth/generate-token',
          //   {
          //     email: session?.user?.email,
          //   })

          // Update user data in the database
          await MongoDBAdapter(clientPromise).updateUser(updatedUser);
  
          // Return updated session access_token: res.data.access_token
          return { ...session, user: updatedUser, token };
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