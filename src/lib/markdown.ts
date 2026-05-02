// Минималистичный markdown→HTML рендерер для статей.
// Поддерживает: ## h2, ### h3, **bold**, *italic*, списки 1./-/*, абзацы, ссылки.
// Этого достаточно для нашей базы знаний — внешние deps не тянем.

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  let out = escape(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|\W)\*([^*]+?)\*(?=\W|$)/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
  return out;
}

export function markdownToHtml(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  type ListMode = "ol" | "ul" | null;
  let listMode: ListMode = null;

  function closeList() {
    if (listMode) {
      out.push(listMode === "ol" ? "</ol>" : "</ul>");
      listMode = null;
    }
  }

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      closeList();
      i++;
      continue;
    }
    const h2 = line.match(/^##\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    const ol = line.match(/^(\d+)\.\s+(.*)/);
    const ul = line.match(/^[-*]\s+(.*)/);
    if (h2) {
      closeList();
      out.push(`<h2>${inline(h2[1])}</h2>`);
    } else if (h3) {
      closeList();
      out.push(`<h3>${inline(h3[1])}</h3>`);
    } else if (ol) {
      if (listMode !== "ol") {
        closeList();
        out.push("<ol>");
        listMode = "ol";
      }
      out.push(`<li>${inline(ol[2])}</li>`);
    } else if (ul) {
      if (listMode !== "ul") {
        closeList();
        out.push("<ul>");
        listMode = "ul";
      }
      out.push(`<li>${inline(ul[1])}</li>`);
    } else {
      closeList();
      // Параграф может быть на нескольких строках до пустой
      const buf: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^(##|###|\d+\.|[-*]\s)/.test(lines[i + 1])) {
        i++;
        buf.push(lines[i]);
      }
      out.push(`<p>${inline(buf.join(" "))}</p>`);
    }
    i++;
  }
  closeList();
  return out.join("\n");
}
