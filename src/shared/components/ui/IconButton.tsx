type IconButtonProps = {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const baseClasses =
    "cursor-pointer flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {icon}
    </button>
  );
}
