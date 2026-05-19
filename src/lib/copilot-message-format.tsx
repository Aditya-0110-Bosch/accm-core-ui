import type { ReactNode } from "react";

/** Remove stray markdown markers the model might leave unmatched. */
function stripStrayMarkdown(s: string): string {
  return s.replace(/\*\*/g, "");
}

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(<span key={key++}>{stripStrayMarkdown(text.slice(last, m.index))}</span>);
    }
    nodes.push(
      <strong key={key++} className="font-semibold text-foreground">
        {m[1]}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(<span key={key++}>{stripStrayMarkdown(text.slice(last))}</span>);
  }
  return nodes.length > 0 ? nodes : [<span key={0}>{stripStrayMarkdown(text)}</span>];
}

function isBulletLine(line: string): boolean {
  return /^\s*([-*•]|\d+[.)])\s+/.test(line);
}

function bulletBody(line: string): string {
  return line.replace(/^\s*([-*•]|\d+[.)])\s+/, "").trim();
}

/**
 * Renders copilot replies without showing raw **markdown**.
 * Supports **bold**, and simple bullet lists (-, *, •, or 1. ).
 */
export function CopilotMessageContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (isBulletLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isBulletLine(lines[i] ?? "")) {
        items.push(bulletBody(lines[i] ?? ""));
        i++;
      }
      blocks.push(
        <ul
          key={blockKey++}
          className="my-2 list-disc space-y-1.5 pl-4 marker:text-muted-foreground"
        >
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed pl-0.5">
              {parseInline(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && !isBulletLine(lines[i] ?? "")) {
      paraLines.push(lines[i] ?? "");
      i++;
    }
    const paragraph = paraLines.join(" ").trim();
    if (paragraph) {
      blocks.push(
        <p key={blockKey++} className="leading-relaxed [&+&]:mt-2">
          {parseInline(paragraph)}
        </p>,
      );
    }
  }

  if (blocks.length === 0) {
    return <p className="leading-relaxed">{stripStrayMarkdown(content)}</p>;
  }

  return <div className="space-y-1 text-foreground/95">{blocks}</div>;
}
