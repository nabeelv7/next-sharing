import { memoryStore } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = await params;
  const file = memoryStore.files.find((f) => f.name === name);

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.data, {
    headers: {
      "Content-Type": "application/pdf", // use actual MIME if known
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        file.name
      )}`,
    },
  });
}
