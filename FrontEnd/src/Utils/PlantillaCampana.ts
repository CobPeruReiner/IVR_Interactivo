export const descargarPlantillaCSV = () => {
  const csvContent = `NOMBRE_CLIENTE,NUMERO,MONTO,FECHA_VENCIMIENTO
Juan Perez,51988888888,250.50,2025-12-01
Maria Lopez,51999999999,500.00,2025-12-15
`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "plantilla_campania.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
