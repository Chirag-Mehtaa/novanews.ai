import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET() {
  try {
    await connectDB();
    
    // Database ke saare collections (folders) ki list nikalo
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    const report = [];

    // Har collection ko check karo ki usme kitna data hai
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      report.push({
        collectionName: col.name,
        documentCount: count
      });
    }

    return NextResponse.json({ 
        message: "Database Scan Complete",
        foundCollections: report
    });

  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}