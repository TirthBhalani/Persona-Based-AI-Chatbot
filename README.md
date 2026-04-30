# Persona-Based AI Chatbot

A full-stack, persona-based AI chatbot featuring three distinct educational personas from Scaler and InterviewBit:
1. **Anshuman Singh**
2. **Kshitij Mishra**
3. **Abhimanyu Saxena**

This application uses the OpenRouter API to deliver deep, nuanced, and structurally formatted responses that perfectly imitate the personalities based on strict system prompts, few-shot learning, and Chain-of-Thought prompting.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express, Axios
- **AI Integration**: OpenRouter API (using Google's Gemini models)

## Features
- **Persona Switcher**: Seamlessly switch between the three personas. The conversation thread resets automatically upon switching.
- **Typing Indicator**: Real-time visual feedback while waiting for API responses.
- **Suggestion Chips**: Quick-start questions dynamically update based on the selected persona.
- **Responsive UI**: Sleek, mobile-friendly interface built without excessive UI frameworks.
- **Graceful Error Handling**: Fallbacks for API errors or empty states.

## Live Demo
[Deployed Link Placeholder - update this when deployed]

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- An [OpenRouter API Key](https://openrouter.ai/)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/TirthBhalani/Persona-Based-AI-Chatbot
   cd "GenAi ChatBot"
   ```

2. Setup Backend:
   ```bash
   cd server
   npm install
   ```

3. Setup Environment Variables:
   - Copy `.env.example` to a new `.env` file in the `server` directory or root:
   ```bash
   cp ../.env.example .env
   ```
   - Update `.env` with your actual `OPENROUTER_API_KEY`.

4. Start Backend Server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend will run on `http://localhost:5000`.

5. Setup Frontend:
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```

6. Start Frontend Development Server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### Usage
- Open the frontend URL in your browser.
- Select a persona using the tab switcher.
- Click a suggestion chip or type your own question to start chatting.

## Project Structure
- `client/` - React frontend
- `server/` - Express backend
- `prompts.md` - System prompts documentation
- `reflection.md` - Developer reflections on the project
