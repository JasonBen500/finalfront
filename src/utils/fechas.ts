const dos = (n: number) => String(n).padStart(2, "0");
export function fechaHoy(): string {
  const d = new Date();
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function fechaArchivo(): string {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}
