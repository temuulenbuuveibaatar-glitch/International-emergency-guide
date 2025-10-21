# International Emergency Guide - Project Documentation

## Overview
The International Emergency Guide is an advanced multilingual emergency response platform designed to provide critical medical and safety information. Its primary purpose is to offer comprehensive, up-to-date emergency protocols, an extensive medication database, and a detailed hospital directory to users globally. The platform emphasizes medical accuracy, ease of use, and a modern, responsive design.

Key capabilities include:
- Advanced AI-powered symptom checker with a 5-level clinical triage system.
- Comprehensive and regularly updated emergency protocols based on international standards.
- Detailed medication database with clinical decision support.
- Expanded hospital database with verified location and service information.
- A robust maintenance system to ensure data accuracy and system health.
- Mobile-optimized 3D design for an intuitive user experience.

The project aims to be a leading resource for emergency medical guidance, leveraging AI and modern web technologies to deliver reliable information quickly and efficiently.

## User Preferences
- Focus on medical accuracy and safety
- Professional, clean interface design
- Mobile-first responsive design
- Comprehensive offline functionality
- Evidence-based information only

## System Architecture

### UI/UX Decisions
The platform features a mobile-optimized 3D design with touch-friendly interactions, responsive animations, and advanced visual effects like glassmorphism and parallax scrolling. The aesthetic is professional, matching premium medical applications. Authentic imagery featuring Mongolian emergency service personnel is used in the hero section.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript for type safety, utilizing Tailwind CSS for styling and custom 3D animations. Wouter handles routing, React Query manages state, and i18next provides internationalization. The application is a Progressive Web App (PWA) with offline support.
- **Backend**: An Express.js server integrates with OpenAI for AI capabilities (when an API key is provided) and exposes RESTful API endpoints for all system components.
- **Data Systems**: Comprehensive databases for emergency protocols (30+ updated to 2025 standards), a medication database (15+ critical medications with interaction checking), and a hospital database (verified data with quality metrics). A routine maintenance system automates updates and monitoring.
- **AI-Powered Symptom Checker**: Features a professional 5-level triage system, over 50 detailed symptom profiles, an advanced diagnostic engine for real-time probability calculation, and a comprehensive condition database. It integrates patient information for personalized assessment and includes emergency detection protocols.
- **Enhanced Hospital Search System**: Offers multi-parameter search capabilities, professional hospital profiles with detailed service information and quality ratings, and real-time filtering, integrated with Google Maps for visual representation.
- **Professional-Grade Medication Database**: Includes 15+ critical medications with complete clinical profiles, advanced drug categories, and clinical decision support information such as black box warnings and pregnancy categories.
- **Emergency Protocols**: Over 30 protocols updated to 2025 international standards (AHA, ATLS, WHO, CDC), providing detailed step-by-step instructions with timing, critical steps, and safety warnings.

### System Design Choices
- **Type Safety**: Extensive use of TypeScript interfaces for all medical data structures.
- **Component Library**: Integration of modern UI components styled for a professional medical aesthetic.
- **Search Algorithms**: Advanced multi-criteria filtering with probability-based ranking.
- **Data Processing**: Real-time dynamic filtering and sorting capabilities for various data sets.
- **Security & Privacy**: No storage of personal medical information, anonymized usage analytics, secure API endpoints with validation, and HTTPS enforcement. Comprehensive medical disclaimers are present.

## External Dependencies
- **OpenAI**: Integrated for AI capabilities within the symptom checker and diagnostic engine.
- **Google Maps API**: Used for displaying hospital locations and enhancing search functionality.
- **GitHub Pages**: Utilized for static site deployment.
- **Vercel**: Used for production deployments and performance optimization.
- **i18next**: For internationalization.
- **React Query**: For server state management.
- **Wouter**: For client-side routing.