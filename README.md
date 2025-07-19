
# 📝 BLOGI — Full-Stack Blogging Platform

![GitHub last commit](https://img.shields.io/github/last-commit/sachin00976/blog?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/sachin00976/blog?color=blue&style=flat-square)
![GitHub license](https://img.shields.io/github/license/sachin00976/blog?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/sachin00976/blog?style=flat-square)

> 🚀 A feature-rich full-stack blogging platform with markdown editor, real-time interaction, and Google OAuth — built using the MERN stack.

## 🌐 Live Demo

**[🔗 Click here to visit the live site](blog-orpin-ten.vercel.app)**  

---

## 📌 Features

- ✨ **Content Discovery**  
  Explore blogs based on engagement, and browse top authors.

- ✍️ **Blog Creation with Markdown**  
  Create and edit posts using a markdown-supported rich text editor with image upload via **Cloudinary**.

- 💬 **Real-time Comment System**  
  Add, edit, and delete comments with **Socket.IO** powered real-time sync across users.

- 👥 **Follow System**  
  Follow and unfollow authors to personalize your feed.

- 🔐 **Google OAuth 2.0 Authentication**  
  Secure and seamless login experience via Google.

---

## 🛠️ Tech Stack

### 🔗 Frontend
- **React.js** with **Redux** for state management
- **React Router** for routing
- **Axios** for HTTP requests
- **Tailwind CSS / Styled Components** 

### 🔧 Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** for image storage
- **Socket.IO** for real-time communication

### 🔐 Authentication
- **Google OAuth 2.0** using `passport-google-oauth20`

---

## 📸 Screenshots

<img width="1889" height="850" alt="image" src="https://github.com/user-attachments/assets/4179242c-7440-4f86-bcb9-c40be40539f2" />

<img width="1889" height="846" alt="image" src="https://github.com/user-attachments/assets/289272e2-6aa5-440b-a64b-2b6230ee0447" />

<img width="1889" height="858" alt="image" src="https://github.com/user-attachments/assets/4bd590b9-e16a-4f63-a313-8fe67d379221" />




---

## 🚀 Getting Started

### 🧰 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account
- Google Developer Console credentials (OAuth 2.0)

---

## 🔧 Environment Variables

### 📁 Server `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 📁 Client `.env`
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🏗️ Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/blogging-app.git
cd blogging-app
```

### Install Backend
```bash
cd server
npm install
npm run dev
```

### Install Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Feel free to fork the repo and make a pull request.

### Steps:
1. Fork this repository  
2. Create your feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a pull request

---

## 🙋‍♂️ Author

**Prakhar Garg** 
📧 prakhargarg1405@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/prakhar-garg-251659282/) • [GitHub](https://github.com/Prakhar-Garg7)

**Sachin Patel**  

---

## ⭐ Show Your Support

If you found this project useful, don’t forget to give it a ⭐ on [GitHub]([https://github.com/sachin00976/blog])!

---
