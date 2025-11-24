import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminSidebar from "@/components/admin/AdminSidebar"; 

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 1. Login Check
  if (!session) {
    redirect("/login");
  }

  // 2. Master Email Logic
  const SUPER_ADMIN_EMAIL = 'chirag.mehta25072005@gmail.com';
  
  const isAdmin = 
    session.user.role === 'admin' || 
    session.user.role === 'superadmin' ||
    session.user.email === SUPER_ADMIN_EMAIL;

  // 3. Security Check
  if (!isAdmin) {
    redirect("/"); 
  }

  return (
    // 🔥 FIX: 
    // 1. 'bg-white' lagaya hai (Solid color taaki peeche ka kuch na dikhe)
    // 2. 'z-[9999]' aur 'relative' lagaya hai (Taaki ye layer sabse upar rahe)
    <div className="flex h-screen bg-white relative z-[9999]">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-y-auto bg-gray-50 [&::-webkit-scrollbar]:hidden">
        {children}
      </main>
    </div>
  );
}