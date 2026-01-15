# Taskify - Project Management System

Taskify is a full-featured task management system designed to help users organize their work efficiently. With a modern, responsive interface built using Next.js and ShadcnUI, and a robust backend powered by Node.js, Express, and GraphQL, Taskify offers a seamless experience for managing projects, tasks, and notes.

## 🚀 Features

-   **Project Management**: Create and manage multiple projects to group related tasks.
-   **Task Tracking**: Add, edit, and delete tasks with priorities, deadlines, and status updates (To Do, In Progress, Done).
-   **Notes Integration**: Create rich text notes and code snippets. Link notes directly to tasks for better context.
-   **Calendar View**: Visualize your deadlines and schedule with an integrated calendar view.
-   **Authentication**: Secure user authentication and authorization using JWT.
-   **Responsive Design**: A fully responsive UI that works perfectly on desktop, tablet, and mobile devices.
-   **Dark Mode**: Built-in dark mode support for better visual comfort.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: [ShadcnUI](https://ui.shadcn.com/)
-   **State Management & API**: Apollo Client (GraphQL)
-   **Icons**: Lucide React

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **API**: GraphQL (Apollo Server)
-   **Database**: MongoDB (via Mongoose)
-   **Authentication**: JSON Web Tokens (JWT)

## 📦 Installation

Prerequisites: Node.js (v18+) and MongoDB installed locally or a MongoDB Atlas URI.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/taskify.git
    cd taskify
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLIENT_URL=http://localhost:3000
    ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env.local` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/graphql
    ```

## 🏃‍♂️ Usage

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend will start at `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

3.  **Open your browser** and navigate to `http://localhost:3000` to start using Taskify!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
