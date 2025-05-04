# 🧠 TokriTrack – Impulse Spend + Budget Tracker

TokriTrack is a smart budgeting and wishlist tracker app designed to help users manage their expenses and control impulse spending. Built with **React**, **Firebase**, **Tailwind CSS**, and **Chart.js**.

---

## 🔥 Features

- 🔐 **Google Sign-In** (Firebase Auth)
- 💸 **Expense Management** with category, tag, and amount
- 🎯 **Wishlist Tracker** with urgency levels and review reminder
- 📊 **Interactive Charts** using Chart.js (Pie & Bar)
- 📆 **Month Selector + Recurring Budgets**
- 🔍 **Search + Filters** (by title, category, urgency)
- 📤 **Export Data** to CSV / PDF
- 🌗 **Dark Mode Support**
- 📱 **Responsive Design with Mobile Drawer Nav**
- ⚡ **PWA Ready** – Installable on phones/tablets
- ☁️ **Cloud Firestore Sync** – per user

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Charts**: Chart.js
- **Auth & DB**: Firebase Auth + Firestore
- **PDF Export**: html2pdf.js
- **CSV Export**: Blob + custom logic

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/tokritrack.git
cd tokritrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

Create a Firebase project and get your config from:

`Project Settings → General → Your apps → Firebase SDK snippet`

Then replace in:

```js
// src/utils/firebaseConfig.js
export const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  ...
};
```

### 4. Run the app

```bash
npm run dev
```

---

## 🌐 Deployment

You can deploy on:

- [Vercel](https://vercel.com/) – Easiest for React/Vite apps
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## 📸 Screenshots

| Dashboard 📊 | Wishlist 🧾 | Budget 💰 |
|--------------|-------------|----------|
| ![Home](screenshots/home.png) | ![Wishlist](screenshots/wishlist.png) | ![Budget](screenshots/budget.png) |

---

## 📜 License

MIT

---

## ✨ Author

Made with ❤️ by [Burhan Khan](https://github.com/yourusername)
