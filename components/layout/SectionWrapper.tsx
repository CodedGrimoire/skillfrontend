import { ReactNode } from "react";
import { PageContainer } from "./PageContainer";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  padded?: boolean;
  fullWidth?: boolean;
}

export function SectionWrapper({ id, children, className = "", padded = true, fullWidth = false }: SectionWrapperProps) {
  const spacing = padded ? "py-10 sm:py-14" : "";
  const classes = `${spacing} ${className}`.trim();

  return (
    <section id={id} className={classes}>
      <PageContainer fullWidth={fullWidth}>{children}</PageContainer>
    </section>
  );
}
