# International Emergency Guide - Project Documentation

## Overview
The International Emergency Guide is an advanced multilingual emergency response platform. Its primary purpose is to provide critical medical and safety information, supported by comprehensive maintenance systems, updated protocols, enhanced AI capabilities, and modern 3D design. The platform aims to deliver a robust, reliable, and user-friendly experience for emergency situations, making vital information accessible and actionable.

## User Preferences
- Focus on medical accuracy and safety
- Professional, clean interface design
- Mobile-first responsive design
- Comprehensive offline functionality
- Evidence-based information only

## System Architecture

### UI/UX Decisions
- Mobile-Optimized 3D Design: Touch-friendly interactions, responsive design with mobile-specific animations, sophisticated glassmorphism, floating elements, and parallax scrolling.
- Professional Aesthetics: Modern 3D design matching premium medical applications.
- Responsive Animations: Optimized performance across devices with adaptive animation systems.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Tailwind CSS for styling and custom 3D animations, Wouter for routing, React Query for state management, i18next for internationalization, and PWA capabilities with offline support.
- **Backend**: Express.js server with OpenAI Integration for AI capabilities (when API key provided), providing RESTful API endpoints.
- **Data Systems**: Comprehensive databases for emergency protocols, medication information, hospital data, and maintenance scheduling.
- **AI-Powered Symptom Checker**: A 5-level clinical triage system with a comprehensive symptom database, advanced diagnostic engine, and critical symptom detection with emergency alerts.
- **Advanced Medication Database**: Includes emergency life-saving medications and critical care medications with complete drug profiles, advanced categories, and clinical decision support.
- **Updated Hospital Database**: Features accurate location data, enhanced service information, quality metrics, and international coverage.
- **Emergency Protocols**: All protocols are updated to 2025 international standards, including new protocols from AHA, ATLS, WHO, and CDC, categorized for clarity.
- **Routine Maintenance System**: Automated scheduler for database updates, protocol reviews, and system health monitoring.
- **Deployment**: Utilizes GitHub Actions for automated deployment and Vercel for production-ready configuration, including performance optimization and global CDN distribution.

### Feature Specifications
- **Advanced Medical Triage System**: AI-powered symptom checker with 50+ symptoms and a 5-level clinical triage system, emergency detection, and a comprehensive conditions database with clinical decision support.
- **Enhanced Hospital Search System**: Multi-parameter search by location, services, specialties, and emergency status, with professional hospital profiles and real-time filtering.
- **Professional-Grade Medication Database**: 15+ critical medications with complete clinical profiles, advanced drug categories, and clinical decision support.
- **Updated Emergency Protocols**: Over 30 comprehensive protocols based on 2025 medical standards from AHA, ATLS, and WHO.
- **System Architecture Enhancements**: Advanced TypeScript interfaces, component library integration, enhanced search algorithms, and real-time data processing.

### System Design Choices
- **Medical Accuracy**: Emphasizes 2025 guidelines from AHA, ATLS, WHO, CDC, and other authoritative sources for all protocols and medical information.
- **Data Standards**: Strict adherence to FDA-approved medications, verified hospital data, and evidence-based protocols.
- **Security & Privacy**: No storage of personal medical information, anonymized usage analytics, secure API endpoints, and HTTPS enforcement.
- **Quality Assurance**: Regular data verification, structured maintenance scheduling (weekly, monthly, quarterly), and continuous performance monitoring.

## External Dependencies
- **OpenAI**: For AI capabilities, integrated into the backend.
- **Google Maps API**: For hospital location mapping and related functionalities.
- **GitHub Pages**: Used for deployment of the static site.
- **Vercel**: For production deployments and performance optimization.
- **AHA (American Heart Association), ATLS (Advanced Trauma Life Support), WHO (World Health Organization), CDC (Centers for Disease Control)**: Authoritative sources for medical guidelines and protocol updates.