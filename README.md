# Technical Assestment ST Engineering (https://github.com/tqwdan82/Technical_Assessment)

## Description
A React website using Typescript, NodeJS (express) web backend in Typescript, and MongoDB as the database.

### What has been done
- **Data Uploading:** Upload a CSV file (with proper handling) to the database with the upload feedback.
- **Data view/list:** List the data with pagination.
- **Search Data:** Added search functionality to filter data based on selected fields and queries.
- **Testing for backend:** Unit tests for the backend logic.

### What has not been done
- **Testing for frontend:** Unit tests for the frontend.

## Installation & Setup

Follow the steps below to get the project running locally.

### Option 1: Using Docker

1. Clone or download this repository to your local machine.
2. Navigate to the project root directory in your terminal.
3. Run the following command to build and start the containers:

   ```bash
   docker compose up --build
4. You should be able to check the app on the 'http://localhost:5173/'.
   
### Option 2: Using npm
1. Clone or download this repository to your local machine.
2. Open two terminal (one that runs on the server directory 'cd server' and one that runs on the client directory 'cd client').
3. Run the following command to build and start the containers:

   ```bash
   npm run dev
4. You should be able to check the app on the 'http://localhost:5173/'./'.                                                                      


### Prerequisites
1. Download the needed dependency/library in the package.json. (npm install)
