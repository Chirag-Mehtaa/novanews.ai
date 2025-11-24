import mongoose from 'mongoose';

const GlobeFeedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true }, // Popup text
  category: { type: String, default: 'Technology' },
  imageUrl: { type: String }, // 🔥 Image URL yahan store hoga
  location: {
    lat: { type: Number, required: true }, // Globe coordinates
    lng: { type: Number, required: true },
    city: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GlobeFeed || mongoose.model('GlobeFeed', GlobeFeedSchema);