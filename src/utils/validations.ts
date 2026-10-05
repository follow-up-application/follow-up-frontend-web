export const esNombreValido = (nombre: string): boolean => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(nombre.trim());
};

export const esDniValido = (dni: string): boolean => {
  const regex = /^\d{7,8}$/;
  return regex.test(dni.trim());
};

export const esEmailValido = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const esTelefonoValido = (telefono: string): boolean => {
  const regex = /^[0-9+\s-]{8,15}$/;
  return regex.test(telefono.trim());
};

export const esFormatoFechaValido = (fecha: string): boolean => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
  return regex.test(fecha.trim());
};

const calcularEdad = (fecha: string): number => {
  const [dia, mes, anio] = fecha.split('/');
  const fechaNacimiento = new Date(Number(anio), Number(mes) - 1, Number(dia));
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  if (
    mesActual < fechaNacimiento.getMonth() ||
    (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())
  ) {
    edad--;
  }
  return edad;
};

export const esEdadAlumnoValida = (fecha: string): boolean => {
  if (!esFormatoFechaValido(fecha)) return false;
  const edad = calcularEdad(fecha);
  return edad >= 5 && edad <= 20;
};

export const esEdadTutorValida = (fecha: string): boolean => {
  if (!esFormatoFechaValido(fecha)) return false;
  return calcularEdad(fecha) >= 18;
};
