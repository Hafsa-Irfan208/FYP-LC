import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get session on the server-side
export async function getSessionServer(req, res) {
  return await getServerSession(req, res, authOptions);
}

// Get session on the client-side
export { useSession } from "next-auth/react";
