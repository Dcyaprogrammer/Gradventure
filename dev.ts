// Simple development server for portfolio preview
import { file } from "bun";

const PORT = 8000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    // Default to index.html
    if (filePath === "/") {
      filePath = "/docs/index.html";
    } else {
      filePath = "/docs" + filePath;
    }

    // Try to serve the file
    const path = "." + filePath;
    const fileContent = file(path);

    // Check if file exists
    try {
      const exists = await fileContent.exists();
      if (!exists) {
        return new Response("File not found", { status: 404 });
      }

      // Set content type based on file extension
      let contentType = "text/html";
      if (path.endsWith(".css")) {
        contentType = "text/css";
      } else if (path.endsWith(".js")) {
        contentType = "application/javascript";
      } else if (path.endsWith(".json")) {
        contentType = "application/json";
      } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
        const ext = path.split(".").pop();
        const types = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          ico: "image/x-icon",
          svg: "image/svg+xml",
        };
        contentType = types[ext];
      }

      return new Response(fileContent, {
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch (err) {
      return new Response("Error loading file", { status: 500 });
    }
  },
});

console.log(`🚀 Development server running at http://localhost:${PORT}`);
console.log("Press Ctrl+C to stop");
