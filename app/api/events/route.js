import { memoryStore } from "@/lib/store";

export async function GET() {
  return new Response(
    new ReadableStream({
      start(controller) {
        const send = () => {
          controller.enqueue(
            `data: ${JSON.stringify(memoryStore.getFiles())}\n\n`
          );
        };

        // Send initial files
        send();

        // Subscribe to changes
        memoryStore.onChange = send;
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
