# StudySphere

StudySphere is a centralized campus study platform designed specifically for York University students. It enables students to discover, create, and manage structured study groups organized by course and program.

## Motivation

Large university courses often make it difficult for students to build meaningful academic connections. Many students attend lectures without forming study partnerships, leading to academic isolation, scheduling conflicts, and fragmented communication.

Currently, students rely on scattered platforms such as messaging apps, social media posts, or informal group chats to coordinate study sessions. These solutions lack structure, visibility, and course-specific organization.

StudySphere addresses this gap by providing:

- Course-based study group discovery
- Structured study session scheduling with cancel and reschedule support
- Virtual and in-person filtering with virtual meeting links
- Group communication spaces via group chat
- File sharing within group chats
- Attendance marking for scheduled study sessions
- Upcoming session reminders on the dashboard

The goal of StudySphere is to reduce academic isolation and provide a reliable, centralized system for academic collaboration.

## Installation

### Required Tools

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git
- MongoDB (local installation or MongoDB Atlas)
- Code editor (VS Code recommended)

### Clone Repository

```
git clone https://github.com/EECS3311W26/StudySphere
cd StudySphere
```

### Backend Setup

```
cd backend
npm install
npm run dev
```

Ensure MongoDB is running locally or update your environment variables to connect to MongoDB Atlas.

### Environment Variables

Create a `.env` file in the backend directory using the template provided:

```
.env.example
```
 
Fill in required values such as:

```
MONGO_URI=your_database_connection_string
PORT=2222
JWT_SECRET=your_jwt_secret_key
```

### Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend typically runs on:

```
http://localhost:5173
```

Backend typically runs on:

```
http://localhost:2222
```

## Contribution

We follow an Agile workflow aligned with Scrum principles.

### Branching Strategy

- **main** — Stable production-ready branch. Only tested releases are merged here.
- **dev_build** — Integration branch where completed features are merged and tested before being promoted to main.
- **feature/\<feature-name\>** — Used for implementing new features.
- **bugfix/\<issue-name\>** — Used for resolving defects.

### Development Workflow

1. Create a feature branch from `dev_build`.
2. Implement the feature according to its user story and acceptance criteria.
3. Commit changes with clear and descriptive messages beginning with the Trello ticket number (e.g. `PB-23: Add group chat backend`).
4. Push the branch to GitHub.
5. Open a Pull Request into `dev_build`.
6. At least one team member reviews and approves the PR.
7. After successful integration testing, `dev_build` is merged into `main`.

### Issue & Task Tracking

- All user stories are tracked on Trello.
- Each story follows the format:
  > As a [user], I want [feature], so that [benefit].
- Acceptance criteria must be satisfied before marking a task as complete.
- Trello is updated regularly to reflect sprint progress.

## Project Structure

```
StudySphere/
│
├── frontend/                   # Client-Side (React)
│   └── src/
│       ├── App.jsx
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── GroupDetail.jsx
│       ├── GroupChat.jsx        # Added Sprint 3
│       ├── Profile.jsx
│       ├── Toast.jsx
│       ├── TopbarGlobe.jsx
│       ├── LanyardBadge.jsx
│       └── CursorSpotlight.jsx
│
├── backend/                    # Server-Side (Node.js + Express)
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── group.controller.js
│   │   ├── session.controller.js
│   │   ├── course.controller.js
│   │   ├── message.controller.js   # Added Sprint 3
│   │   └── file.controller.js      # Added Sprint 3
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js               # Added Sprint 3 (multer)
│   ├── models/
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── sessions.js
│   │   ├── courses.js
│   │   ├── message.js              # Added Sprint 3
│   │   └── files.js                # Added Sprint 3
│   ├── routes/
│   │   ├── user.route.js
│   │   ├── group.route.js
│   │   ├── session.route.js
│   │   ├── course.route.js
│   │   ├── message.route.js        # Added Sprint 3
│   │   └── file.route.js           # Added Sprint 3
│   └── server.js
│
├── doc/                        # Sprint documentation
│   ├── sprint1/
│   ├── sprint2/
│   └── sprint3/
│
└── README.md
```

## API Documentation

### User Endpoints — /api/users

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| POST | /api/users | Register a new user (signup) | { username, password } |
| POST | /api/users/login | Login an existing user — returns JWT token | { username, password } |
| GET | /api/users | Get all usernames | None |
| GET | /api/users/:id | Get a user by ID | None |
| PATCH | /api/users/:id | Update user profile (courses, year of study) | { courses, yearOfStudy } |
| PATCH | /api/users/username | Update username | { UID, username } |
| PATCH | /api/users/password | Update password | { UID, password } |
| DELETE | /api/users/:id | Delete a user by ID | None |

### Group Endpoints — /api/groups

| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| GET | /api/groups | Get all groups | None |
| GET | /api/groups/search | Search groups by filters | ?courseCode=&department=&mode= |
| GET | /api/groups/getGroup/:id | Get a group by ID | None |
| POST | /api/groups/create | Create a new study group | { title, courseCode, department, mode, location, leader } |
| POST | /api/groups/:groupId/join | Join an existing group | { userId } |
| DELETE | /api/groups/:groupId/leave | Leave a group (members only, leader cannot leave) | { userId } |

### Session Endpoints — /api/sessions

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| POST | /api/sessions/create | Create a new study session (leader only) | { title, date, time, location, mode, groupId, createdBy, virtualLink } |
| GET | /api/sessions/:groupId | Get all sessions for a group | None |
| GET | /api/sessions/upcoming/:userId | Get next upcoming session for a user | None |
| PATCH | /api/sessions/:sessionId/reschedule | Reschedule a session (leader only) | { date, time } |
| DELETE | /api/sessions/:sessionId/cancel | Cancel a session (leader only) | None |
| POST | /api/sessions/:sessionId/attend | Mark attendance for a session | { userId } |
| DELETE | /api/sessions/:sessionId/attend | Unmark attendance for a session | { userId } |

### Course Endpoints — /api/courses

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| GET | /api/courses/courseInfo/:id | Get course info by ID | None |

### Message Endpoints — /api/messages *(Added Sprint 3)*

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| GET | /api/messages/:groupId | Get last 50 messages for a group | None (JWT required) |
| POST | /api/messages | Send a new message to a group | { groupId, content } (JWT required) |
| DELETE | /api/messages/:messageId | Delete your own message | None (JWT required) |

### File Endpoints — /api/files *(Added Sprint 3)*

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| POST | /api/files/upload | Upload a file to a group chat | multipart/form-data (JWT required) |
| GET | /api/files/:filename | Download a file | None (JWT required) |
| DELETE | /api/files/:fileId | Delete a file | None (JWT required) |

## Frontend Components

### App.jsx

Main root component. Manages all global state including:

- `currentUser` — stores logged in user's MongoDB _id
- `currentUsername` — stores logged in user's username
- `token` — stores JWT token from localStorage
- `searchResults` — stores groups returned from search
- `searchCourseCode`, `searchDepartment`, `searchMode` — search filter values
- `title`, `courseCode`, `department`, `mode`, `location` — create group form values
- `selectedGroup` — stores the group currently being viewed in detail
- `myGroups` — stores all groups the current user has joined

Handles page routing — shows Login page if no user logged in, GroupDetail if a group is selected, Dashboard after successful login.

Functions:

- `createUser()` — calls POST /api/users to register
- `loginUserFunc()` — calls POST /api/users/login to authenticate and store JWT
- `createGroup()` — calls POST /api/groups/create to create a new group
- `searchGroups()` — calls GET /api/groups/search with filters
- `joinGroup(groupId)` — calls POST /api/groups/:groupId/join
- `getMyGroups()` — fetches all groups the current user belongs to
- `getUsers()` — calls GET /api/users to fetch all usernames

### Login.jsx

Displays Sign Up and Login forms.
Receives all state and handler functions as props from App.jsx.
Shows success or error messages after each form submission.

### Dashboard.jsx

Main page shown after login. Contains:

- **Logout button** — clears localStorage and redirects to login *(Added Sprint 3)*
- **Next Session panel** — displays the user's next upcoming study session with title, date, time, and location *(Added Sprint 3)*
- **Create Group form** — allows logged in user to create a new study group with title, course code, department, mode, and campus/location
- **Search filters** — course code input, department dropdown, mode dropdown (Virtual / In Person)
- **Search button** — triggers searchGroups() in App.jsx
- **Results table** — displays matching groups with group name, course, department, mode, campus, and Join/View actions
- **Join button** — triggers joinGroup(groupId)
- **View button** — navigates to GroupDetail page for that group
- **My Groups panel** — displays all groups the current user has joined with group name and course code

### GroupDetail.jsx

Shown when a user clicks View on a group. Displays:

- Group info — course code, department, mode, location, member count
- Member list with avatars
- Leader/member status badge
- **Leave Group button** — visible to members only, leader cannot leave *(Added Sprint 3)*
- **Scheduled Sessions table** — shows all sessions (title, date, time, location, virtual link, Going count)
- **Join/Leave Session buttons** — members can mark attendance per session *(Added Sprint 3)*
- **Cancel/Reschedule buttons** — only visible to the group leader *(Added Sprint 3)*
- **Virtual meeting link** — shown as a clickable link for virtual sessions *(Added Sprint 3)*
- **+ Create Session button** — only visible to the group leader, opens the Create Session form
- **Create Session form** — title, date (calendar picker), time, virtual link / location, campus dropdown
- **Group Chat section** — visible to members and leader only, non-members see a locked message *(Added Sprint 3)*
- **Back button** — returns to Dashboard

### GroupChat.jsx *(Added Sprint 3)*

Group chat component rendered inside GroupDetail below Scheduled Sessions. Features:

- Loads last 50 messages on page open via GET /api/messages/:groupId
- Polls every 5 seconds to refresh and show new messages from other members
- Logged-in user's messages shown on the right in red bubbles
- Other members' messages shown on the left with sender name and avatar initial
- Timestamp shown under each message
- Send button and Enter key support for sending messages
- Delete button shown on user's own messages only
- Add File button for uploading files to the chat
- Auto-scrolls to the latest message
- Only accessible to group members and the leader

### Profile.jsx

User profile page. Allows the logged in user to:

- View their York University student card with username and member status
- View activity stats — groups joined and courses enrolled
- Add or remove courses
- Update year of study
- Update username *(Added Sprint 3)*
- Update password *(Added Sprint 3)*

### Toast.jsx

Notification toast component. Displays success, error, and info messages across all pages.

### TopbarGlobe.jsx

Global top navigation component. Displays the StudySphere logo, Profile button, username, and Logout button *(Added Sprint 3)*.

## Sprint History

| Sprint | Duration | Key Features Delivered |
|---|---|---|
| Sprint 1 | Feb 23 – Mar 9, 2026 | User registration, login, search groups, create group, join group |
| Sprint 2 | Mar 9 – Mar 23, 2026 | JWT authentication, session scheduling, My Groups, profile update, UI polish |
| Sprint 3 | Mar 23 – Apr 6, 2026 | Group chat, file sharing, cancel/reschedule sessions, attendance marking, upcoming session, virtual links, logout, leave group, update username/password |
