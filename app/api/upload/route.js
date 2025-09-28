import { memoryStore } from "@/lib/store";

export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll("files");

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    memoryStore.addFile({ name: file.name, data: buffer });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
