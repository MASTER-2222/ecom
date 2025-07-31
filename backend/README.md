# RitKART Backend API

Spring Boot REST API for the RitKART e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- MongoDB running on localhost:27017
- Maven 3.6+

### Environment Setup
1. Copy `.env.example` to `.env`
2. Update environment variables as needed

### Running the Application

#### Development Mode
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Production Mode
```bash
./mvnw clean package
java -jar target/ritkart-backend-1.0.0.jar --spring.profiles.active=prod
```

## 📁 Project Structure

```
src/
├── main/java/com/ritkart/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── exception/      # Custom exceptions
│   ├── model/          # MongoDB entities
│   ├── repository/     # MongoDB repositories
│   ├── security/       # JWT security configuration
│   ├── service/        # Business logic
│   └── util/           # Utility classes
└── main/resources/
    ├── application.properties
    ├── application-dev.properties
    └── application-prod.properties
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ritkart` |
| `JWT_SECRET` | JWT signing secret | Required |
| `SERVER_PORT` | Server port | `8080` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

## 📊 API Documentation

Once the application is running, visit:
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- API Docs: http://localhost:8080/api/api-docs

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get JWT token
2. **Authorization Header**: `Bearer <token>`
3. **Token Expiration**: 24 hours (configurable)

## 🛡️ Security

- JWT-based authentication
- Role-based authorization (Admin/Customer)
- CORS configuration
- Input validation
- Secure password hashing

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/admin/users` - Get all users (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `GET /api/admin/orders` - Get all orders (Admin)

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run tests with coverage
./mvnw test jacoco:report
```

## 📦 Building

```bash
# Clean and build
./mvnw clean package

# Skip tests
./mvnw clean package -DskipTests
```

## 🐳 Docker Support

```bash
# Build Docker image
docker build -t ritkart-backend .

# Run with Docker
docker run -p 8080:8080 ritkart-backend
```

## 🔧 Development

### Hot Reload
Spring Boot DevTools is included for automatic restart during development.

### Database
MongoDB collections are automatically created. Sample data can be loaded using the data initialization scripts.

### Logging
- Development: DEBUG level
- Production: WARN level
- Custom loggers available for different components