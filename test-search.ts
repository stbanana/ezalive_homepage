import { source } from "./lib/source";
console.log(
  JSON.stringify(
    source
      .getPages()
      .map((p) => ({
        url: p.url,
        title: p.data.title,
        sd: p.data.structuredData,
      })),
    null,
    2,
  ),
);
