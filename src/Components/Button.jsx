import classNames from "classnames";

const Button = ({ children, variant, size, className, ...rest }) => {
  const variantClasses = {
    dark: "bg-darkblue text-lightbg font-poppins hover:cursor-pointer",
    light: "bg-yellow-500 hover:bg-yellow-600 text-black",
    default: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "p-2 w-full text-sm",
  };

  const allClasses = classNames(
    "rounded-4xl", // common styles
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.md,
    className
  );

  return (
    <button className={allClasses} {...rest}>
      {children}
    </button>
  );
};

export default Button;
