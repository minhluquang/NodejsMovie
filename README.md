# 🎬 NodejsMovie

Backend source code for a movie web application that allows users to view trending movies (today/this week), browse popular TV series, check detailed information for movies/TV series including cast, images, videos, and view detailed actor profiles. Built with Node.js, Express, and MySQL.

## ✨ Features

- JWT Authentication for secure user login.
- Email Verification during user registration.
- Forgot Password functionality via email.
- Trending Movies: view today’s and this week’s trending movies.
- Popular TV Series: browse popular shows.
- Movie/TV Series Details: see cast, images, and videos.
- Actor Details: view detailed actor profiles.

## 🧰 Technologies Used

- **Backend:** Node.js with Express.
- **Security:** JWT Authentication.
- **Database:** MySQL.
- **Email Service:** Nodemailer.
- **API Style:** RESTful APIs.
- **Others:** npm, Git.

## 🏗️ Project Structure
```
src/
├── config/       # Configuration files 
├── controllers/  # REST API controllers
├── middlewares/  # Middleware functions 
├── models/       # Database models 
├── routers/      # Express route definitions
├── services/     # Business logic
├── templates/    # Email templates or view templates
├── server.js     # Entry point of the application
```

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/minhluquang/NodejsMovie

# Navigate to the project folder
cd NodejsMovie

# Install dependencies
npm install

# Start the development server
npm run start
```

## 📋 Prerequisites

- Node.js >= 18.18.0
- npm >= 9.8.1
- Modern browser (Chrome, Firefox, Edge, Safari)
- Recommended: Visual Studio Code
