import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route"; 

export const auth = () => getServerSession(authOptions);
