import { Layout } from "@/components/layout";
import { Typography } from "@/components/typography";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout className="flex flex-col items-center justify-center">
      <div className="z-10 flex max-w-[350px] flex-col-reverse items-center gap-4 md:max-w-[450px] lg:max-w-[600px] lg:flex-row">
        <div className="flex h-full flex-col items-center justify-between gap-4 text-center lg:items-start lg:text-left">
          <div className="flex flex-col items-center justify-center space-x-1 space-y-6">
            <Typography
              variant="h0"
              className="text-9xl font-bold leading-none tracking-tight"
            >
              Error <span className="text-primary">404</span>
            </Typography>
            <NextLink href="/" aria-label="Back to home">
              <Button
                size="lg"
                className="mt-4 uppercase"
                aria-label="Back to home"
              >
                Take me back
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
      <div className="z-1 absolute left-1/2 top-1/2 h-[25vw] max-h-[400px] min-h-[350px] w-[60vw] min-w-[400px] max-w-[900px] -translate-x-2/4 -translate-y-2/3 rounded-full bg-primary opacity-15 blur-3xl dark:bg-secondary dark:opacity-100" />
    </Layout>
  );
}
