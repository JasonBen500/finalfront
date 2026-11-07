import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fechaHoy } from "./fechas";
import { cargarLogo } from "./imagenes";

interface OpcionesPdf {
  titulo: string;
  nombreArchivo: string;
  columnas: string[];
  filas: (string | number)[][];
  columnasDerecha?: number[];
}

export async function generarPdf(op: OpcionesPdf) {
  // Hoja A4 horizontal
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();

  const logo = await cargarLogo();

  // Logo, título y fecha
  doc.addImage(logo, "PNG", 14, 8, 40, 13);
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text(op.titulo, ancho / 2, 16, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Fecha: ${fechaHoy()}`, ancho - 14, 16, { align: "right" });

  const estilosColumnas: Record<number, { halign: "right" }> = {};
  (op.columnasDerecha ?? []).forEach((i) => {
    estilosColumnas[i] = { halign: "right" };
  });

  autoTable(doc, {
    startY: 28,
    head: [op.columnas],
    body: op.filas,
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [234, 241, 248] },
    columnStyles: estilosColumnas,
    margin: { bottom: 15 },
  });

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Página ${i} de ${total}`, ancho / 2, alto - 8, { align: "center" });
  }

  doc.save(op.nombreArchivo);
}
