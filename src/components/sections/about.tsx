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
          {education.map((item, index) => {
            const delayClasses = ['motion-delay-0', 'motion-delay-100', 'motion-delay-200', 'motion-delay-300', 'motion-delay-500'];
            const delayClass = delayClasses[index] || 'motion-delay-0';

            if (index === 2) return <></>

            return <CredentialItem
              className={`intersect-once intersect:motion-preset-slide-right ${delayClass}`}
              key={item.title}
              title={item.title}
              subtitle={`${item.start} - ${item.end}, at ${item.subtitle}`}
              description={item.description}
            />
          })}
        </CredentialList>
        <CredentialList title="Experience">
          {experience.map((item, index) => {
            const delayClasses = ['motion-delay-0', 'motion-delay-100', 'motion-delay-200', 'motion-delay-300', 'motion-delay-500'];
            const delayClass = delayClasses[index] || 'motion-delay-0';

            return <CredentialItem
              className={`intersect-once intersect:motion-preset-slide-left ${delayClass}`}
              key={item.title}
              title={item.title}
              subtitle={`${item.start} - ${item.end}, at ${item.subtitle}`}
              description={item.description}
            />
})}
        </CredentialList>
      </div>
    </section>
  );
};

export default About;
