# Backend Project

This project is a simple backend application built with Node.js and Express, designed to connect to a PostgreSQL database. It includes a Dockerfile for easy deployment.

## Project Structure

```
backend-project
├── src
│   ├── server.js          # Entry point of the application
│   └── config
│       └── database.js    # Database connection configuration
├── .env                    # Environment variables
├── package.json            # npm configuration file
├── Dockerfile              # Dockerfile for building the application image
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd backend-project
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=3001
   ```

4. **Run the application:**
   ```
   npm start
   ```

5. **Test the database connection:**
   Open your browser and navigate to `http://localhost:3001/api/test-db` to check if the database connection is successful.

## Docker Instructions

To build and run the Docker image, follow these steps:

1. **Build the Docker image:**
   ```
   docker build -t your-image-name .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 3001:3001 --env-file .env your-image-name
   ```

## Usage

Once the server is running, you can access the API endpoints. The test database connection can be checked at `http://localhost:3001/api/test-db`.

## License

This project is licensed under the MIT License.