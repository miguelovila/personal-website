export const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="flex w-full flex-row justify-center border-t bg-background">
      <div className="container flex flex-col justify-center gap-2 border-l border-r p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {date} Miguel Vila, All Rights Reserved</p>
        <p>🚧 Website under construction 🚧</p>
      </div>
    </footer>
  );
};
