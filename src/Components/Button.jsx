import classNames from "classnames";

const Button = ({ children, variant, size, className, ...rest }) => {
  const variantClasses = {
    dark: "bg-darkblue text-lightbg font-poppins hover:bg-darkblue/80 ",
    light: "bg-white text-sm font-poppins text-darkblue border-1 border-darkblue ",
    default: "bg-darkblue hover:bg-gray-600 text-white ",
  };

  const sizeClasses = {
    sm: "px-6 py-3 text-sm hover:cursor-pointer", // Fixed padding to match your needs
    md: "px-8 py-3 text-base font-medium hover:cursor-pointer",
    lg: "p-2 w-full text-md hover:cursor-pointer",
  };

  const allClasses = classNames(
    "rounded-full transition-colors", // common styles - changed to rounded-lg to match your design
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