# 🎾 MatchPoint - Sports Facility Booking Platform

MatchPoint is a modern web application that simplifies the process of booking sports facilities. Built with React and Firebase, it provides a seamless experience for users to discover, book, and manage their sports venue reservations.

## ✨ Features

- **User Authentication** 
  - Secure login and signup
  - JWT-based authentication
  - Protected routes

- **Dashboard**
  - Personalized welcome screen
  - Quick booking actions
  - Upcoming reservations
  - Popular facilities overview

- **Facility Management**
  - Browse various sports facilities
  - Real-time availability checking
  - Detailed facility information
  - Price and rating display

- **Booking System**
  - Easy slot selection
  - Real-time booking confirmation
  - Booking history
  - Status tracking

## 🚀 Tech Stack

- **Frontend**
  - React.js
  - React Router v6
  - Axios for API calls
  - HeroIcons for UI icons
  - Custom CSS for styling

- **Backend**
  - Flask (Python)
  - MongoDB for database
  - JWT for authentication
  - CORS handling

- **Deployment**
  - Firebase Hosting
  - GitHub Actions for CI/CD
  - Environment variable management

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/matchpoint.git
cd matchpoint
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm start
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Firebase Hosting
3. Configure Firebase authentication
4. Update Firebase configuration in `src/firebase/config.js`

### Backend Setup

1. Install Python dependencies
2. Configure MongoDB connection
3. Set up environment variables
4. Start the Flask server

## 📱 Screenshots

![image](https://github.com/user-attachments/assets/3690080c-08de-4e16-af15-1660036ecef1)
![image](https://github.com/user-attachments/assets/96d7c9c5-e0ca-44eb-8824-41f1af541302)
![image](https://github.com/user-attachments/assets/5949a7a6-f31a-4306-ae45-bb3ae4804cc1)



## 🚀 Deployment

The application is deployed using Firebase Hosting. To deploy:

```bash
npm run deploy
```

This will:
1. Build the production version
2. Deploy to Firebase hosting
3. Make the app available at your Firebase URL

## 🔒 Environment Variables

Required environment variables:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- HeroIcons for the beautiful icons
- React team for the amazing framework
- Firebase team for the hosting and authentication services

## 📞 Support

For support, email ujjainsriganesh@gmail.com or create an issue in the repository.

## 🔮 Future Features

- [ ] Mobile application
- [ ] Payment integration
- [ ] Real-time chat support
- [ ] Facility owner dashboard
- [ ] Advanced booking analytics
- [ ] Social sharing features

## 🌟 Show your support

Give a ⭐️ if this project helped you!
