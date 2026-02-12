import "@testing-library/jest-dom";

// Mock environment variables for testing
process.env.AUTH_URL = "http://localhost:3000/api/auth";
process.env.POSTGRES_URL = "postgresql://test:test@localhost/test";
