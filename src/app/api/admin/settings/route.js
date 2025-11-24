export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;


import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Config from "@/models/Config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. GET: Current Settings Fetch karo
export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // User Data
    const user = await User.findById(session.user.id);
    
    // Global Config (Find first or create default)
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({ maintenanceMode: false });
    }

    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        image: user.image,
        emailNotifications: user.preferences?.emailNotifications ?? true,
      },
      config: {
        maintenanceMode: config.maintenanceMode
      }
    });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
  }
}

// 2. PUT: Settings Update karo
export async function PUT(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    // 1. Update User Profile
    await User.findByIdAndUpdate(session.user.id, {
      name: body.name,
      "preferences.emailNotifications": body.emailNotifications
    });

    // 2. Update Global Config (Sirf Admin/Superadmin kar sake)
    if (session.user.role === 'admin' || session.user.role === 'superadmin') {
      await Config.findOneAndUpdate({}, {
        maintenanceMode: body.maintenanceMode
      }, { upsert: true }); // Agar nahi hai to bana do
    }

    return NextResponse.json({ message: "Settings Updated Successfully!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
  }
}