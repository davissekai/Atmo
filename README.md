<h1 align="center">🌿 Atmo - Climate Science Assistant</h1>

<p align="center">
  <strong>AI-powered climate assistant for environmental insights and sustainability guidance</strong>
</p>

<p align="center">
  Atmo is an intelligent climate assistant built with Next.js and Google Gemini 3. Ask questions about climate change, carbon footprints, emission factors, renewable energy, and sustainability practices.
</p>

<br/>

## ✨ Features

- **Climate-Focused AI** - Specialized responses on environmental science, carbon accounting, and sustainability
- **No Login Required** - Start chatting immediately without creating an account
- **Real-time Weather** - Get current weather data for any location
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Mobile Responsive** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org) with App Router
- **AI**: [Google Gemini 3](https://ai.google.dev/) via [AI SDK](https://ai-sdk.dev)
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Auth**: [Auth.js](https://authjs.dev) (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key

### Environment Variables

Create a `.env.local` file with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
POSTGRES_URL=your_database_url
AUTH_SECRET=your_auth_secret
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with Atmo.

## 🌍 What Can Atmo Help With?

- **Climate Science** - Understanding greenhouse gases, carbon cycles, and climate models
- **Carbon Footprints** - Calculating and reducing personal/corporate emissions
- **Emission Factors** - Data on energy, transportation, and industrial emissions
- **Sustainability** - Best practices for individuals and organizations
- **Renewable Energy** - Solar, wind, hydro, and other clean energy sources
- **Climate Policy** - Paris Agreement, carbon pricing, and regulations

## 📄 License

MIT License - feel free to use and modify for your own projects.

---

<p align="center">
  Built with 💚 for a sustainable future
</p>
