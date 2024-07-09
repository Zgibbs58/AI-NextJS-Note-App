# AI Nextjs Note Taking App

AI chatbot with Next.js 14, the ChatGPT API, vector embeddings, Pinecone, TailwindCSS, and Shadcn UI. The app is written in TypeScript and uses the Next.js app router. This project includes a comprehensive setup for VS Code with Prettier, the Prettier-Tailwind-Plugin, the TailwindCSS IntelliSense extension, and ESLint. A [tutorial](https://www.youtube.com/watch?v=mkJbEP5GeRA&t=1898s) was used to create this project. The pinecone API has changed an no longer works with the tutorial's code, so I updated all packages as of 7/8/24 and corrected the outdated code to work correctly.

![Showcase Gif](/src/assets/aiNotesAppNext.gif)

## Link to Tutorial Used

[Custom AI Note Chatbot Tutorial](https://www.youtube.com/watch?v=mkJbEP5GeRA&t=1898s)

## Features

- AI Chat with Response Streaming: Using the Vercel AI SDK (useChat, StreamingTextResponse, OpenAIStream) and API route handlers.
- Intelligent Document Retrieval: Utilizing ChatGPT vector embeddings and Pinecone.
- Light & Dark Theme Toggle: Implemented with next-themes.
- User Authentication: Powered by Clerk.
- Note Management: Create, update, and delete notes using Prisma and MongoDB Atlas.
- Nested Layouts: For a clean and organized structure.
- Form & Backend Validation: Using Zod, React-Hook-Form, and Shadcn UI Form.
- Fully Mobile-Responsive Layout: Achieved with TailwindCSS modifiers.

## Setup Instructions

1. Clone the repo:

```bash
git clone Fully Mobile-Responsive Layout: Achieved with TailwindCSS modifiers.
cd AI-NextJS-Note-App
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables: Create a .env file and add the necessary environment variables for MongoDB, Clerk, OpenAI, and Pinecone.

4. Run the development server:

```bash
npm run dev
```

## Link For Migrating to New Pinecone API

[Pinecone API Docs](https://docs.pinecone.io/guides/operations/migrate-to-the-new-api#create-a-serverless-index)

## Deployed Link

[Vercel Deployed Link](https://ai-next-js-note-app.vercel.app/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
