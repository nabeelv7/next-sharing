// app/api/upload/route.js
import { NextResponse } from "next/server";
import { addFile } from "@/lib/store";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  addFile({ name: file.name, data: buffer });

  return NextResponse.json({ success: true });
}
