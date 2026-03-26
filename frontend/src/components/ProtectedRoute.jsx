import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // render children OR nested routes
  return children ? children : <Outlet />;
}

export default ProtectedRoute;