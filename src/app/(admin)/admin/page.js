"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, FileText, Eye, Activity, ArrowUpRight, Loader2 } from 'lucide-react';

// 🔥 FIX: StatCard ab 'theme' prop lega jisme background aur text color dono set honge
const StatCard = ({ title, value, icon: Icon, themeColor, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      {/* Icon Box */}
      <div className={`p-3 rounded-xl ${themeColor}`}>
        <Icon size={22} />
      </div>
      
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
        <ArrowUpRight size={12} /> {trend}
      </span>
    </div>

    {/* Value & Title (Text Color Forced to Gray/Black) */}
    <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
  </div>
);

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ users: 0, articles: 0 });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, newsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/news')
        ]);

        const usersData = await usersRes.json();
        const newsData = await newsRes.json();

        const userCount = Array.isArray(usersData) ? usersData.length : usersData.data?.length || 0;
        
        let newsArray = [];
        if (Array.isArray(newsData)) newsArray = newsData;
        else if (newsData.data) newsArray = newsData.data;

        const newsCount = newsArray.length;

        setStats({ users: userCount, articles: newsCount });
        setRecentNews(newsArray.slice(0, 5)); 

      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-gray-900"> {/* Ensures global text is dark in this page */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, <span className="font-bold text-indigo-600">{session?.user?.name || "Admin"}</span>. Here's what's happening today.
        </p>
      </div>
      
      {/* Stats Grid - 🔥 COLORS FIXED HERE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <StatCard 
          title="Total Articles" 
          value={loading ? "..." : stats.articles} 
          icon={FileText} 
          themeColor="bg-blue-100 text-blue-600" // Direct Tailwind Classes
          trend="Live" 
        />
        
        <StatCard 
          title="Total Views" 
          value="45.2k" 
          icon={Eye} 
          themeColor="bg-indigo-100 text-indigo-600" 
          trend="8%" 
        />
        
        <StatCard 
          title="Total Users" 
          value={loading ? "..." : stats.users} 
          icon={Users} 
          themeColor="bg-orange-100 text-orange-600" 
          trend="Live" 
        />
        
        <StatCard 
          title="System Health" 
          value="98%" 
          icon={Activity} 
          themeColor="bg-emerald-100 text-emerald-600" 
          trend="Stable" 
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Recent Articles Added</h3>
        </div>
        
        {loading ? (
           <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : recentNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentNews.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-4 pl-6 font-medium text-gray-800 line-clamp-1">{item.title}</td>
                    <td className="p-4 text-sm text-gray-500">{item.category}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right pr-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status || "Published"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-3 border border-gray-100">
              <FileText size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No recent activity found right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}