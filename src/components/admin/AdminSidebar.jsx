"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Users, 
  MessageSquare, 
  ChevronRight, 
  Globe,
  // New Icons for Categories
  Briefcase, 
  FlaskConical, 
  Clapperboard 
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 1. Main Menu Items
  const mainItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'All News', icon: FileText, href: '/admin/news' },
    { name: 'Create Article', icon: PlusCircle, href: '/admin/news/create' },
    { name: 'Globe Feed', icon: Globe, href: '/admin/globe/create' },
  ];

  // 2. New Category Section (Jo tujhe alag se chahiye tha)
  const categoryItems = [
    { name: 'Business', icon: Briefcase, href: '/admin/category/business' },
    { name: 'Science', icon: FlaskConical, href: '/admin/category/science' },
    { name: 'Entertainment', icon: Clapperboard, href: '/admin/category/entertainment' },
  ];

  // 3. System/Admin Items
  const systemItems = [
    { name: 'Users', icon: Users, href: '/admin/users', restricted: true },
    { name: 'Comments', icon: MessageSquare, href: '/admin/comments' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  // Helper function to render links (taaki code repeat na ho)
  const renderMenuItem = (item) => {
    // Security Check
    if (item.restricted && session?.user?.role !== 'superadmin') {
      return null;
    }

    const isActive = pathname === item.href;
    
    return (
      <Link 
        key={item.href} 
        href={item.href}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center gap-3">
            <item.icon size={20} className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"} />
            {item.name}
        </div>
        {isActive && <ChevronRight size={16} className="text-indigo-500" />}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm z-50">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2">
            Nova<span className="text-gray-800">Admin</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* --- Main Section --- */}
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
        {mainItems.map(renderMenuItem)}

        {/* --- Categories Section (NEW) --- */}
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Categories</p>
        {categoryItems.map(renderMenuItem)}

        {/* --- System Section --- */}
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">System</p>
        {systemItems.map(renderMenuItem)}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all font-medium text-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}