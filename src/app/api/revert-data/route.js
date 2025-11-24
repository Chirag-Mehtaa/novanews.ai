import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import News from '@/models/News';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET() {
  try {
    await connectDB();

    // Saara data fetch karo raw format mein
    const allNews = await News.find({}).lean(); 
    let fixedCount = 0;

    for (const item of allNews) {
      // Check: Agar category Array hai (matlab naye code se save hui thi)
      if (Array.isArray(item.category)) {
        
        console.log(`Reverting: ${item.title}`);

        // Array ka pehla item nikal kar wapis String bana do
        // e.g., ["Business"] -> "Business"
        const oldStringValue = item.category.length > 0 ? item.category[0] : "General";

        await News.updateOne(
            { _id: item._id },
            { $set: { category: oldStringValue } } 
        );
        
        fixedCount++;
      }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Sab pehle jaisa ho gaya! ${fixedCount} articles fixed.`,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}