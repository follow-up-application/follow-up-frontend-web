export function formatearDni(dni: string | number): string {
  return String(dni).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatearTelefono(telefono: string): string {
  return telefono;
}
