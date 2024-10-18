
# InstaKillo

InstaKillo is a modern web application designed to streamline your social media interactions. Built with a Node.js backend and a React frontend, it offers seamless user authentication, media uploads, and a responsive user interface. The application leverages MongoDB for data storage and supports Docker for easy deployment.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User authentication with JWT tokens
- Upload and manage media files
- Responsive design for mobile and desktop
- Secure MongoDB connection with Docker
- Customizable user profiles

## Technologies

- **Frontend:** React,TailWind
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

To get a local copy of this project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YourUsername/InstaKillo.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd InstaKillo
   ```
3. **Set up MongoDB:**

   Create MongoDB database with the name 'mongoDb' and make sure connection is on port 27017

4. **Set up environment variables:**

   Create .env file ./Server Folder and set process.env.MONGODB_URL = "mongodb://localhost:27017/mongoDb" 
   Replace http://192.168.1.4:5000 with localhost:5173 in ./.env

5. **Run the application using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

6. **Access the application:**

   Open your web browser and go to `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend API.

## Usage

Once the application is running, you can register a new user and log in to access the main features. Follow the on-screen instructions to upload media files and manage your profile.

## API Documentation

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Log in a user
- **GET /api/user/profile** - Retrieve user profile
- **POST /api/posts** - Upload media files
- **POST /api/test** - test API is working

Refer to the API documentation within the project for more details on request and response formats.

## Deployment

For deployment on a production server, ensure that you have Docker and Docker Compose installed. Modify the `.env` file for your production MongoDB connection string, and run:

```bash
docker-compose up --build
```

## Contributing

Contributions are welcome! If you have suggestions for improvements, please open an issue or submit a pull request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For inquiries or feedback, please reach out to:

- Yashraj Chopra - [yashrajxchopra@gmail.com](mailto:yashrajxchopra@gmail.com)
- GitHub: [yashrajxchopra](https://github.com/yashrajxchopra)
