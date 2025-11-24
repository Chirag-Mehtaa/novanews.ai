"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react'; // ✅ TinyMCE Import
import { 
  Save, Upload, Link as LinkIcon, Image as ImageIcon, 
  RefreshCw, Loader2, Star, X, ChevronLeft, Hash 
} from 'lucide-react';

export default function EditNewsPage({ params }) {
  const router = useRouter();
  const [newsId, setNewsId] = useState(null);
  
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Technology',
    summary: '',
    content: '',
    status: 'Draft',
    imageUrl: '',
    isFeatured: false,
    sentiment: 'Neutral'
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    const initPage = async () => {
      try {
        const resolvedParams = await params;
        if (resolvedParams?.id) {
          setNewsId(resolvedParams.id);
          fetchNewsData(resolvedParams.id);
        }
      } catch (error) { console.error("Params Error:", error); }
    };
    initPage();
  }, [params]);

  const fetchNewsData = async (id) => {
    try {
      const res = await fetch(`/api/admin/news?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setFormData({
            ...data.data,
            sentiment: data.data.sentiment || 'Neutral'
        });
        setTags(data.data.tags || []);
        if(data.data.imageUrl) setPreviewImage(data.data.imageUrl);
      } else {
        alert("Error: News not found!");
        router.push('/admin/news');
      }
    } catch (error) { console.error("Fetch Error:", error); } finally { setLoading(false); }
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ TinyMCE Handler
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content: content }));
  };
  
  const toggleFeatured = () => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    setImageUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "novanews_preset"); 
    data.append("cloud_name", "dww4abn9g");          
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dww4abn9g/image/upload`, { method: "POST", body: data });
      const uploadImage = await res.json();
      if (uploadImage.secure_url) setFormData((prev) => ({ ...prev, imageUrl: uploadImage.secure_url }));
    } catch (error) { alert("Error uploading image"); } finally { setImageUploading(false); }
  };

  // --- Update Logic ---
  const handleUpdate = async () => {
    if(!formData.title || !formData.content) { alert("Title aur Content toh likho bhai!"); return; }
    if(imageUploading) { alert("Wait for image upload..."); return; }
    setUpdating(true);
    try {
        const { _id, createdAt, updatedAt, ...updateData } = formData;
        const res = await fetch(`/api/admin/news?id=${newsId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updateData, tags }),
        });
        if ((await res.json()).success) router.push('/admin/news');
    } catch (error) { console.error(error); } finally { setUpdating(false); }
  };

  if (loading) return <div className="flex justify-center p-20 text-indigo-600"><Loader2 size={40} className="animate-spin"/></div>;

  return (
    <div className="pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2 transition-colors"><ChevronLeft size={16}/> Back to List</button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Story</h1>
        </div>
        <div className="flex gap-3">
            <button onClick={() => router.push('/admin/news')} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm flex items-center gap-2">
                <X size={18} /> Cancel
            </button>
            <button onClick={handleUpdate} disabled={updating || imageUploading} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 text-sm disabled:opacity-70">
                {updating ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />} {updating ? 'Updating...' : 'Update Story'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full text-4xl font-extrabold text-gray-900 placeholder-gray-300 border-none focus:ring-0 outline-none p-0 bg-transparent" placeholder="Enter Headline..." />
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">
                <LinkIcon size={14} /> https://novanews.com/news/<input type="text" name="slug" value={formData.slug} onChange={handleChange} className="bg-transparent border-none focus:ring-0 text-gray-600 font-semibold w-full p-0" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Summary / Excerpt</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" className="w-full text-lg text-gray-700 placeholder-gray-400 border-none focus:ring-0 outline-none p-0 resize-none bg-transparent" placeholder="What is this story about?"></textarea>
          </div>

          {/* ✅ TINYMCE EDITOR ADDED HERE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
             <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content} // Old content loads here
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: 'link image lists table preview code',
                  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
                  content_style: 'body { font-family:Inter,sans-serif; font-size:16px; color: #333; }',
                  placeholder: "Start writing your masterpiece..."
                }}
             />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div onClick={toggleFeatured} className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all ${formData.isFeatured ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3"><div className={`p-2 rounded-full ${formData.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}><Star size={18} fill={formData.isFeatured ? "currentColor" : "none"} /></div><span className={`font-bold text-sm ${formData.isFeatured ? 'text-amber-700' : 'text-gray-500'}`}>Featured Story</span></div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-amber-500' : 'bg-gray-300'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${formData.isFeatured ? 'left-6' : 'left-1'}`}></div></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Organization</h3>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">{['Technology', 'Business', 'Science', 'World', 'Entertainment'].map(c => <option key={c} value={c}>{c}</option>)}</select>
            
            {/* Sentiment Dropdown */}
            <select name="sentiment" value={formData.sentiment} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"><option value="Positive">Positive</option><option value="Neutral">Neutral</option><option value="Negative">Negative</option></select>

            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"><option>Draft</option><option>Published</option><option>Archived</option></select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Cover Image</h3>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste Image URL..." className="w-full mb-3 bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleImageUpload} />
                {imageUploading ? <div className="text-indigo-600 font-bold text-xs"><Loader2 className="animate-spin"/> Uploading...</div> : (previewImage || formData.imageUrl) ? <img src={previewImage || formData.imageUrl} className="w-full h-full object-cover" /> : <div className="text-center"><div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 text-indigo-500"><ImageIcon size={18}/></div><p className="text-xs text-gray-500 font-medium">Click to Upload Image</p></div>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-3">{tags.map((tag, i) => (<span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold flex items-center gap-1">#{tag} <button onClick={() => removeTag(tag)} className="hover:text-indigo-900"><X size={12}/></button></span>))}</div>
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add tag..." className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}