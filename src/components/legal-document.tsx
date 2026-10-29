import { readFileSync } from "node:fs";
import path from "node:path";

/*
  Renders the legal pages from src/content/legal/*.md so the wording can be
  edited without touching JSX. Supports only the subset those files use:
  ## / ### headings, paragraphs, "- " and "1. " lists, **bold**, `code`, and
  trailing-double-space line breaks.
*/

type Block =
  | { kind: "h2" | "h3"; text: string }
  | { kind: "p"; lines: string[] }
  | { kind: "ul" | "ol"; items: string[] };

const BULLET = /^- /;
const NUMBERED = /^\d+\. /;

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ kind: "p", lines: para });
    para = [];
  };

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push({ kind: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ kind: "h2", text: line.slice(3) });
      continue;
    }
    const listKind = BULLET.test(line)
      ? "ul"
      : NUMBERED.test(line)
        ? "ol"
        : null;
    if (listKind) {
      flush();
      const item = line.replace(listKind === "ul" ? BULLET : NUMBERED, "");
      const last = blocks.at(-1);
      if (last?.kind === listKind) last.items.push(item);
      else blocks.push({ kind: listKind, items: [item] });
      continue;
    }
    para.push(line);
  }
  flush();
  return blocks;
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Inline({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-navy-900 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-n100 text-navy-900 rounded px-1.5 py-0.5 font-mono text-[0.88em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function LegalDocument({ file }: { file: string }) {
  const source = readFileSync(
    path.join(process.cwd(), "src/content/legal", file),
    "utf8",
  );
  const blocks = parse(source);
  const toc = blocks.filter(
    (b): b is { kind: "h2"; text: string } => b.kind === "h2",
  );

  return (
    <div className="wrap grid gap-10 pb-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
      <nav
        aria-label="On this page"
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <div className="text-n500 mb-3 font-mono text-[11.5px] font-semibold tracking-[0.15em] uppercase">
          On this page
        </div>
        <ol className="grid gap-1.5 text-[13.5px] leading-snug">
          {toc.map((b) => (
            <li key={b.text}>
              <a
                href={`#${slug(b.text)}`}
                className="text-n500 hover:text-navy-900 transition-colors"
              >
                {b.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="text-n700 max-w-[72ch] text-[15.5px] leading-[1.75]">
        {blocks.map((b, i) => {
          switch (b.kind) {
            case "h2":
              return (
                <h2
                  key={i}
                  id={slug(b.text)}
                  className="font-display text-navy-900 mt-12 scroll-mt-24 text-[clamp(22px,2.4vw,28px)] leading-tight font-bold tracking-[-0.03em] first:mt-0"
                >
                  {b.text}
                </h2>
              );
            case "h3":
              return (
                <h3
                  key={i}
                  className="font-display text-navy-900 mt-8 text-[18px] font-semibold tracking-[-0.02em]"
                >
                  {b.text}
                </h3>
              );
            case "ul":
            case "ol": {
              const List = b.kind;
              return (
                <List
                  key={i}
                  className={`marker:text-n400 mt-4 grid gap-2 pl-6 ${b.kind === "ul" ? "list-disc" : "list-decimal"}`}
                >
                  {b.items.map((item, j) => (
                    <li key={j}>
                      <Inline text={item} />
                    </li>
                  ))}
                </List>
              );
            }
            case "p":
              return (
                <p key={i} className="mt-4">
                  {b.lines.map((line, j) => (
                    <span key={j}>
                      {j > 0 ? <br /> : null}
                      <Inline text={line} />
                    </span>
                  ))}
                </p>
              );
          }
        })}
      </article>
    </div>
  );
}
