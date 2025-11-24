export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
export const preferredRegion = "auto";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch All Users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}

// POST: Create New User
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      image: "",
      provider: "credentials",
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

// PUT: Update User Role
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json(
        { message: "Only SuperAdmin can edit roles" },
        { status: 403 }
      );
    }

    const { id, role } = await request.json();
    await dbConnect();

    await User.findByIdAndUpdate(id, { role });
    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}

// DELETE: Delete User
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json(
        { message: "Only SuperAdmin can delete users" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await dbConnect();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}
