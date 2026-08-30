import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <p className="text-sm text-slate-500">Comprobando sesión…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}