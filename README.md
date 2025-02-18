Welcome to my personal website: a place to showcase my projects, skills, and other information about me.

I am using [Next.js](https://nextjs.org), [React](https://reactjs.org), [TypeScript](https://www.typescriptlang.org), [Shadcn UI](https://ui.shadcn.com/) as the library for the UI components, [Tailwind CSS](https://tailwindcss.com) for styling, and hosting on my own infrastructure.

This project is a work in progress and will be updated as I continue to work on it.

## Usage

### Development

Working locally on the project is simple. Follow the steps below to get started:

```bash
# Clone the repository
git clone https://github.com/miguelovila/pw
# Navigate to the project directory
cd pw
# Create a .env file with the necessary environment variables
echo "NEXT_PUBLIC_BASE_URL=localhost:3000" > .env
# Install dependencies
bun install
# Start the development server
bun run dev
```

Open the browser and visit [`http://localhost:3000`](http://localhost:3000) to see the website in action.

### Production

Building the project for production is also straightforward. Run the following commands:

```bash
# Build the docker image for production
docker build -t personal-website .
# Run the docker container
cd deployment
docker-compose up -d
# Verify the container is running
docker ps
```

Open the browser and visit [`http://localhost:33000`](http://localhost:33000) to see the website in action.
