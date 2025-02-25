import Image from "next/image";
import { Typography } from "@/components/typography";
import NextLink from "next/link";

const Logo = () => (
  <NextLink
    href="/"
    rel="noopener noreferrer"
    aria-label="Home"
    className="flex items-center gap-2"
  >
    <Image
      src="/images/profile-picture-pixelated.png"
      alt="Profile"
      width={60}
      height={60}
      className="size-[30px] rounded-lg"
      priority
    />
    <Typography variant="h1" className="text-primary">
      Miguel Vila
    </Typography>
  </NextLink>
);

export default Logo;
