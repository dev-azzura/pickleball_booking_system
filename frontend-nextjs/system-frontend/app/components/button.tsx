import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type SharedProps = { variant?: ButtonVariant; className?: string };

type ButtonProps =
  | (SharedProps &
      ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (SharedProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
        disabled?: boolean;
      });

const baseStyles =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-soft hover:bg-primary/90 active:bg-primary/80",
  secondary:
    "border border-primary/15 text-primary hover:border-primary/30 hover:bg-primary/5 active:bg-primary/10",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", className = "", ...rest } = props;
  const classNames = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { disabled, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      disabled?: boolean;
    };

    return (
      <Link
        {...linkProps}
        href={props.href}
        className={`${classNames}${disabled ? " pointer-events-none opacity-50" : ""}`}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : linkProps.tabIndex}
      />
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={`${classNames} disabled:cursor-not-allowed`}
      disabled={(rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
    />
  );
}
