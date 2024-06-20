## Introduction

This project is divided into two main parts:
1. **Frontend** - A mobile application built with Expo.
2. **Backend** - A server-side application built with Node.js.

## Folder Structure
```
project-root/
├── app/
│ ├── assets/
│ ├── screens/
│ ├── node_modules/
│ ├── android/
│ ├── ios/
│ ├── App.js
│ ├── app.json
│ ├── package.json
│ └── ...
└── backend/
│ ├── App.js
│ ├── package.json
│ └── ...
```

## Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later)

## Installation

### Frontend

1. Navigate to the `app` directory:

    ```sh
    cd app
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

### Backend

1. Navigate to the `backend` directory:

    ```sh
    cd backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```
    
## Running the Project

### Frontend

1. Ensure you are in the `app` directory:

    ```sh
    cd app
    ```

2. Start the Expo development server:

    for android
    ```sh
    npx expo run:android
    ```
    after it runs press 'a'
   
    or for iOS

    ```sh
    npx expo run:ios
    ```
    after it runs press 'i'

4. Follow the instructions in the terminal to run the app on your device or emulator.

*Note: To generate fresh android and iOS folders run `npx expo prebuild --clean`*

### Backend

1. Ensure you are in the `backend` directory:

    ```sh
    cd backend
    ```

2. Start the Node.js server:

    ```sh
    node App.js
    ```

3. The server will start on `http://localhost:3000` by default.