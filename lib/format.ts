export function rsd(n: number) {
  return `${n.toLocaleString("sr-RS").replace(/,/g, ".")} RSD`;
}

export function num(n: number) {
  return n.toLocaleString("sr-RS").replace(/,/g, ".");
}

/** Opis iz baze (HTML) -> običan tekst za uređivanje. */
export function htmlToText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*/gi, "\n\n")
    .replace(/<(?!\/?(strong|em)>)[^>]+>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Tekst iz admina -> bezbedan HTML (pasusi, prelomi, <strong>/<em>). */
export function textToHtml(text: string) {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&lt;(\/?)(strong|em)&gt;/gi, "<$1$2>");
  return text
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
