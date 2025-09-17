export interface CardProps {
  title: string;
  description: string;
  image: string | string[];
  read_duration?: number;
  link: string;
  loading?: "eager" | "lazy";
}