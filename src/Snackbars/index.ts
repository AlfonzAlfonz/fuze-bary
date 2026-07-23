import { toast } from "@heroui/react";

export const useSnackbar = () => {
  return (type: "success" | "error", message: string) => {
    if (type === "error") {
      toast.danger(message, { timeout: 60_000 });
    } else {
      toast.success(message, { timeout: 2000 });
    }
  };
};
