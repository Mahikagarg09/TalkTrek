
# TalkTrek

This project aims to create a dynamic chat website.

## Technologies Used
- FrontEnd : React JS , Tailwind CSS , Vercel(deployment)
- Backend  : Firebase

## Features

- User Authentication
- Editable User Profile- display name and display photo
- Search a friend to chat with
- Chat with a person
- Delete chat messages 

## FrontEnd Development

### Register and Login Process
The application provides a secure way of user authentication.
User can create account with his basic detail or  signin using google/email.

### Chat Page
The left side of the page provides features such as-
-Clicking display photo provides option to change display name and display photo.
-Search a friend to chat with who as an account on TalkTrek
-Select a friend to chat with using text, images and emojis.
-Delete chat with a person.

## Backend Development

### Firebase Integration
Firebase is used for data storage and retrieval . User profiles and chats  are stored and managed within the Firebase database and storage.

## Deployment

The project is deployed using:
- Frontend: Vercel
- Backend: Firebase

#### Project Deployed Link: [Live Site](https://talk-trek-ten.vercel.app/)

## Routes Used

- **Signup Page:** `/register`
- **Login Page:** `/login`
- **Chat Page:** `/`

## How to Setup

Clone this repository
```bash
  git clone https://github.com/Mahikagarg09/TalkTrek

```
Navigate to the project directory
```bash
cd TalkTrek
```

Install dependencies
```bash
npm install
```

Configure environment variables for Firebase
```bash
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```

Start the server
```bash
npm start
```

## Deployment Instructions

### Vercel Deployment
- Create an account on vercel
- Import your GitHub repository
- Choose your branch (usually main)
- Deploy


## Contributors 
[Mahika Garg](https://github.com/Mahikagarg09)
