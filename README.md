# Voting System Backend API

This is the backend API for the anonymous voting system built with Node.js, Express, and MongoDB.

## Features

- **POST /api/vote** - Submit a new vote
- **GET /api/votes** - Get all votes (admin)
- **GET /api/votes/summary** - Get voting statistics and summary
- **GET /api/votes/:id** - Get a specific vote by ID
- **DELETE /api/votes/:id** - Delete a specific vote (admin)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set up MongoDB

You have two options:

#### Option A: Local MongoDB
- Install MongoDB locally
- Make sure MongoDB is running on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string
- Update the `.env` file with your connection string

### 3. Configure Environment Variables

The `.env` file is already created. Update it with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voting_system
NODE_ENV=development
```

For MongoDB Atlas, replace the MONGODB_URI with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voting_system
```

### 4. Start the Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Submit Vote
- **URL:** `POST /api/vote`
- **Body:**
```json
{
  "userName": "John Doe",
  "votes": {
    "Employee of the Year": {
      "Sept": "Samuel",
      "Oct": "Elvis", 
      "Nov": "Cecilia"
    },
    "Team Spirit & Collaboration": {
      "Sept": "Favour",
      "Oct": "Gael",
      "Nov": "Love"
    },
    "Innovation & Initiative": {
      "Sept": "Eugene",
      "Oct": "Steph",
      "Nov": "Partemus"
    }
  }
}
```

### Get All Votes
- **URL:** `GET /api/votes`
- **Response:** List of all votes with metadata

### Get Voting Summary
- **URL:** `GET /api/votes/summary`
- **Response:** Statistics showing vote counts for each category, month, and nominee

### Get Specific Vote
- **URL:** `GET /api/votes/:id`
- **Response:** Single vote object

### Delete Vote
- **URL:** `DELETE /api/votes/:id`
- **Response:** Confirmation message

## Data Structure

The voting data is stored with the following schema:

```javascript
{
  userName: String,
  votes: {
    "Category Name": {
      "Month": "Nominee Name"
    }
  },
  submittedAt: Date,
  isAnonymous: Boolean
}
```

## Security Features

- CORS configured for frontend origin
- Input validation on all endpoints
- Prevents duplicate votes from same user
- Error handling middleware

## Testing the API

You can test the API using tools like:
- Postman
- curl commands
- The provided frontend React application

The frontend is already configured to connect to this backend at `http://localhost:5000`.