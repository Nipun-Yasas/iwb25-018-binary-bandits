# Insurance Claim Validation Frontend

This is a [Next.js](https://nextjs.org) project for insurance claim validation with an integrated AI chatbot assistant.

## Features

- **AI-Powered Chatbot**: Insurance claim validation assistant using Google Gemini API
- **Real-time Analysis**: Instant feedback on claim validity and fraud detection
- **File Upload Support**: Upload claim documents for analysis
- **Modern UI**: Built with Material-UI and Toolpad Core components

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Chatbot Features

The integrated chatbot provides:

- **Claim Validation**: Assess claim legitimacy and completeness
- **Fraud Detection**: Identify potential fraud indicators and red flags
- **Policy Compliance**: Check coverage and policy violations
- **Documentation Analysis**: Review required documents and missing items
- **Risk Assessment**: Provide overall risk scores and recommendations

### Using the Chatbot

1. Click the chat icon in the bottom-left corner
2. Type your question or describe your insurance claim
3. Upload relevant documents (PDF, DOC, images)
4. Receive AI-powered analysis and recommendations

## Project Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── layout.tsx          # Main layout with chatbot integration
│   ├── api/
│   │   └── chatbot/
│   │       └── route.ts        # Gemini API integration
│   └── ...
├── components/
│   └── ui/
│       ├── Chatbot.tsx         # Main chatbot component
│       ├── ChatbotIcon.tsx     # Floating chat icon
│       └── ChatbotModal.tsx    # Chat interface modal
└── ...
```

## API Configuration

The chatbot uses Google's Gemini API for natural language processing. Configure your API key in the environment variables:

- `GEMINI_API_KEY`: Server-side API key (recommended)
- `NEXT_PUBLIC_GEMINI_API_KEY`: Client-side API key (for development only)

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/material-ui/)
- [Toolpad Core Documentation](https://mui.com/toolpad/core/)
- [Google Gemini API](https://ai.google.dev/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
