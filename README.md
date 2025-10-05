# 🚀CODEFUSE

A real-time collaborative code editor with AI assistance, code execution, and multi-language support built with React and Vite.

## ✨ Features

- **Real-time Collaborative Editing** - Multiple users can edit code simultaneously
- **Multi-language Support** - Support for 10+ programming languages (JavaScript, Python, Java, C++, Go, PHP, Rust, SQL, etc.)
- **AI Code Assistant** - Powered by Google Gemini AI for code help, review, and documentation
- **Code Execution** - Run and test code in multiple languages via Judge0 API
- **User Authentication** - Secure authentication with Clerk
- **Trial System** - 7-day free trial for premium features
- **Modern UI** - Beautiful interface with Framer Motion/GSAP animations
- **Syntax Highlighting** - Advanced CodeMirror editor with multiple themes
- **Development Mode** - Special HTML/CSS/JS live preview mode

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 6.2
- **Authentication:** Clerk
- **Editor:** CodeMirror 6 with 10+ language support
- **Real-time:** Socket.io Client
- **AI Integration:** Google Gemini AI
- **Code Execution:** Judge0 API via RapidAPI
- **Animations:** Framer Motion + GSAP
- **Styling:** CSS3 + React Icons
- **HTTP Client:** Axios


## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── assets/             # Static assets
├── Actions.js          # Socket.io action constants
├── Socket.js           # Socket connection setup
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🔗 API Integration

The frontend communicates with the backend via:
- **REST API** - User management, trial system, code execution
- **Socket.io** - Real-time collaboration, code sync, AI responses
- **Judge0 API** - Multi-language code execution and testing

## 🎨 Customization

### Themes
- CodeMirror themes: GitHub, VS Code, One Dark
- Responsive design for all screen sizes

### Supported Languages
Currently supported programming languages:
- JavaScript, Python, Java, C++, C, C#
- Go, Rust, PHP, Scala, Kotlin, SQL
- HTML/CSS/JS (Development mode)

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact: [virdimandeep2001@gmail.com]

## 🔗 Links
- [Live Demo](https://codefuse-front-end.onrender.com/)

---

Built with ❤️ by Mandeep Singh Virdi
