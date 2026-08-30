const FIREBASE_ERRORS = {
  'auth/invalid-credential': 'Credenciales inválidas.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres).',
  'auth/network-request-failed': 'Error de red. Revisa tu conexión.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
};

export function firebaseErrorMessage(code) {
  return FIREBASE_ERRORS[code] ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
}