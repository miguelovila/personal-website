import { IconType } from "react-icons";
import { LuMail, LuGithub, LuLinkedin } from "react-icons/lu";

type Contact = {
  icon: IconType;
  label: string;
  link: string;
};

export const contacts: Contact[] = [
  {
    icon: LuMail,
    label: "E-Mail",
    link: "mailto:contact@miguelovila.pt",
  },
  {
    icon: LuGithub,
    label: "GitHub",
    link: "https://www.github.com/miguelovila",
  },
  {
    icon: LuLinkedin,
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/miguelovila",
  },
];
