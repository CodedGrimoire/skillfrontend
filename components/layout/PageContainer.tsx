import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageContainer({ children, className = "", fullWidth = false }: PageContainerProps) {
  const classes = `${fullWidth ? "w-full" : "max-w-6xl"} mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim();

  return <div className={classes}>{children}</div>;
}
