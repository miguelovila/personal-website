export default function rehypeTables() {
  return (tree, file) => {
    const language =
      file.data.astro?.frontmatter?.language ?? (file.path?.includes("/pt/") ? "pt" : "en");

    function walk(node) {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type !== "element" || child.tagName !== "table") return child;
        return {
          type: "element",
          tagName: "div",
          properties: {
            className: ["table-scroll"],
            role: "region",
            ariaLabel:
              language === "pt"
                ? "Tabela, deslocável na horizontal"
                : "Table, scroll horizontally for more",
            tabIndex: 0,
          },
          children: [child],
        };
      });
      if (node.type === "element" && node.tagName === "th") {
        node.properties ??= {};
        node.properties.scope ??= "col";
      }
    }

    walk(tree);
  };
}
