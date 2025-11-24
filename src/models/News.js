import mongoose from 'mongoose';

// Define the schema for a single Comment
const CommentSchema = new mongoose.Schema({
    // CRITICAL: This 'content' field must match the data being saved from the API route.
    content: { type: String, required: true, trim: true },
    
    authorId: { type: String, required: true }, // Links the comment to the user's ID
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' // All new comments start as Pending for moderation
    },
}, { timestamps: true }); // Adds createdAt and updatedAt to each comment

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    
    category: { type: [String], required: true, default: [] },

    summary: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: false },
    tags: { type: [String], default: [] },
    status: { type: String, default: 'Draft' },
    isFeatured: { type: Boolean, default: false },
    sentiment: { 
        type: String, 
        enum: ['Positive', 'Neutral', 'Negative'], 
        default: 'Neutral' 
    },
    author: { type: String, default: 'Nova Admin' },
    views: { type: Number, default: 0 },
    
    // FIX: Define the comments array using the CommentSchema
    comments: [CommentSchema], 

    location: {
        lat: { type: Number, default: 28.6139 },
        lng: { type: Number, default: 77.2090 },
        city: { type: String, default: "New Delhi" }
    }

}, { timestamps: true }); // Adds createdAt and updatedAt to the article

const News = mongoose.models.News || mongoose.model('News', NewsSchema, 'news');

export default News;