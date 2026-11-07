import api from "../api/axios";
import type { Articulo } from "../types/Articulo";
import type { ArticuloCategoria } from "../types/ArticuloCategoria";

export const getArticulosFiltro = (nombre: string) =>
  api.get<Articulo[]>("/articulos/mostrarActivosFiltro", { params: { nombre } });

export const getReporteArticuloCategoria = () =>
  api.get<ArticuloCategoria[]>("/articulos/reporteArticuloCategoria");
