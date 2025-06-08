
# Technologies Used in EmployMint

This document outlines the key technologies, frameworks, and libraries used to build the EmployMint application.

## Core Frontend Framework & Libraries:
- **Next.js:** React framework for server-side rendering, static site generation, and a full-stack experience (App Router).
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript for static typing, enhancing code quality and maintainability.

## UI & Styling:
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development and styling.
- **ShadCN UI:** A collection of re-usable UI components built using Radix UI and Tailwind CSS, providing foundational elements like buttons, cards, dialogs, etc.
- **Lucide React:** Library for a comprehensive set of simply designed icons.
- **CSS Variables:** Used extensively for theming (light/dark mode, color palettes) via `src/app/globals.css`.

## Forms & Validation:
- **React Hook Form:** Performant, flexible, and extensible forms with easy-to-use validation.
- **Zod:** TypeScript-first schema declaration and validation library, used with React Hook Form and for defining AI flow input/output schemas.

## AI & Backend Functionality:
- **Genkit (by Google):** An open-source framework used for building all AI-powered features. It orchestrates calls to Large Language Models (LLMs) and manages AI flows.
  - Located in `src/ai/flows/`.
- **Google AI Models (e.g., Gemini family):** The underlying LLMs accessed via Genkit for content generation, analysis, and providing intelligent recommendations.

## State Management:
- **React Context API:** Used for managing global application state such as:
  - User profile information (`ProfileContext`).
  - Job match results (`JobResultsContext`).
  - Resume data (`ResumeDataContext`).
  - Appearance settings (theme, zoom, view mode, color palettes) (`AppearanceContext`).

## Client-Side Data Persistence:
- **Browser Local Storage:** Utilized for persisting user profile data, application settings (theme, zoom, etc.), and resume data directly on the client-side.

## PDF Generation (Client-Side):
- **jsPDF:** Library to generate PDFs directly in the browser.
- **html2canvas:** Library to capture HTML elements as canvas images, used in conjunction with jsPDF for the Resume Builder's PDF export.

## Utility Libraries:
- **clsx & tailwind-merge:** Utilities for conditionally joining class names, especially useful with Tailwind CSS.
- **uuid:** For generating unique identifiers (e.g., for resume sections).
- **date-fns:** (Potentially used, common in React projects) For date formatting and manipulation.

## Development & Build Tools:
- **Node.js & npm/pnpm/yarn:** JavaScript runtime and package manager.
- **ESLint & Prettier:** (Assumed, standard for Next.js projects) For code linting and formatting.
- **Turbopack:** (Used in `dev` script) An incremental bundler optimized for JavaScript and TypeScript, written in Rust.

This list provides a snapshot of the primary technologies. For a complete list of all dependencies, please refer to the `package.json` file.
