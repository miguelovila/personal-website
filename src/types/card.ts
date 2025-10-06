/**
 * Props for card components displaying content previews
 */
export interface CardProps {
  /** Card title */
  title: string;

  /** Card description/excerpt */
  description: string;

  /** Single image or array of images for slideshow */
  image: string | string[];

  /** Optional reading duration in minutes */
  readDuration?: number;

  /** Link destination */
  link: string;

  /** Image loading strategy */
  loading?: "eager" | "lazy";
}
