import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function exportAsMarkdown(title: string, content: string): void {
  const markdown = htmlToMarkdown(content);
  const fullContent = `# ${title}\n\n${markdown}`;

  const blob = new Blob([fullContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(title)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportAsPDF(
  title: string,
  content: string,
  icon?: string
): Promise<void> {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.padding = "40px";
  container.style.backgroundColor = "white";
  container.style.fontFamily = "Arial, sans-serif";

  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      ${icon ? `<div style="font-size: 48px; margin-bottom: 10px;">${icon}</div>` : ""}
      <h1 style="font-size: 32px; font-weight: bold; margin: 0; color: #111;">${title}</h1>
    </div>
    <div style="font-size: 14px; line-height: 1.6; color: #333;">
      ${content}
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(`${sanitizeFilename(title)}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Links
  markdown = markdown.replace(
    /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Lists
  markdown = markdown.replace(/<ul[^>]*>/gi, "\n");
  markdown = markdown.replace(/<\/ul>/gi, "\n");
  markdown = markdown.replace(/<ol[^>]*>/gi, "\n");
  markdown = markdown.replace(/<\/ol>/gi, "\n");
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");

  // Code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```\n");

  // Blockquote
  markdown = markdown.replace(
    /<blockquote[^>]*>(.*?)<\/blockquote>/gi,
    "> $1\n"
  );

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  markdown = markdown
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

  return markdown;
}

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_")
    .toLowerCase();
}