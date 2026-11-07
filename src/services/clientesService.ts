import api from "../api/axios";
import type { ClienteFactura } from "../types/ClienteFactura";

export const getReporteClienteFactura = () =>
  api.get<ClienteFactura[]>("/clientes/reporteClienteFactura");
