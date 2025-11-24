"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowLeft, Loader2, MapPin, Navigation, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function CreateGlobeFeed() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 🔥 CLOUDINARY CONFIG (Apna same wala use kar)
  const CLOUD_NAME = "dww4abn9g"; 
  const UPLOAD_PRESET = "novanews_preset"; 

  const popularCities = [
    { name: "Select a City...", lat: "", lng: "" },
    { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Dubai", lat: 25.2048, lng: 55.2708 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Moscow", lat: 55.7558, lng: 37.6173 },
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  ];

  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    summary: "",
    imageUrl: "",
    city: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (e) => {
    const selectedCity = popularCities.find(c => c.name === e.target.value);
    if (selectedCity) {
      setFormData(prev => ({
        ...prev,
        city: selectedCity.name,
        lat: selectedCity.lat,
        lng: selectedCity.lng
      }));
    }
  };

  // 🔥 Handle Image Upload Logic
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data
      });
      const uploadedImage = await res.json();
      
      if (uploadedImage.secure_url) {
        setFormData({ ...formData, imageUrl: uploadedImage.secure_url });
      } else {
        alert("Upload Failed! Check Cloudinary Settings.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title || !formData.lat || !formData.lng) {
        alert("Please fill Title and Location data.");
        return;
    }
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        summary: formData.summary,
        content: formData.summary,
        imageUrl: formData.imageUrl,
        status: "Published",
        location: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            city: formData.city
        },
        tags: ["globe-feed"] 
      };

      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("🌍 Pinned to Globe Successfully!");
        router.push("/admin/news"); 
        router.refresh();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white border rounded-full hover:bg-gray-50 transition text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
             <Globe className="text-blue-600" /> Add Globe Feed
          </h1>
          <p className="text-gray-500 text-sm">Pin a quick update to the 3D Globe map.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Content */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                1. Feed Details
            </h3>
            
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline</label>
                <input name="title" required type="text" placeholder="e.g. AI Summit in Tokyo" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" onChange={handleChange} />
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Short Summary (Popup Text)</label>
                <textarea name="summary" required rows="4" placeholder="What's happening? (Max 150 chars)" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 bg-white" onChange={handleChange} />
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select name="category" className="w-full border border-gray-300 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" onChange={handleChange}>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Science">Science</option>
                    <option value="Politics">Politics</option>
                    <option value="Sports">Sports</option>
                </select>
            </div>

            {/* 🔥 IMAGE UPLOAD UI */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Feed Image</label>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />

                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden bg-white"
                >
                  {imageUploading ? (
                    <Loader2 className="animate-spin text-blue-600" />
                  ) : formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <UploadCloud className="mx-auto mb-2 text-blue-400" />
                      <span className="text-sm">Click to Upload Image</span>
                    </div>
                  )}
                </div>
            </div>

          </div>
        </div>

        {/* RIGHT: Location */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2 flex items-center gap-2">
                <MapPin size={18} /> 2. Geo Location
            </h3>
            
            <div className="mb-4">
                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Quick Select City</label>
                <select className="w-full border border-blue-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" onChange={handleCitySelect}>
                    {popularCities.map((city, i) => (
                        <option key={i} value={city.name}>{city.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Or Type City Name</label>
                <input name="city" type="text" value={formData.city} placeholder="Custom City Name" className="w-full border border-blue-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Latitude</label>
                    <input name="lat" type="number" step="any" value={formData.lat} placeholder="0.00" className="w-full border border-blue-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Longitude</label>
                    <input name="lng" type="number" step="any" value={formData.lng} placeholder="0.00" className="w-full border border-blue-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white" onChange={handleChange} />
                </div>
            </div>

            <div className="text-xs text-blue-700 bg-blue-100/50 p-3 rounded-lg border border-blue-200 flex items-start gap-2">
                <Navigation size={14} className="mt-0.5 shrink-0" />
                <span>
                    <strong>Tip:</strong> Globe uses these coordinates to place the glowing dot. 
                    <br/> Search Google: "Coordinates of [City Name]"
                </span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Globe size={20} />} 
            {loading ? "Pinning to Globe..." : "Pin to Globe"}
          </button>
        </div>

      </form>
    </div>
  );
}