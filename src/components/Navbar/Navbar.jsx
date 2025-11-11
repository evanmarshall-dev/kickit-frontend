import { Link, useNavigate } from "react-router-dom";
import { Target, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Button/Button";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        <div className={styles.navbar__logo}>
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <Target className={styles.navbar__logoIcon} />
            <span>KickIt</span>
          </Link>
        </div>

        <div className={styles.navbar__actions}>
          {isAuthenticated ? (
            // Authenticated User Nav
            <>
              <span className={styles.navbar__username}>
                Welcome, {user?.name || user?.username}
              </span>
              <Button variant='secondary' onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            // Guest User Nav
            <>
              <Link to='/signin'>
                <Button variant='secondary'>Sign In</Button>
              </Link>
              <Link to='/signup'>
                <Button variant='primary'>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
