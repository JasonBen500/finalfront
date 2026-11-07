import { useRef, useState } from "react";
import { getArticulosFiltro, getReporteArticuloCategoria } from "../services/articulosService";
import { getReporteClienteFactura } from "../services/clientesService";
import { generarPdf } from "../utils/pdf";
import { generarExcel } from "../utils/excel";
import { fechaArchivo } from "../utils/fechas";

const FORMATO_DECIMAL = "#,##0.00";

//mayor limpieza al pasar la mayor parde de la logica a utils para que no sobrecarge la pagina de reportes
export default function Reportes() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  // ---------- Reporte 1: artículos por nombre ----------
  const abrirDialogo = () => {
    setMensaje("");
    dialogo.current?.showModal();
  };

  const cerrarDialogo = () => dialogo.current?.close();

  const obtenerFiltrados = async () => {
    const { data } = await getArticulosFiltro(nombre);
    if (data.length === 0) {
      setMensaje("No se encontraron artículos con ese nombre.");
      return null;
    }
    setMensaje("");
    return data;
  };

  const pdfFiltrados = async () => {
    try {
      const data = await obtenerFiltrados();
      if (!data) return;
      await generarPdf({
        titulo: `Artículos que contienen "${nombre}"`,
        nombreArchivo: `articulos_filtrados_${fechaArchivo()}.pdf`,
        columnas: ["Nombre", "Marca", "Precio", "Stock"],
        filas: data.map((a) => [a.nombre, a.marca, Number(a.precio).toFixed(2), a.stock]),
        columnasDerecha: [2, 3],
      });
    } catch {
      setMensaje("Error al generar el PDF.");
    }
  };

  const excelFiltrados = async () => {
    try {
      const data = await obtenerFiltrados();
      if (!data) return;
      await generarExcel({
        titulo: `Artículos que contienen "${nombre}"`,
        nombreArchivo: `articulos_filtrados_${fechaArchivo()}.xlsx`,
        hoja: "Artículos",
        columnas: [
          { encabezado: "Nombre", clave: "nombre", ancho: 35 },
          { encabezado: "Marca", clave: "marca", ancho: 20 },
          { encabezado: "Precio", clave: "precio", ancho: 12, formato: FORMATO_DECIMAL },
          { encabezado: "Stock", clave: "stock", ancho: 10 },
        ],
        filas: data.map((a) => ({
          nombre: a.nombre,
          marca: a.marca,
          precio: Number(a.precio),
          stock: a.stock,
        })),
      });
    } catch {
      setMensaje("Error al generar el Excel.");
    }
  };

  // ---------- Reporte 2: artículos con su categoría ----------
  const pdfArticuloCategoria = async () => {
    try {
      const { data } = await getReporteArticuloCategoria();
      await generarPdf({
        titulo: "Artículos con su categoría",
        nombreArchivo: `articulos_categoria_${fechaArchivo()}.pdf`,
        columnas: ["Artículo", "Marca", "Categoría", "Precio", "Stock"],
        filas: data.map((a) => [
          a.nombre,
          a.marca,
          a.categoria,
          Number(a.precio).toFixed(2),
          a.stock,
        ]),
        columnasDerecha: [3, 4],
      });
    } catch {
      setMensaje("Error al generar el PDF.");
    }
  };

  const excelArticuloCategoria = async () => {
    try {
      const { data } = await getReporteArticuloCategoria();
      await generarExcel({
        titulo: "Artículos con su categoría",
        nombreArchivo: `articulos_categoria_${fechaArchivo()}.xlsx`,
        hoja: "Artículos y categorías",
        columnas: [
          { encabezado: "Artículo", clave: "nombre", ancho: 35 },
          { encabezado: "Marca", clave: "marca", ancho: 20 },
          { encabezado: "Categoría", clave: "categoria", ancho: 25 },
          { encabezado: "Precio", clave: "precio", ancho: 12, formato: FORMATO_DECIMAL },
          { encabezado: "Stock", clave: "stock", ancho: 10 },
        ],
        filas: data.map((a) => ({
          nombre: a.nombre,
          marca: a.marca,
          categoria: a.categoria,
          precio: Number(a.precio),
          stock: a.stock,
        })),
      });
    } catch {
      setMensaje("Error al generar el Excel.");
    }
  };

  // ---------- Reporte 3: facturas por cliente ----------
  const pdfClienteFactura = async () => {
    try {
      const { data } = await getReporteClienteFactura();
      await generarPdf({
        titulo: "Facturas por cliente",
        nombreArchivo: `facturas_cliente_${fechaArchivo()}.pdf`,
        columnas: ["Cliente", "NIT", "Fecha", "Total"],
        filas: data.map((f) => [
          `${f.nombre} ${f.apellido}`,
          f.nit,
          f.fechaFactura,
          Number(f.total).toFixed(2),
        ]),
        columnasDerecha: [3],
      });
    } catch {
      setMensaje("Error al generar el PDF.");
    }
  };

  const excelClienteFactura = async () => {
    try {
      const { data } = await getReporteClienteFactura();
      await generarExcel({
        titulo: "Facturas por cliente",
        nombreArchivo: `facturas_cliente_${fechaArchivo()}.xlsx`,
        hoja: "Facturas",
        columnas: [
          { encabezado: "Cliente", clave: "cliente", ancho: 35 },
          { encabezado: "NIT", clave: "nit", ancho: 16 },
          { encabezado: "Fecha", clave: "fecha", ancho: 20 },
          { encabezado: "Total", clave: "total", ancho: 14, formato: FORMATO_DECIMAL },
        ],
        filas: data.map((f) => ({
          cliente: `${f.nombre} ${f.apellido}`,
          nit: f.nit,
          fecha: f.fechaFactura,
          total: Number(f.total),
        })),
      });
    } catch {
      setMensaje("Error al generar el Excel.");
    }
  };

  return (
    <div>
      <h1>Reportes</h1>
      {mensaje && <p>{mensaje}</p>}

      <h3>1. Artículos por nombre</h3>
      <button onClick={abrirDialogo}>Abrir filtro</button>

      <dialog ref={dialogo}>
        <h3>Artículos por nombre</h3>
        <input
          type="text"
          placeholder="Nombre del artículo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <p>
          <button onClick={pdfFiltrados}>Exportar a PDF</button>{" "}
          <button onClick={excelFiltrados}>Exportar a Excel</button>{" "}
          <button onClick={cerrarDialogo}>Cerrar</button>
        </p>
        {mensaje && <p>{mensaje}</p>}
      </dialog>

      <h3>2. Artículos con su categoría</h3>
      <button onClick={pdfArticuloCategoria}>Exportar a PDF</button>{" "}
      <button onClick={excelArticuloCategoria}>Exportar a Excel</button>

      <h3>3. Facturas por cliente</h3>
      <button onClick={pdfClienteFactura}>Exportar a PDF</button>{" "}
      <button onClick={excelClienteFactura}>Exportar a Excel</button>
    </div>
  );
}
