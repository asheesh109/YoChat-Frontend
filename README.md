# YoChat Frontend 💬

A modern, responsive chat application frontend built with **React + Vite**. Features real-time messaging, user authentication, and a sleek UI deployed at [https://yoo-chats.web.app](https://yoo-chats.web.app).

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

## ✨ Features

### 👤 User Authentication
- **Secure Registration** - Create new accounts
- **Login System** - Email/password authentication
- **Profile Management** - Update user information
- **Session Persistence** - Stay logged in across sessions

### 💬 Chat Functionality
- **Real-time Messaging** - Instant message delivery
- **Group Chats** - Create and join group conversations
- **Direct Messages** - One-on-one private chats
- **Message History** - View past conversations
- **Typing Indicators** - See when others are typing
- **Online Status** - Real-time user availability

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all devices
- **Dark/Light Theme** - Toggle between themes
- **Emoji Support** - Express with emojis
- **File Sharing** - Share images and documents
- **Notifications** - Real-time message alerts
- **Clean Interface** - Intuitive and user-friendly

### 🔒 Security & Privacy
- **End-to-End Encryption** - Secure message transmission
- **Message Deletion** - Remove messages from both ends
- **Block Users** - Control who can contact you
- **Privacy Settings** - Customize visibility and permissions

## 🚀 Live Demo

🌐 **Live Application:** [https://yoo-chats.web.app](https://yoo-chats.web.app)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | Frontend framework |
| **Vite** | Build tool and dev server |
| **Firebase** | Hosting & Authentication |
| **Context API** | State management |
| **CSS Modules** | Component styling |
| **React Router** | Page navigation |

## 📦 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/asheesh109/YoChat-Frontend.git

# Navigate to project directory
cd YoChat-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application running locally.

## 🔧 Configuration

1. **Environment Setup**
```bash
# Create environment file
cp .env.example .env.local

# Add your Firebase configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

2. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Set up Firestore database
   - Add your web app to Firebase

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy
firebase deploy
```

### Alternative Hosting Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: `npm run build && npm run deploy`

## 🎯 Usage Guide

1. **Register** - Create a new account
2. **Login** - Access your chat dashboard
3. **Start Chatting** - Find users or create groups
4. **Customize** - Update your profile and settings
5. **Stay Connected** - Chat in real-time with anyone

## 📱 Supported Platforms
- ✅ Desktop Browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile Browsers (iOS Safari, Chrome Mobile)
- ✅ Tablet Devices
- ✅ Progressive Web App (PWA) ready

## 🤝 Contributing
We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to your fork
5. **Submit** a Pull Request

### Development Guidelines
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation accordingly

## 📞 Contact & Support

**Ashish Parab**  
📧 ashishparab03@gmail.com  
🔗 [Portfolio](https://devfolio-two-xi.vercel.app/)  
💼 [LinkedIn](https://www.linkedin.com/in/ashishparab03/)

### Getting Help
- Check existing issues on GitHub
- Review the project documentation
- Contact via email for urgent queries

## 🐛 Known Issues & Roadmap
- [ ] Add video calling feature
- [ ] Implement voice messages
- [ ] Add chat message reactions
- [ ] Improve mobile responsiveness

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- React team for the amazing framework
- Vite for the fast build tool
- Firebase for backend services
- All contributors and testers

---

**Built with ❤️ by Ashish Parab**  
*Stay connected with YoChat - Your go-to messaging platform*
