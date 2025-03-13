import { Typography } from "@/components/typography";
import { about, education } from "@/data";

export const About = () => {
  return (
    <section className="container flex flex-col space-y-8 py-4">
      <Typography variant="h1" underline>
        📝 About Me
      </Typography>
      <div className="flex flex-col space-y-6">
        <p className="text-md text-justify text-foreground">{about}</p>
      </div>
      <div className="flex flex-col space-y-6">
        <Typography variant="h2">Education</Typography>
        <div className="flex flex-col gap-3">
          {education.map((item) => (
            <div
              key={item.title}
              className="flex flex-col space-y-2 rounded-md border-l-4 border-primary pl-4"
            >
              <div className="flex flex-col space-y-2">
                <Typography variant="h3">{item.title}</Typography>
                <p className="font-semibold leading-none tracking-tight text-muted-foreground">
                  {item.start} - {item.end}, at {item.subtitle}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
