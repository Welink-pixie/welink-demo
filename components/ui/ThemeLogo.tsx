type ThemeLogoProps = {
  alt?: string;
  className?: string;
  sageClassName?: string;
};

export default function ThemeLogo({
  alt = "WeLink",
  className = "h-10 w-auto object-contain",
  sageClassName,
}: ThemeLogoProps) {
  const sageLogoClass = sageClassName ?? className;

  return (
    <>
      <img
        src="/we_link_logo.png"
        alt={alt}
        className={`theme-logo-default ${className}`}
      />
      <img
        src="/knight_welink.png"
        alt={alt}
        className={`theme-logo-sage ${sageLogoClass} drop-shadow-[0_2px_8px_rgba(14,59,46,0.22)]`}
      />
    </>
  );
}
