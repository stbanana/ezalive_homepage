import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content",
  docs: {
    postprocess: {
      valueToExport: ["structuredData", "extractedReferences"],
    },
  },
});

export default defineConfig({});
