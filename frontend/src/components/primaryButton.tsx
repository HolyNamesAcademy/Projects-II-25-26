export default function PrimaryButton({
  text,
  type,
  href,
  onClick,
}: {
  text: string;
  type: "button" | "submit" | "link";
  href?: string;
  onClick?: () => void;
}) {
  const classes =
    "rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-claret-500 text-white gap-2 hover:bg-claret-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto";
  if (type === "link") {
    return (
      <a className={classes} href={href}>
        {text}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick}>
      {text}
    </button>
  );
}
