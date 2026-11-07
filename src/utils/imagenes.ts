import logo from "../assets/images/Logo.png";

export async function cargarLogo(): Promise<string> {
  const respuesta = await fetch(logo);
  const blob = await respuesta.blob();
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = () => reject(new Error("No se pudo leer el logo"));
    lector.readAsDataURL(blob);
  });
}
