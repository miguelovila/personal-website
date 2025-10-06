/**
 * Props for section components
 */
export interface SectionProps {
  /** Section title */
  title?: string;

  /** Whether to show the animated separator */
  showSeparator?: boolean;

  /** Whether to show the title */
  showTitle?: boolean;

  /** Additional CSS classes */
  class?: string;
}
