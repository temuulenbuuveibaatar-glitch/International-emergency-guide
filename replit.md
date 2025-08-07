# International Emergency Guide - Project Documentation

## Overview
The International Emergency Guide is an advanced multilingual emergency response platform providing critical medical and safety information. Its purpose is to offer comprehensive maintenance systems, updated protocols, enhanced AI capabilities, and modern 3D design to users globally. The project's ambition is to be a professional-grade medical application for emergency guidance.

## User Preferences
- Focus on medical accuracy and safety
- Professional, clean interface design
- Mobile-first responsive design
- Comprehensive offline functionality
- Evidence-based information only

## System Architecture

### UI/UX Decisions
The application features a mobile-optimized 3D design with touch-friendly interactions, advanced visual effects like glassmorphism, floating elements, and parallax scrolling. It maintains professional aesthetics matching premium medical applications, with responsive animations optimized across devices.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript for type safety, utilizing Tailwind CSS for styling and custom 3D animations. Wouter is used for routing, React Query for state management, and i18next for internationalization. PWA capabilities with offline support are integrated.
- **Backend**: An Express.js server handles API endpoints and data management.
- **AI Capabilities**: Integrates OpenAI for AI features (requires API key).
- **Data Systems**: Includes comprehensive databases for emergency protocols, medication information, and hospital data.
- **Search Algorithms**: Enhanced multi-criteria filtering with probability-based ranking for search functionalities.

### Feature Specifications
- **Emergency Protocols**: Over 30 updated protocols adhering to 2025 international standards (AHA, ATLS, WHO, CDC), categorized by medical specialty and urgency level, providing detailed step-by-step instructions.
- **Advanced Medication Database**: Features 15+ critical medications with complete clinical profiles (FDA dosing, pharmacokinetics, contraindications, monitoring parameters) and an interaction checking system.
- **Updated Hospital Database**: Comprehensive and verified hospital data across multiple countries (including Mongolia, USA, UK, Canada, Australia, Japan), offering detailed service information, quality metrics, and location-based search.
- **AI-Powered Symptom Checker**: A professional 5-level triage system with 50+ medical symptoms, an advanced diagnostic engine for real-time probability calculation, and comprehensive condition database. Includes emergency detection with immediate alerts.
- **Routine Maintenance System**: Automated scheduler for database updates, protocol reviews, and system health monitoring to ensure data accuracy and protocol compliance.

### System Design Choices
- **Frontend Framework**: React with TypeScript for robust and type-safe development.
- **Styling**: Tailwind CSS for consistent and utility-first styling.
- **AI Integration**: Designed to integrate with OpenAI for advanced diagnostic and information capabilities.
- **Offline Access**: Progressive Web App (PWA) architecture implemented for comprehensive offline functionality.
- **Medical Disclaimers**: Comprehensive medical disclaimers are included for all AI features and content, emphasizing educational purpose and encouraging professional medical consultation.

## External Dependencies
- **OpenAI**: Used for AI capabilities such as the symptom checker and diagnostic engine.
- **Google Maps API**: Integrated for hospital location display and enhanced search functionalities.