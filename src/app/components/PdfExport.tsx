"use client";

import jsPDF from "jspdf";
import { Comment } from "./CommentList";

interface PdfExportProps {
  comments: Comment[];
  videoTitle?: string;
}

// Helper to convert HTML to plain text
function htmlToPlainText(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

export default function PdfExport({
  comments,
  videoTitle = "YouTube Comments",
}: PdfExportProps) {
  const generatePDF = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pdfWidth - margin * 2;

    pdf.setFontSize(16);
    pdf.text(videoTitle, pdfWidth / 2, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pdfWidth / 2,
      30,
      { align: "center" }
    );

    let y = 40;
    pdf.setFontSize(11);
    comments.forEach((comment, idx) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      const plainText = htmlToPlainText(comment.text);
      const commentText = `${idx + 1}. ${plainText}`;
      const lines = pdf.splitTextToSize(commentText, maxLineWidth);
      lines.forEach((line) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, margin, y);
        y += 7;
      });
    });

    pdf.save(
      `${videoTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_comments.pdf`
    );
  };

  return (
    <button
      id="export-button"
      className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      onClick={generatePDF}
      type="button"
    >
      Export to PDF
    </button>
  );
}
