import { adminAuth } from '../firebase.js';
import { ensureUser } from '../services/ensureUser.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(token);
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = {
    uid: decoded.uid,
    email: decoded.email ?? null,
    name: decoded.name ?? null,
  };

  try {
    await ensureUser(req.user);
  } catch (err) {
    return next(err);
  }

  next();
}