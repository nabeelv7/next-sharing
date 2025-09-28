import { memoryStore } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const file = memoryStore.files.find((f) => f.name === params.name);

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.data, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.name}"`,
    },
  });
}
