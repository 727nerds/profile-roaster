# osu! Profile Roaster 🔥

_Click the circles, get roasted. [Try it now!](https://roaster.srizan.dev)_

## About

The ultimate tool for competitive osu! players who need a reality check. This AI-powered roaster analyzes your profile and serves up spicy takes that'll make you wish you stuck to playing Harumachi Clover.

## Features

- 🤖 AI-powered profile analysis
- 🎯 Supports all game modes (osu!, mania, taiko, catch)
- 🌟 PP calculation roasts
- 🎮 Farm map detection
- ⏱️ Play time to grass touch ratio calculator

## Tech Stack

- 🎯 Bun - Because Node.js is as slow as your streaming speed
- ⚡ Hono - Fast backend framework (unlike your reaction time)
- 🎨 React & shadcn/ui - For that smooth UI (smoother than your aim)
- 📊 Prometheus + Grafana - To track how many people get roasted
- 🗄️ Dragonfly (redis) - For caching (like how you cache PP)

## Getting Started

### Prerequisites

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload your shell
source ~/.bashrc

# Clone the repo
git clone https://github.com/727nerds/osu-profile-roaster.git
cd osu-profile-roaster

# Install dependencies
bun install
```

### Configuration

Create a `.env` file in the `apps/backend` directory:

```env
OSU_CLIENT_ID=your_client_id
OSU_CLIENT_SECRET=your_client_secret
OPENROUTER=your_openrouter_key
TURNSTILE_SECRET=your_turnstile_secret
METRICS_USERNAME=prometheus
METRICS_PASSWORD=password
NODE_ENV=development
```

### Development

```bash
# Run frontend and backend in development mode
bun run dev
# Run development services (prometheus, grafana)
docker compose -f dev/compose.yml up -d
# Dragonfly isn't necessary for development as data is stored in the kv directory.
```

## Contributing

Feel free to contribute! Just make sure your code is cleaner than a cross-screen jumpscare pattern.

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a PR

## License

This project is licensed under GNU GPL v3 - see the `LICENSE` file for details.

## Acknowledgments

- peppy for creating a game that gives us so much to roast about
- Me for coming up with this idea (I'm a genius, I know)
- Claude for helping me out with the inside jokes inside this README

## Other
- Submission #1 for [Hack Club High Seas](https://highseas.hackclub.com/)
- Looking for support to pay for Claude 3 Sonnet credits (gives best results and roasts and basically everything)
- Sorry for the cringy README, I went creative for a second
