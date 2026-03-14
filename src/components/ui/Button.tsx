/**
 * Bouton réutilisable avec variants (primary, secondary, ghost, gold).
 * Supporte lien interne (to), lien externe (href) ou bouton (onClick).
 */

import { Link } from "react-router-dom";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-dark shadow-md hover:bg-gold-light focus:ring-gold",
  secondary:
    "border border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 focus:ring-gold",
  ghost:
    "text-dark/70 hover:bg-gold/10 hover:text-dark focus:ring-gold",
  gold:
    "bg-gold text-dark shadow-md hover:bg-gold-light focus:ring-gold",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5 sm:px-6 sm:py-3",
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-[var(--color-surface)]";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  to?: never;
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  to: string;
  href?: never;
  onClick?: () => void;
}

interface ButtonAsAnchor extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  href: string;
  to?: never;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export function Button({
  variant = "secondary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const variantCls = variantClasses[variant];
  const sizeCls = sizeClasses[size];
  const classes = `${baseClasses} ${variantCls} ${sizeCls} ${className}`.trim();

  if ("to" in rest && rest.to != null) {
    const { to, ...linkRest } = rest;
    return (
      <Link to={to} className={classes} {...linkRest}>
        {leftIcon && <span className="shrink-0 [&>svg]:size-4" aria-hidden>{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0 [&>svg]:size-4 rtl:rotate-180" aria-hidden>{rightIcon}</span>}
      </Link>
    );
  }

  if ("href" in rest && rest.href != null) {
    const { href, ...anchorRest } = rest;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {leftIcon && <span className="shrink-0 [&>svg]:size-4" aria-hidden>{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0 [&>svg]:size-4 rtl:rotate-180" aria-hidden>{rightIcon}</span>}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {leftIcon && <span className="shrink-0 [&>svg]:size-4" aria-hidden>{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0 [&>svg]:size-4 rtl:rotate-180" aria-hidden>{rightIcon}</span>}
    </button>
  );
}
