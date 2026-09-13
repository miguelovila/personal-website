import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function rehypePermalinks() {
  return (tree, file) => {
    const language =
      file.data.astro?.frontmatter?.language ?? (file.path?.includes("/pt/") ? "pt" : "en");
    const transform = rehypeAutolinkHeadings({
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: language === "pt" ? "Ligação para esta secção" : "Link to this section",
      },
      content: {
        type: "element",
        tagName: "svg",
        properties: {
          width: 18,
          height: 18,
          viewBox: "0 0 24 24",
          ariaHidden: "true",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.5,
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "m10 13 4-4m-5 8-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 8a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2",
            },
            children: [],
          },
        ],
      },
    });
    return transform(tree);
  };
}
