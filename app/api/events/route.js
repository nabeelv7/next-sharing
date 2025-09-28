// app/api/events/route.js
import { memoryStore } from "@/lib/store";

export async function GET() {
  return new Response(
    new ReadableStream({
      start(controller) {
        // send initial list of files
        controller.enqueue(`data: ${JSON.stringify(memoryStore)}\n\n`);

        // store callback to notify later
        memoryStore.onChange = () => {
          controller.enqueue(`data: ${JSON.stringify(memoryStore)}\n\n`);
        };
      },
      cancel() {
        // optional cleanup if needed
        memoryStore.onChange = null;
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
