"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "", 
    emailNotifications: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        
        if (data.profile) {
          setFormData({
            name: data.profile.name || "",
            email: data.profile.email || "",
            image: data.profile.image || "",
            emailNotifications: data.profile.emailNotifications,
            maintenanceMode: data.config.maintenanceMode,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchSettings();
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Settings Saved Successfully! 🎉");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center flex justify-center text-gray-900"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-900"> {/* 🔥 Main container text color fixed */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and system preferences.</p>
      </div>

      {/* --- ADMIN PROFILE --- */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User size={20} className="text-blue-600" /> Admin Profile
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 overflow-hidden border-4 border-white shadow-md">
              {formData.image ? (
                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                formData.name?.[0]?.toUpperCase() || "A"
              )}
            </div>
            <button className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md border border-gray-300 transition-colors">
              Change Avatar
            </button>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Display Name</label>
              {/* 🔥 Input text color fix */}
              <input
                type="text"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email (Read Only)</label>
              {/* 🔥 Readonly input text color fix */}
              <input
                type="email"
                disabled
                className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-lg text-gray-500 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONFIGURATION --- */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Configuration
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive alerts for new comments and users.</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.emailNotifications}
              onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
            <div>
              <h4 className="font-bold text-red-900">Maintenance Mode</h4>
              <p className="text-sm text-red-600">Take the site offline for everyone except admins.</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-red-600 rounded focus:ring-red-500 accent-red-600"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}