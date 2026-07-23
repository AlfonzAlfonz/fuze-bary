import { Typography } from "@heroui/react";
import type { ReactNode } from "react";

export const Header = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Typography
      type="h4"
      className={`flex h-10 m-4 items-center ${className ?? ""}`}
    >
      {children}
    </Typography>
  );
};
