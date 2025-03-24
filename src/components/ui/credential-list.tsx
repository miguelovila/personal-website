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
        className="flex flex-col space-y-2 rounded-md border-l-4 border-primary pl-4 transition-all hover:scale-[1.01] hover:border-secondary-foreground"
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

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }
//
// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );
// Button.displayName = "Button";
//
// export { Button, buttonVariants };
