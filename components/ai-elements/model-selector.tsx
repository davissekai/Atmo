"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  BoxIcon,
  LogoAnthropic,
  LogoGoogle,
  LogoOpenAI,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const ModelSelector = DialogPrimitive.Root;
const ModelSelectorTrigger = DialogPrimitive.Trigger;

const ModelSelectorContent = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">
        Select AI Model
      </DialogPrimitive.Title>
      <Command className="h-full w-full">
        {children}
      </Command>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

const ModelSelectorInput = CommandInput;
const ModelSelectorList = CommandList;
const ModelSelectorGroup = CommandGroup;
const ModelSelectorItem = CommandItem;

const ModelSelectorName = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("truncate text-sm", className)} {...props} />
);

const ModelSelectorLogo = ({ provider }: { provider: string }) => {
  switch (provider) {
    case "openai":
      return <LogoOpenAI size={16} />;
    case "google":
      return <LogoGoogle size={16} />;
    case "anthropic":
      return <LogoAnthropic />;
    default:
      return <BoxIcon size={16} />;
  }
};

export {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
};
