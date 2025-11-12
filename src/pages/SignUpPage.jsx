import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Target } from "lucide-react";
import Button from "../components/Button/Button";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import styles from "./Auth.module.scss";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword: _confirmPassword, ...signupData } = formData;
      const data = await authService.signup(signupData);

      // Update auth context
      login(data.user, data.token);

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
          <h1 className={styles.authPage__title}>Start Your List</h1>
          <p className={styles.authPage__subtitle}>
            Create your account to begin tracking your bucket list
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
              <label htmlFor='name' className={styles.formLabel}>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='email' className={styles.formLabel}>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
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

            <div className={styles.formGroup}>
              <label htmlFor='confirmPassword' className={styles.formLabel}>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className={styles.authPage__footer}>
            Already have an account?{" "}
            <Link to='/signin' className={styles.authPage__link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
