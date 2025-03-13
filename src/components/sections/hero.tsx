import { Typography } from "@/components/typography";
import NextLink from "next/link";
import Image from "next/image";
import { contacts } from "@/data";

export const Hero = ({ className = "" }) => {
  return (
    <div className={`relative w-full py-12 ${className}`}>
      <div className="container mx-auto flex items-center justify-center">
        <div className="z-10 flex max-w-[350px] flex-col-reverse items-center gap-4 md:max-w-[450px] lg:max-w-[600px] lg:flex-row">
          <div className="flex h-full flex-col items-center justify-between gap-4 text-center lg:items-start lg:text-left">
            <div className="flex items-baseline space-x-1 space-y-6 lg:flex-col lg:space-x-0">
              <Typography
                variant="h1"
                className="text-base font-bold leading-none tracking-tight sm:text-xl md:text-3xl lg:text-5xl"
              >
                Hi, I&apos;m <span className="text-primary">Miguel Vila</span>
              </Typography>
            </div>
            <p className="text-md text-muted-foreground lg:mb-6">
              I&apos;m a computer engineer with a passion for Linux, Open Source
              and Trail Running converting caffeine into low quality code since
              2003!
            </p>
            <div className="flex space-x-4">
              <div className="flex space-x-4">
                {contacts.map((item) => (
                  <NextLink
                    key={item.link}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    {item.icon({
                      className:
                        "w-7 h-7 hover:text-primary transition-colors hover:scale-110",
                    })}
                  </NextLink>
                ))}
              </div>
            </div>
          </div>
          <Image
            src="/images/profile-picture-pixelated.png"
            alt="Profile"
            width={200}
            height={200}
            className="size-[128px] rounded-lg md:size-[150px] lg:size-[190px]"
            priority
          />
        </div>
      </div>
      <div
        className="absolute left-1/2 top-1/2 z-0 h-[120%] max-h-[400px] min-h-[350px] w-[120%] min-w-[400px] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-15 blur-3xl dark:bg-secondary dark:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
};
