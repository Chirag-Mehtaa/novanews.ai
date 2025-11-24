"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Plus, Loader2, User, X, CheckCircle, Trash2, 
  ChevronLeft, Image as ImageIcon, Star, Layout, Globe, UploadCloud
} from 'lucide-react';
import { useSession } from 'next-auth/react'; 
import { Editor } from '@tinymce/tinymce-react';

export default function CategoryPage() {
  const { data: session } = useSession(); 
  const params = useParams(); 
  
  // 🔥 FIX 1: URL se category lo aur Pehla akshar bada karo (business -> Business)
  // Taaki Frontend par sahi match ho sake.
  const rawCat = params.catName; 
  const categoryName = rawCat ? rawCat.charAt(0).toUpperCase() + rawCat.slice(1) : "";

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- STATE MANAGEMENT ---
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    title: "", 
    summary: "",
    content: "", 
    imageUrl: "", 
    author: session?.user?.name || "Admin",
    category: categoryName, // ✅ Ab ye "Business" save hoga (Capital B)
    isFeatured: true, 
    status: "Draft",
    tags: ""
  });

  // Update formData when categoryName changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, category: categoryName }));
  }, [categoryName]);

  const CLOUD_NAME = "dww4abn9g"; 
  const UPLOAD_PRESET = "novanews_preset";

  // --- 1. FETCH NEWS (FIXED FILTER) ---
  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      let allNews = Array.isArray(data) ? data : data.data || [];
      
      // 🔥 FIX 2: Array Filter Logic Check
      const filtered = allNews.filter(item => {
        const targetCat = categoryName.toLowerCase();
        
        // Agar DB me category Array hai (New Style)
        if (Array.isArray(item.category)) {
            return item.category.some(c => c.toLowerCase() === targetCat);
        }
        // Agar DB me category String hai (Old Style)
        return item.category?.toLowerCase() === targetCat;
      });

      setNews(filtered);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(categoryName) fetchNews(); }, [categoryName]);

  // --- 2. IMAGE UPLOAD LOGIC ---
  const handleImageFileSelect = async (e) => {
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
        if(uploadedImage.secure_url) {
            setFormData({ ...formData, imageUrl: uploadedImage.secure_url });
        } else {
            alert("Upload Failed!");
        }
    } catch (error) {
        alert("Error uploading image.");
    } finally {
        setImageUploading(false);
    }
  };

  // --- 3. CREATE / PUBLISH LOGIC ---
  const handleCreate = async () => {
    if(!formData.title) return alert("Please enter a headline.");
    
    setCreating(true);
    try {
        const content = editorRef.current ? editorRef.current.getContent() : formData.content;

        const generatedSlug = formData.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const res = await fetch("/api/admin/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                ...formData, 
                content, 
                // Ensure category is sent correctly (Backend handles array conversion)
                category: categoryName, 
                slug: generatedSlug 
            }),
        });
        
        if (res.ok) {
            alert("Story Published Successfully!");
            // Reset form
            setFormData({ 
              title: "", summary: "", content: "", imageUrl: "", 
              author: session?.user?.name || "Admin", category: categoryName,
              isFeatured: true, status: "Draft", tags: ""
            });
            setIsEditorOpen(false); 
            fetchNews(); 
        }
    } catch (error) {
        console.error(error);
        alert("Failed to publish.");
    } finally {
        setCreating(false);
    }
  };

  // --- 4. DELETE LOGIC ---
  const handleDelete = async (id) => {
    if(!confirm("Delete this article?")) return;
    try {
        const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
        if(res.ok) setNews(prev => prev.filter(item => item._id !== id));
    } catch (error) { console.error(error); }
  };

  // --- RENDER: MAIN LIST VIEW ---
  if (!isEditorOpen) {
    return (
      <div className="p-8 max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{categoryName} News</h1>
              <p className="text-gray-500 text-sm mt-1">Manage articles for {categoryName}.</p>
          </div>
          <button 
              onClick={() => setIsEditorOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Create New Story
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
              <div className="p-12 flex justify-center text-indigo-600"><Loader2 size={32} className="animate-spin" /></div>
          ) : (
              <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-xs uppercase font-semibold">
                      <th className="p-6">Headline</th><th className="p-6">Location</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                      <td className="p-6">
                          <div className="font-bold text-gray-900 line-clamp-1">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                             <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                      </td>
                      <td className="p-6">
                          {item.isFeatured ? (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                <Star size={12}/> Market Intel
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                <Globe size={12}/> Global Feed
                            </span>
                          )}
                      </td>
                      <td className="p-6"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{item.status || "Published"}</span></td>
                      <td className="p-6 text-right">
                          <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                      </td>
                  </tr>
                  ))}
                  {news.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-gray-400">No stories yet.</td></tr>}
              </tbody>
              </table>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: EDITOR VIEW ---
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-4">
            <button onClick={() => setIsEditorOpen(false)} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium">
                <ChevronLeft size={18} /> Back
            </button>
            <h2 className="text-xl font-bold text-gray-900">Create New {categoryName} Story</h2>
         </div>
         <div className="flex items-center gap-3">
             <button onClick={() => setIsEditorOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 text-sm">
                 Cancel
             </button>
             <button onClick={handleCreate} disabled={creating} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-sm flex items-center gap-2">
                 {creating ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Publish</>}
             </button>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 grid grid-cols-12 gap-8">
          
          {/* LEFT: Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Headline Input */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <input 
                    type="text" 
                    placeholder="Enter Headline..." 
                    className="w-full text-4xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 p-0 bg-transparent"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
              </div>

              {/* Summary */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Summary / Excerpt</label>
                  <textarea 
                    rows="2"
                    placeholder="Short description for the card..." 
                    className="w-full text-gray-600 bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-100 resize-none outline-none"
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  />
              </div>

              {/* TinyMCE Editor */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>Start writing...</p>"
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: ['link', 'image', 'lists', 'code', 'table', 'wordcount'],
                      toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | removeformat',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                    }}
                  />
              </div>
          </div>

          {/* RIGHT: Settings */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Display Location */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                     <Layout size={16} className="text-indigo-600"/> Display Location
                  </h3>
                  
                  <div className="space-y-3">
                      <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.isFeatured ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                          <input type="radio" name="displayType" className="hidden" checked={formData.isFeatured === true} onChange={() => setFormData({...formData, isFeatured: true})} />
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3"><Star size={18} /></div>
                          <div><div className="font-bold text-gray-800 text-sm">Market Intelligence</div><div className="text-xs text-gray-500">Hero Section (Big Slider)</div></div>
                          {formData.isFeatured && <CheckCircle size={16} className="ml-auto text-indigo-600"/>}
                      </label>
                      
                      <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${!formData.isFeatured ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                          <input type="radio" name="displayType" className="hidden" checked={formData.isFeatured === false} onChange={() => setFormData({...formData, isFeatured: false})} />
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3"><Globe size={18} /></div>
                          <div><div className="font-bold text-gray-800 text-sm">Global Market Feed</div><div className="text-xs text-gray-500">Standard News List</div></div>
                          {!formData.isFeatured && <CheckCircle size={16} className="ml-auto text-indigo-600"/>}
                      </label>
                  </div>
              </div>

              {/* Image Upload */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Cover Image</h3>
                  
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileSelect} className="hidden" />
                  <input type="text" placeholder="Or Paste Image URL..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}/>

                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative"
                  >
                      {imageUploading ? (
                          <Loader2 className="animate-spin text-indigo-600" />
                      ) : formData.imageUrl ? (
                          <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                          <div className="text-gray-400 flex flex-col items-center gap-2">
                              <UploadCloud size={32} className="text-indigo-400" />
                              <span className="text-sm font-medium text-gray-600">Click to Upload Image</span>
                          </div>
                      )}
                  </div>
              </div>

              {/* Status & Tags */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div><label className="text-xs text-gray-500 mb-1 block">Status</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Tags</label><input type="text" placeholder="e.g., Finance, Tech..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})}/></div>
              </div>

          </div>
      </div>
    </div>
  );
}