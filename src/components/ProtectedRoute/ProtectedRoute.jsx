import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: "1.25rem",
          color: "var(--color-foreground)",
        }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/signin' replace />;
  }

  return children;
};

export default ProtectedRoute;
