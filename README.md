
# SkillSync: AI-Powered Career Advancement Platform

## Table of Contents
1. [Overview](#overview)
2. [Main Features](#main-features)
    - [Profile Management](#profile-management)
    - [Skill-Based Job Matching](#skill-based-job-matching)
    - [Job-Focused Skill Comparison / Job Fit Analysis](#job-focused-skill-comparison--job-fit-analysis)
    - [SkillSync+ Features](#skillsync-features)
        - [Personalized Skill Development Path](#personalized-skill-development-path)
        - [Resume Builder](#resume-builder)
        - [Soft Skill Assessment](#soft-skill-assessment)
        - [Real-Time Job Market Trends](#real-time-job-market-trends)
        - [AI Interview Practice](#ai-interview-practice)
        - [Social Integration & Networking](#social-integration--networking)
        - [Community Forum](#community-forum)
        - [AI-Based Salary Estimator](#ai-based-salary-estimator)
        - [Company Culture & Work Environment Matching (Coming Soon)](#company-culture--work-environment-matching-coming-soon)
        - [Smart Notifications & Reminders (Coming Soon)](#smart-notifications--reminders-coming-soon)
        - [Job Application Tracker (Coming Soon)](#job-application-tracker-coming-soon)
    - [Appearance Settings](#appearance-settings)
    - [FAQs](#faqs)
    - [Credits](#credits)
3. [Key Technologies Used](#key-technologies-used)
4. [Getting Started (in Firebase Studio)](#getting-started-in-firebase-studio)
5. [Future Enhancements](#future-enhancements)

## Overview

SkillSync is a Next.js web application designed to assist users in their career journey through a suite of AI-powered tools. It helps with skill assessment, job matching, resume building, interview preparation, market trend analysis, and more, aiming to provide a comprehensive platform for career development and advancement. The application primarily uses local browser storage for user data, ensuring privacy and quick access.

## Main Features

### Profile Management (`/profile`)
Users can create and manage their professional profile.
-   **Information:** Store and update name, age, and profile picture.
-   **Skills:** Add, manage, and specify years of experience for technical and soft skills. This skill list is pivotal as it's utilized by various AI features for personalized analysis and matching.
-   **Social Links:** Consolidate professional online presence by adding URLs for LinkedIn, GitHub, X (formerly Twitter), and a personal website/portfolio.
-   All profile data is saved locally in the user's browser.

### Skill-Based Job Matching (Main Tab)
This core feature allows users to discover potential job opportunities tailored to their profile.
-   **Input Criteria:** Users specify their ideal job title, a description of their ideal role/responsibilities, and optional preferences like country, state (for USA), desired salary range, and preferred work model (on-site, remote, hybrid).
-   **AI-Generated Job Postings:** Based on the user's profile skills and input criteria, the AI generates 3-5 diverse, example job postings. Each posting includes:
    -   Job title, an invented company name, and location.
    -   An estimated salary range, employment type, and work model.
    -   A concise job summary.
    -   Key responsibilities, along with required and preferred skills.
    -   Typical experience and education levels.
    -   A **match percentage** (0-100%) indicating the alignment between the user's skills and the generated job requirements.
    -   A brief rationale explaining the match score.
-   **Sorting & Details:** Results can be sorted by the highest or lowest match percentage. Clicking on a job card navigates to a detailed view page (`/job-details/[id]`) showing more comprehensive information and a skills comparison.

### Job-Focused Skill Comparison / Job Fit Analysis (Main Tab)
This feature helps users understand how their current skillset aligns with specific job requirements or general career paths.
-   **Option 1: Specific Job Posting Analysis:** Users can paste a full job description from a posting they are interested in. The AI analyzes this against their profile skills and provides:
    -   A summary of skill comparison and alignment.
    -   A list of identified missing hard skills.
    -   Suggested learning resources (e.g., specific online courses, books, project ideas, relevant certifications) for these missing skills.
    -   Actionable interview tips.
    -   A list of relevant soft skills that are valuable for the role.
    -   General mentorship advice.
    -   A skill development roadmap if significant skill gaps are identified.
-   **Option 2: General Career Guidance:** If no job description is provided, the AI performs a general analysis based on the user's profile skills, offering:
    -   Suggestions for suitable job categories or career paths that align with the user's skills, potentially including estimated salary ranges.
    -   General interview preparation tips and mentorship advice.
    -   A generic skill development roadmap.

### SkillSync+ Features (Main Tab - Collection of sub-features)
This section provides access to a variety of specialized tools to further aid in career development.

#### Personalized Skill Development Path (`/personalized-skill-path`)
-   Focuses on generating a personalized learning roadmap.
-   Users can input a target job description/role or leave it blank for general advice based on their current profile skills.
-   The AI provides a detailed analysis including missing skills, suggested hard skill resources, a skill comparison summary, interview tips, relevant soft skills, mentorship advice, and a structured, step-by-step **skill development roadmap** (3-7 steps from foundational to advanced) to bridge skill gaps or advance career progression.

#### Resume Builder (`/resume-builder`)
-   A tool to craft professional resumes. Users can input details across various sections:
    -   **Personal Details:** Name, contact info, address, professional summary, social/portfolio links (can be pre-filled from the user's SkillSync profile).
    -   **Work Experience:** Job title, company name, location, employment dates, and a list of responsibilities/achievements for each role.
    -   **Education:** Degree, institution, location, graduation date, and any relevant details (GPA, honors, coursework).
    -   **Skills:** Pre-filled from the user's profile but can be customized specifically for the resume.
    -   **Projects:** Project name, description, technologies used, and an optional link.
    -   **Certifications:** Certification name, issuing organization, date earned, and an optional credential ID.
-   **Layouts & Preview:** Users can select from different resume layouts (currently 'Classic', 'Modern', 'Compact' - visual placeholders). A basic live preview is displayed.
-   **Download:** Resumes can be downloaded as a PDF, generated using `html2canvas` and `jsPDF`.

#### Soft Skill Assessment (`/soft-skill-assessment`)
-   An AI-driven tool to evaluate a user's soft skills.
-   **Process:** Users answer a predefined set of 15 behavioral and situational questions designed to elicit responses that demonstrate various soft skills.
-   **AI Analysis:** The AI analyzes these answers to assess competencies like Communication, Problem-Solving, Teamwork, Leadership, Adaptability, Creativity, Time Management, and Emotional Intelligence.
-   **Feedback:** Provides a comprehensive report including:
    -   An overall summary of the user's soft skill profile.
    -   For each distinct soft skill identified: a detailed textual assessment of proficiency, key strengths demonstrated, specific areas for improvement, and actionable development tips or resources.

#### Real-Time Job Market Trends (`/market-trends`)
-   Offers AI-powered insights into current job market dynamics.
-   **Customization:** Users can optionally specify an "area of interest" (e.g., "USA," "Technology Sector in Europe," "Remote Marketing Jobs globally") to focus the analysis. The user's profile skills are also taken into account.
-   **Insights Provided:**
    -   An overall summary of the current job market climate for the specified area.
    -   A list of 5-7 job titles currently trending or seeing increased demand.
    -   A list of 5-7 key hard and soft skills highly sought after by employers, including reasons for demand and optionally related roles.
    -   Details on 2-4 emerging or rapidly evolving job roles, with descriptions and typical skills.
    -   Insights for 2-3 key industries relevant to the area of interest, focusing on job market implications and growth outlook.
    -   A general qualitative comment on salary trends.
    -   3-5 actionable key takeaways/advice for job seekers based on these trends.
    -   If user skills were provided, a brief comment on their relevance to current market demands.

#### AI Interview Practice (`/interview-practice`)
-   Helps users hone their interview skills through AI-powered mock interviews.
-   **Setup:** Users input a job title or role they are practicing for and select the number of questions (3-10).
-   **Question Generation:** The AI generates realistic interview questions tailored to the specified job title, covering behavioral, technical, situational, or general topics.
-   **Answering & Feedback:** For each question, the user types their answer. The AI then evaluates the response, providing:
    -   A concise overall assessment of the answer.
    -   A list of 2-3 specific positive aspects or strengths.
    -   A list of 2-3 specific, actionable areas for improvement.
    -   Optionally, a suggested alternative phrasing for better impact or clarity.
-   **Session Flow:** Users can navigate between questions, submit answers one by one to receive immediate feedback, and review all questions, answers, and feedback at the end of the session.

#### Social Integration & Networking (`/social-networking`)
-   A hub for managing professional online presence and community engagement.
-   **Profile Links:** Encourages users to add their professional social media links (LinkedIn, GitHub, etc.) to their SkillSync Profile page, which can then be used by features like the Resume Builder.
-   **Community Access:** Provides a link to the SkillSync Community Forum.
-   **Future Features:** Mentions that advanced networking features like direct mentor matching and deeper integrations with platforms like LinkedIn are planned for future updates.

#### Community Forum (`/community-forum`)
-   An interactive visual mock-up demonstrating a potential community forum.
-   **Structure:** Organized by categories like "Interview Experiences & Tips," "Skill Development & Learning," and "Job Search Strategies."
-   **Interaction (Mock):** Users can click on example posts within categories to view mock content (original post and replies) in a dialog pop-up.
-   **Status:** Full functionality (creating posts, replying, user-generated content) is marked as "Coming Soon."

#### AI-Based Salary Estimator (`/salary-estimator`)
-   Allows users to get AI-driven salary estimations for various roles.
-   **Input:** Users provide:
    -   Job Title (required).
    -   Years of Relevant Experience (required).
    -   Key Skills (comma-separated, required).
    -   Location (optional).
    -   Company Size (optional: startup, mid-size, large-enterprise, any).
    -   Industry (optional).
-   **Output:** The AI generates:
    -   An estimated annual salary range (low and high values).
    -   The currency for the estimate (e.g., USD, EUR).
    -   The AI's confidence level in the estimation (high, medium, or low).
    -   A list of 2-4 key factors that influenced the salary estimation.
    -   Optional additional notes or disclaimers (e.g., limitations of the estimate).

#### Company Culture & Work Environment Matching (`/company-culture`) (Coming Soon)
-   This page currently indicates that the feature is under development.
-   **Planned Functionality:** To help users discover companies that align with their personal values, preferred work styles, and cultural expectations by analyzing employer reviews, culture descriptions, and other relevant data.

#### Smart Notifications & Reminders (`/notifications`) (Coming Soon)
-   This page currently indicates that the feature is under development.
-   **Planned Functionality:** To provide users with timely alerts for new job openings matching their profile, reminders to complete skill-building goals, or prompts to update their professional profiles.

#### Job Application Tracker (`/application-tracker`) (Coming Soon)
-   This page currently indicates that the feature is under development.
-   **Planned Functionality:** To allow users to log and manage their job applications, track statuses (applied, interviewing, offer, etc.), log interview dates, store notes, and manage follow-up actions in an organized manner.

### Appearance Settings (Cog Icon in Header)
Accessible via the settings (cog) icon in the header, allowing users to customize their viewing experience.
-   **Dark Mode Toggle:** Switch between light and dark application themes.
-   **Color Palette:** Choose from multiple color schemes that affect primary, accent, and secondary colors.
-   **Zoom Level:** Adjust the overall zoom of the application interface (from 50% to 200%).
-   **View Mode:** Toggle between 'Desktop' and 'Mobile' view simulations. In 'Mobile' mode, for instance, the main navigation tabs move to a fixed bottom bar, and content layouts may adapt.
-   **Fullscreen (Desktop):** A dedicated button to enter or exit a fullscreen view of the application on desktop devices.
-   These settings are persisted locally in the browser's local storage.

### FAQs (`/faqs`)
-   A dedicated page providing a comprehensive list of Frequently Asked Questions and their answers.
-   Questions are organized by feature categories (e.g., "Skill-Based Job Matching FAQs," "AI Resume Builder FAQs") and presented in an accordion style for easy navigation.

### Credits (`/credits`)
-   Displays information about the creators of the SkillSync application, including names, roll numbers, and placeholder images.

## Key Technologies Used

-   **Frontend:**
    -   **Next.js:** React framework (App Router used).
    -   **React:** JavaScript library for building user interfaces.
    -   **TypeScript:** Superset of JavaScript for static typing.
    -   **Tailwind CSS:** Utility-first CSS framework for styling.
    -   **ShadCN UI:** Collection of re-usable UI components built using Radix UI and Tailwind CSS.
    -   **Lucide React:** Library for icons.
    -   **React Hook Form & Zod:** For robust form creation and validation.
    -   **jsPDF & html2canvas:** For client-side PDF generation in the Resume Builder.
-   **Backend/AI:**
    -   **Genkit (by Google):** An open-source framework used for building all AI-powered features, orchestrating calls to Large Language Models.
    -   **Google AI Models (e.g., Gemini family):** The underlying LLMs accessed via Genkit for content generation, analysis, and providing intelligent recommendations.
-   **State Management & Storage:**
    -   **React Context API:** Used for managing global state such as user profile information, job match results, resume data, and appearance settings.
    -   **Browser Local Storage:** For persisting user profile data and application settings on the client-side.

## Getting Started (in Firebase Studio)

This application is designed to be developed and run within the Firebase Studio environment.
1.  The project dependencies are defined in `package.json` and should be automatically managed by the Firebase Studio setup.
2.  The main entry point for exploration is the homepage, located at `src/app/page.tsx`.
3.  Genkit AI flows are located in `src/ai/flows/`. Ensure any necessary API keys for Google AI services are configured, typically managed through environment variables (check `.env` if applicable, though often handled by the Studio).

## Future Enhancements

-   Full implementation of "Coming Soon" features:
    -   Company Culture & Work Environment Matching.
    -   Smart Notifications & Reminders.
    -   Job Application Tracker.
    -   Fully functional Community Forum.
-   Deeper integrations with professional networking platforms (e.g., LinkedIn).
-   Advanced mentor matching capabilities.
-   Transition from local storage to user accounts with cloud-based data persistence for a more robust and multi-device experience.
-   Exploration of more specialized AI models or fine-tuning existing models for enhanced accuracy in features like salary estimation and skill analysis.
-   Expanded library of resume templates and more advanced customization options in the Resume Builder.
-   Gamification elements for skill development and job searching.
-   Accessibility improvements (WCAG compliance).

---
This README aims to provide a comprehensive guide to the SkillSync application.
