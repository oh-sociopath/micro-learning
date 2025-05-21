# Project Name

🚀 A brief 1-2 line description of your project.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/) (v20.10+ recommended)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- Available ports: `3000` (app) and `5432` (PostgreSQL)

---

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
```


### 3. Start Docker containers
```bash
docker compose up --build
```

_This will:_

* Spin up a PostgreSQL database (port 5432)
* Start your application server (port 3000)


### 4. Run database migrations
In a new terminal tab/window:
```bash
docker compose exec app npx prisma migrate dev --name init
```
(Replace init with your migration name)

### 🌟 Running the Application
After successful setup:

Access the app at: http://localhost:3000

PostgreSQL will be available at localhost:5432

### Postman
you can import postman collection from `/postman-collection` directory from root of the project
