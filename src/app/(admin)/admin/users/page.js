"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react"; // 🔥 Lock icon import kiya

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. SECURITY CHECK
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== 'superadmin') {
        router.push("/admin"); 
    } else {
        fetchUsers();
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else if (data.data) setUsers(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.password) return alert("All fields required");
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { alert("User Created!"); setFormData({ name: "", email: "", password: "", role: "user" }); fetchUsers(); } 
    else { const err = await res.json(); alert(err.message); }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Delete user?")) return;
    const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
    if (res.ok) fetchUsers(); else alert("Failed.");
  };

  const openEditModal = (user) => { setEditingUser(user); setIsModalOpen(true); };

  const handleUpdateRole = async () => {
    if(!editingUser) return;
    const res = await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingUser._id, role: editingUser.role }) });
    if (res.ok) { setIsModalOpen(false); setEditingUser(null); fetchUsers(); } else { alert("Failed."); }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "superadmin": return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (status === "loading" || (session?.user?.role !== 'superadmin')) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-900">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Super Admin Access Only.</p>
        </div>
        <div className="text-right">
           <span className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm font-medium text-gray-600">
             Total: <strong className="text-black">{users.length}</strong>
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add User</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="border p-2 rounded text-gray-900" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              <input type="email" placeholder="Email" className="border p-2 rounded text-gray-900" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} required />
              <input type="password" placeholder="Password" className="border p-2 rounded text-gray-900" value={formData.password} onChange={(e)=>setFormData({...formData, password:e.target.value})} required />
              <select className="border p-2 rounded bg-white text-gray-900" value={formData.role} onChange={(e)=>setFormData({...formData, role:e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
            </form>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4">{user.name}<br/><span className="text-xs text-gray-500">{user.email}</span></td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs rounded border ${getRoleBadge(user.role)} uppercase`}>{user.role}</span></td>
                    
                    {/* 🔥 ACTIONS COLUMN FIXED */}
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                            
                            {/* Agar Super Admin hai, to Buttons ki jagah LOCK dikhao */}
                            {user.role === 'superadmin' ? (
                                <span className="p-2 text-gray-400 cursor-not-allowed" title="Protected Account">
                                    <Lock size={18} />
                                </span>
                            ) : (
                                // Agar Normal user/admin hai to Edit/Delete dikhao
                                <>
                                    <button 
                                        onClick={() => openEditModal(user)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Role"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(user._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </>
                            )}

                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-xl w-96">
              <h3>Edit Role</h3>
              <select className="w-full border p-2 mb-4 text-gray-900" value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}>
                 <option value="user">User</option>
                 <option value="admin">Admin</option>
                 {/* Super Admin ka option hata diya taaki galti se koi kisi ko superadmin na bana de */}
              </select>
              <button onClick={handleUpdateRole} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="ml-2 text-gray-600">Cancel</button>
           </div>
        </div>
      )}
    </div>
  );
}