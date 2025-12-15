# International Emergency Guide - Project Documentation

## Overview
The International Emergency Guide is an advanced multilingual emergency response platform. Its primary purpose is to provide critical medical and safety information, supported by comprehensive maintenance systems, updated protocols, enhanced AI capabilities, and modern 3D design. The project aims to offer a reliable and user-friendly resource for emergency situations, leveraging advanced technology to deliver accurate and timely information.

## User Preferences
- Focus on medical accuracy and safety
- Professional, clean interface design
- Mobile-first responsive design
- Comprehensive offline functionality
- Evidence-based information only

## System Architecture

### UI/UX Decisions
The platform features a mobile-optimized 3D design with touch-friendly interactions, responsive animations, and professional aesthetics including glassmorphism and parallax scrolling. Authentic imagery featuring Mongolian emergency service personnel is used in the hero section.

### Technical Implementations
The frontend is built with **React 18** and **TypeScript**, styled with **Tailwind CSS** (including custom 3D animations), uses **Wouter** for routing, and **React Query** for state management. **i18next** handles internationalization, and **PWA** capabilities are integrated for offline support. The backend utilizes an **Express.js** server and integrates with **OpenAI** for AI functionalities. Comprehensive TypeScript interfaces ensure type safety for all medical data structures.

### Feature Specifications
- **Advanced Medical Triage System**: AI-powered symptom checker with a 5-level clinical triage system, real-time critical symptom identification, a comprehensive conditions database, and clinical decision support.
- **Enhanced Hospital Search System**: Multi-parameter search capabilities, professional hospital profiles with detailed service information, real-time filtering, and enhanced Google Maps integration with color-coded markers.
- **Professional-Grade Medication Database**: Includes 15+ critical medications with complete clinical profiles (FDA dosing, pharmacokinetics, contraindications), advanced drug categories, and clinical decision support (black box warnings, pregnancy categories, drug interactions).
- **Updated Emergency Protocols**: Over 30 comprehensive protocols adhering to 2025 medical standards (AHA, ATLS, WHO guidelines), providing detailed step-by-step instructions, timing, safety warnings, and professional medical content. Multimedia content has been removed in favor of text-only, enhanced written instructions.
- **Routine Maintenance System**: Automated scheduler for database updates, protocol reviews, and system health monitoring, including weekly, monthly, and quarterly tasks.

### System Design Choices
The architecture is PWA-enabled for offline access and prioritizes a mobile-first, responsive design. Mock AI implementations are used to avoid direct API key requirements in certain contexts, with comprehensive error handling and fallbacks.

## External Dependencies
- **OpenAI**: Integrated for AI capabilities.
- **Google Maps API**: Used for hospital location services and mapping.
- **GitHub Actions**: Utilized for automated deployment pipelines.
- **Vercel**: Production-ready deployment configuration.
- **AHA, ATLS, WHO, CDC**: Authoritative sources for medical protocol standards.