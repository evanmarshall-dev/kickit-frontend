import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Target } from "lucide-react";
import Button from "../components/Button/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import styles from "./Auth.module.scss";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      const data = await authService.signin(formData);

      // Update auth context
      login(data.user, data.token);

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authPage__container}>
        <div className={styles.authPage__header}>
          <Link to='/' className={styles.authPage__logo}>
            <Target className={styles.authPage__logoIcon} />
            <span>KickIt</span>
          </Link>
          <Link to='/' className={styles.authPage__backLink}>
            ← Back to Home
          </Link>
        </div>

        <div className={styles.authPage__formContainer}>
          <h1 className={styles.authPage__title}>Welcome Back</h1>
          <p className={styles.authPage__subtitle}>
            Sign in to continue your kicks
          </p>

          {error && <div className={styles.authPage__error}>{error}</div>}

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor='username' className={styles.formLabel}>
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='password' className={styles.formLabel}>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className={styles.authPage__footer}>
            Don't have an account?{" "}
            <Link to='/signup' className={styles.authPage__link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
