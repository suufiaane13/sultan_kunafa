/**
 * État vide réutilisable : icône + titre + description optionnelle + action (lien ou bouton).
 * Utilisé pour panier vide, favoris vides, menu sans résultats.
 */

import type { ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateAction {
  label: string;
  /** Lien interne (react-router). */
  to?: string;
  /** Clic (bouton ou en plus du lien, ex. fermer le panier). */
  onClick?: () => void;
  /** Icône à gauche du libellé. */
  leftIcon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
}

export interface EmptyStateProps {
  icon: ReactNode;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  /** Id du titre pour aria-labelledby. */
  titleId?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
  titleId,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 py-12 text-center ${className}`}
      role="status"
      aria-labelledby={titleId}
    >
      <span className="text-gold/30 [&>svg]:h-12 [&>svg]:w-12" aria-hidden>
        {icon}
      </span>
      {title && (
        <h2 id={titleId} className="font-display text-2xl font-semibold text-dark sm:text-3xl md:text-4xl">
          {title}
        </h2>
      )}
      {description && <p className="max-w-2xl text-lg leading-relaxed text-dark/90">{description}</p>}
      {action && (
        action.to != null ? (
          <Button
            to={action.to}
            onClick={action.onClick}
            variant={action.variant ?? "gold"}
            size="md"
            leftIcon={action.leftIcon}
            className="mt-2"
          >
            {action.label}
          </Button>
        ) : action.onClick != null ? (
          <Button
            type="button"
            onClick={action.onClick}
            variant={action.variant ?? "secondary"}
            size="md"
            leftIcon={action.leftIcon}
            className="mt-2"
          >
            {action.label}
          </Button>
        ) : null
      )}
    </div>
  );
}
