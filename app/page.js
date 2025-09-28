"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CloudUpload, Loader2 } from "lucide-react";

export default function HomePage() {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dropRef = useRef(null);

  // connect to SSE
  useEffect(() => {
    const eventSource = new EventSource("/api/events");
    eventSource.onmessage = (e) => {
      setFiles(JSON.parse(e.data));
    };
    return () => eventSource.close();
  }, []);

  // Upload handler
  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setIsUploading(true);
    await fetch("/api/upload", { method: "POST", body: formData });
    setIsUploading(false);

    e.target.reset();
  };

  // Drag-and-drop handlers
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of droppedFiles) {
      formData.append("files", file);
    }

    setIsUploading(true);
    await fetch("/api/upload", { method: "POST", body: formData });
    setIsUploading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="min-h-screen overflow-y-scroll flex flex-col items-center px-6 py-20 pb-10 bg-background dark">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        🌐 Live File Share
      </h1>

      {/* Drag & Drop Upload */}
      <Card
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-lg h-48 mb-6 flex flex-col items-center justify-center border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/10" : "border-muted bg-card"
        }`}
      >
        <CloudUpload
          className="w-12 h-12 mb-2 text-muted-foreground"
          strokeWidth={1.5}
        />
        <CardContent className="text-center text-muted-foreground">
          {dragActive
            ? "Release to upload file"
            : "Drag & drop a file here or use the upload button below"}
        </CardContent>
      </Card>

      {/* Regular Upload Form */}
      <Card className="w-full max-w-lg mb-8">
        <CardContent className="flex gap-3 items-center p-4">
          <form
            onSubmit={uploadFile}
            className="flex gap-3 items-center w-full"
          >
            <Input
              type="file"
              name="files"
              multiple
              required
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isUploading}
              className="w-28 flex justify-center"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* File List */}
      <Card className="w-full max-w-lg overflow-y-scroll">
        <CardHeader>
          <CardTitle>📂 Available Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-80">
            <ul className="divide-y divide-border">
              {files.length === 0 && (
                <li className="p-4 text-muted-foreground text-center">
                  No files uploaded yet
                </li>
              )}
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex justify-between items-center p-4 hover:bg-muted/50"
                >
                  <span className="truncate">{f.name}</span>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <a href={`/api/files/${f.name}`} download>
                        Download
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
