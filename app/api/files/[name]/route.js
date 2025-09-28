// app/api/files/[name]/route.js
import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function GET(request, { params }) {
  const file = memoryStore.find((f) => f.name === params.name);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.data, {
    headers: {
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Content-Type": "application/octet-stream",
    },
  });
}
