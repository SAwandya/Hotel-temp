# Hotel Booking Application

A full-stack hotel booking application built with React, Node.js, Express, and MongoDB. The application allows users to search for hotels, view room details, make bookings, and process payments. Hotel owners can manage their properties, rooms, and view booking details.

## Features

- User authentication via Clerk
- Hotel and room management
- Room booking system
- Search functionality with filters
- Payment processing
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**:

  - React
  - Tailwind CSS
  - React Router
  - Clerk for authentication
  - Axios for API requests

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Cloudinary for image storage

## Installation

### Prerequisites

- Node.js
- MongoDB
- Clerk account
- Cloudinary account

### Setup

1. Clone the repository

   ```
   git clone <repository-url>
   cd hotel-bookings
   ```

2. Install dependencies for both client and server

   ```
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Create `.env` file in the server directory with the following variables

   ```
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Create `.env` file in the client directory with the following variables

   ```
   VITE_BACKEND_URL=http://localhost:3000
   VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   ```

5. Start the server

   ```
   cd server
   npm run dev
   ```

6. Start the client
   ```
   cd client
   npm run dev
   ```

## License

This project is licensed under the MIT License.

## Acknowledgments

This project uses code elements from various open-source repositories, including:

- UI components and patterns inspired by community projects
- Select dropdown code pattern from https://github.com/Aldrin1807/WorkWise/
- SVG icons and close button implementation inspired by various open-source UI libraries

Thank you to all the developers who share their code and knowledge.
