# CampusConnect

CampusConnect is a centralized student collaboration platform designed to help university students connect, organize, and participate in structured study groups. It provides a streamlined environment for discovering peers, scheduling sessions, and communicating effectively within academic communities.

---


🚀 **Live Demo:** [Click here to use CampusConnect](https://campusconnect-737k.vercel.app)

##  Motivation

In large university environments, students often struggle to form meaningful academic connections. Traditional methods like group chats, social media posts, or messaging apps are unstructured and lack visibility.

This leads to:
- Difficulty finding study partners  
- Poor coordination of study sessions  
- Fragmented communication  

CampusConnect solves this by offering a unified and structured system for academic collaboration.

---

##  Key Features

-  Course-based group discovery  
-  Create and manage study groups  
-  Schedule, reschedule, and cancel study sessions  
-  Support for virtual and in-person sessions  
-  Group chat with real-time updates  
-  File sharing within group chats  
-  Attendance tracking for sessions  
-  Upcoming session reminders on dashboard  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Atlas / Local)

### Other Tools
- Git & GitHub
- Postman (API testing)

---

## ⚙️ Installation & Setup

### 📌 Prerequisites

- Node.js (v18+)
- npm
- Git
- MongoDB (local or Atlas)
- VS Code (recommended)

---

### Environment Variables

Create a `.env` file in the backend directory using the template provided:

```
.env.example
```
 
Fill in required values such as:

```
MONGO_URI=your_database_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend typically runs on:

```
http://localhost:5173
```

Backend typically runs on:

```
http://localhost:5000
```


---

##  Authentication

CampusConnect uses **JWT (JSON Web Tokens)** for secure authentication:

- Login returns a token  
- Token is stored in the browser (localStorage)  
- Protected routes require a valid token  

---

## 🔗 API Overview

###  Users
- Register / Login  
- Update profile  
- Change username / password  

###  Groups
- Create / Join / Leave groups  
- Search groups using filters  

###  Sessions
- Create study sessions  
- Reschedule / cancel sessions  
- Mark attendance  

###  Chat
- Send messages  
- View recent messages  
- Delete own messages  

###  Files
- Upload files  
- Download files  
- Share resources within groups  
