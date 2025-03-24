import { Typography } from "@/components/typography";
import { about, education, experience } from "@/data";
import {
  CredentialList,
  CredentialItem,
} from "@/components/ui/credential-list";

export const About = () => {
  return (
    <section className="container flex flex-col space-y-8 py-4">
      <Typography variant="h1" underline>
        📝 About Me
      </Typography>
      <div className="flex flex-col space-y-6">
        <p className="text-md text-foreground">{about}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CredentialList title="Education">
          {education.map((item) => (
            <CredentialItem
              key={item.title}
              title={item.title}
              subtitle={`${item.start} - ${item.end}, at ${item.subtitle}`}
              description={item.description}
            />
          ))}
        </CredentialList>
        <CredentialList title="Experience">
          {experience.map((item) => (
            <CredentialItem
              key={item.title}
              title={item.title}
              subtitle={`${item.start} - ${item.end}, at ${item.subtitle}`}
              description={item.description}
            />
          ))}
        </CredentialList>
      </div>
    </section>
  );
};

export default About;
