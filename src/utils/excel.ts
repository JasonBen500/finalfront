import ExcelJS from "exceljs";
import { fechaHoy } from "./fechas";

export interface ColumnaExcel {
  encabezado: string;
  clave: string;
  ancho: number;
  formato?: string;
}

interface OpcionesExcel {
  titulo: string;
  nombreArchivo: string;
  hoja: string;
  columnas: ColumnaExcel[];
  filas: Record<string, string | number>[];
}

const borde: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export async function generarExcel(op: OpcionesExcel) {
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet(op.hoja);
  const n = op.columnas.length;

  // Título y fecha
  hoja.mergeCells(1, 1, 1, n);
  const titulo = hoja.getCell(1, 1);
  titulo.value = op.titulo;
  titulo.font = { bold: true, size: 16, color: { argb: "FF0000" } };
  titulo.alignment = { horizontal: "center" };

  hoja.mergeCells(2, 1, 2, n);
  const fecha = hoja.getCell(2, 1);
  fecha.value = `Fecha: ${fechaHoy()}`;
  fecha.alignment = { horizontal: "center" };

  // Encabezado con color y bordes
  const filaEncabezado = hoja.getRow(4);
  op.columnas.forEach((col, i) => {
    const celda = filaEncabezado.getCell(i + 1);
    celda.value = col.encabezado;
    celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    celda.border = borde;
    celda.alignment = { horizontal: "center" };
    hoja.getColumn(i + 1).width = col.ancho;
  });

  // Datos con bordes y formato de numeros
  op.filas.forEach((fila, r) => {
    const filaExcel = hoja.getRow(5 + r);
    op.columnas.forEach((col, i) => {
      const celda = filaExcel.getCell(i + 1);
      celda.value = fila[col.clave];
      celda.border = borde;
      if (col.formato) celda.numFmt = col.formato;
    });
  });

  const buffer = await libro.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = op.nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}
