import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "default",
  fullWidth = false,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const buttonClasses = [
    styles.btn,
    variant === "primary" ? styles.btnPrimary : styles.btnSecondary,
    size === "large" ? styles.btnLarge : "",
    fullWidth ? styles.btnFullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
