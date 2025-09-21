import classNames from "classnames";

const Button = ({ children, variant, size, className, ...rest }) => {
  const variantClasses = {
    dark: "bg-darkblue text-lightbg font-poppins hover:cursor-pointer",
    light:
      "bg-white text-sm  font-poppins text-darkblue border-1 border-darkblue  rounded-full  hover:cursor-pointer",
    default: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: " px-12 py-3 text-base font-medium",
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
