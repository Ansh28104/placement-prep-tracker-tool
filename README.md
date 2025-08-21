# Placement Tracker - MERN Stack

A comprehensive placement preparation tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Secure login/register with JWT tokens
- **Dashboard**: Overview of all placement preparation activities
- **Job Applications**: Track applications, status, and deadlines
- **Coding Practice**: Log coding problems from various platforms
- **Aptitude Preparation**: Track quantitative, logical, and verbal tests
- **Resume Management**: Manage multiple resume versions and feedback
- **Interview Tracking**: Schedule and track interview progress
- **Goals & Targets**: Set and monitor preparation goals
- **Resources**: Curated learning resources
- **Rewards System**: Points and achievements for motivation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd placement-tracker-mern
\`\`\`

2. Install backend dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the root directory:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
\`\`\`

4. Start MongoDB service (if running locally)

5. Start the backend server:
\`\`\`bash
npm run server
\`\`\`

### Frontend Setup

1. Navigate to the client directory:
\`\`\`bash
cd client
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the React development server:
\`\`\`bash
npm start
\`\`\`

### Full Stack Development

To run both backend and frontend concurrently:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/add-points` - Add points to user

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats` - Get application statistics

### Coding Problems
- `GET /api/coding` - Get coding problems
- `POST /api/coding` - Add new problem
- `PUT /api/coding/:id` - Update problem
- `DELETE /api/coding/:id` - Delete problem
- `GET /api/coding/stats` - Get coding statistics

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/upcoming` - Get upcoming events

## Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  points: Number,
  level: Number,
  streak: Number,
  achievements: [Object],
  preferences: Object
}
\`\`\`

### Application Model
\`\`\`javascript
{
  user: ObjectId,
  company: String,
  position: String,
  location: String,
  status: Enum,
  appliedDate: Date,
  deadline: Date,
  notes: String
}
\`\`\`

### CodingProblem Model
\`\`\`javascript
{
  user: ObjectId,
  title: String,
  platform: String,
  difficulty: Enum,
  category: String,
  status: Enum,
  timeSpent: Number,
  solvedDate: Date
}
\`\`\`

## Deployment

### Backend Deployment (Heroku)

1. Create a Heroku app:
\`\`\`bash
heroku create your-app-name
\`\`\`

2. Set environment variables:
\`\`\`bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
\`\`\`

3. Deploy:
\`\`\`bash
git push heroku main
\`\`\`

### Frontend Deployment (Netlify/Vercel)

1. Build the React app:
\`\`\`bash
cd client
npm run build
\`\`\`

2. Deploy the `build` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.
