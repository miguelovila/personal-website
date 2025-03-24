import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

const CredentialList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ title, className, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} ref={ref} {...props}>
      <Typography variant="h2">{title}</Typography>
      {props.children}
    </div>
  );
});
CredentialList.displayName = "CredentialList";

export interface CredentialItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  description: string;
}

const CredentialItem = React.forwardRef<HTMLDivElement, CredentialItemProps>(
  ({ title, subtitle, description, className, ...props }, ref) => {
    return (
      <div
        key={title}
        className="flex flex-col space-y-3 rounded-md border-l-4 border-primary py-1 pl-4 transition-colors hover:border-secondary-foreground"
      >
        <div className="flex flex-col space-y-2">
          <Typography variant="h3">{title}</Typography>
          <p className="font-semibold leading-none tracking-tight text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  },
);
CredentialItem.displayName = "CredentialItem";

export { CredentialList, CredentialItem };
