"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmSubmitButton({
  confirmMessage,
  ...props
}: ComponentProps<typeof Button> & { confirmMessage: string }) {
  return (
    <Button
      {...props}
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    />
  );
}
