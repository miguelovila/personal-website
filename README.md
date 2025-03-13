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

### Automatic Deployment

I'm running this website on my own infrastructure. It is hosted in a Alpine Linux LXC container. I'll explain my setup for automatically deploying this website everytime the main branch receives an update.

#### Auto Deploy Script

This simple script checks for updates in the repository every 60 seconds and deploys the website if any updates are found. It also clones the repository if it doesn't exist yet.

```bash
#!/bin/bash
# Configuration variables
REPO_URL="https://github.com/miguelovila/pw.git"
REPO_DIR="pw"
BRANCH="main"
CHECK_INTERVAL=60

# Print colored status messages
print_status() {
  echo -e "\e[1;34m==>\e[0m \e[1m$1\e[0m"
}

# Print error messages
print_error() {
  echo -e "\e[1;31m==>\e[0m \e[1m$1\e[0m"
}

# Deployment function
deploy() {
  # Exit on any error within the deploy function
  set -e

  print_status "Building Docker image for production..."
  docker build -t personal-website .

  print_status "Deploying with docker-compose..."
  cd deployment
  docker compose up -d

  print_status "Verifying deployment..."
  docker ps | grep personal-website

  print_status "Deployment complete!"
  echo "Site is now available at https://miguelovila.pt"

  # Return to the repository root
  cd ..
}

# Function to check for updates and deploy if needed
check_and_deploy() {
  print_status "Checking for updates in $REPO_DIR..."

  # Ensure repo directory exists
  if [ ! -d "$REPO_DIR" ]; then
    print_status "Cloning repository for the first time..."
    git clone "$REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
    git checkout $BRANCH
    deploy
    cd ..
    return
  fi

  # Get current local commit hash
  cd "$REPO_DIR"
  local_hash=$(git rev-parse HEAD)

  # Fetch from remote
  git fetch origin $BRANCH

  # Get remote commit hash
  remote_hash=$(git rev-parse origin/$BRANCH)

  # Compare hashes
  if [ "$local_hash" != "$remote_hash" ]; then
    print_status "Updates found! Updating repository..."
    git reset --hard origin/$BRANCH
    git clean -fdx
    deploy
  else
    echo "No updates found. Checking again in $CHECK_INTERVAL seconds..."
  fi

  # Return to the original directory
  cd ..
}

# Setup handler for graceful exit
trap "print_status 'Stopping auto-deployment service...'; exit 0" SIGINT SIGTERM

# Main loop
print_status "Starting auto-deployment service for $REPO_URL"
print_status "Checking for updates every $CHECK_INTERVAL seconds"
print_status "Press Ctrl+C to stop"

while true; do
  check_and_deploy
  sleep $CHECK_INTERVAL
done
```

#### Auto-Deploy Service

Alpine uses OpenRC as its init system rather than systemd. Here is the service:

```
#!/sbin/openrc-run

name="website-auto-deploy"
description="Auto-deployment service for personal website"
command="/bin/sh"
command_args="/home/your-username/auto-deploy.sh"
pidfile="/run/${RC_SVCNAME}.pid"
command_background="yes"
output_log="/var/log/${RC_SVCNAME}.log"
error_log="/var/log/${RC_SVCNAME}.log"

depend() {
    need net
    after firewall
}

start_pre() {
    checkpath -f -m 0644 -o root:root "${output_log}"
}
```

#### Instructions

1. Save the auto-deployment script as /home/your-username/auto-deploy.sh and make it executable:

```bash
chmod +x /home/your-username/auto-deploy.sh
```

2. Save the OpenRC service as /etc/init.d/website-auto-deploy and make it executable:

```bash
chmod +x /etc/init.d/website-auto-deploy
```

3. Add the service to the default runlevel so it starts automatically:

```bash
rc-update add website-auto-deploy default
```

4. Start the service:

```bash
rc-service website-auto-deploy start
```

5. Check if the service is running:

```bash
rc-service website-auto-deploy status
```

6. You can view the logs at `/var/log/website-auto-deploy.log`.
