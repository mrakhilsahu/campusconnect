# CampusConnect

CampusConnect is a full-stack MERN application for managing college events through a role-based workflow. It enables teachers to create events, admins to review and approve them, and students to browse, register, and participate in approved events.

## Features

- JWT Authentication and Authorization
- Role-based access (Student, Teacher, Admin)
- Event creation and approval workflow
- Student event registration
- Attendance management
- Protected routes
- College-based data isolation
- Responsive user interface

## Tech Stack

**Frontend**
- React
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
CampusConnect/
├── frontend/
├── backend/
└── README.md
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/CampusConnect.git
cd CampusConnect
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the project

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Workflow

```
Teacher
   ↓
Create Event
   ↓
Pending Approval
   ↓
Admin Review
   ↓
Approved
   ↓
Student Registration
   ↓
Attendance
```

## Future Improvements

- Certificate generation
- Email notifications
- Dashboard analytics
- Event categories
- Search and filter
- Seat capacity management

## License

This project is licensed under the MIT License.
