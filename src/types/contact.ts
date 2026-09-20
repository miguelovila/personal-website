/**
 * Contact link information
 */
export interface ContactLink {
  /** Icon identifier (e.g., "lucide:mail") */
  icon: string;

  /** Accessible label for the link */
  label: string;

  /** URL or mailto link */
  link: string;
}
