import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-xs font-bold uppercase tracking-[0.22em] text-ink/60", className)}
      {...props}
    />
  );
}

export { Label };
