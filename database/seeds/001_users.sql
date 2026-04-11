-- Password for all seeded users: "password123" (bcrypt hash)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@store.com', '$2a$12$LJ3m4ys3Gkl0TdGHbG9waeXbMfE1.fVLVqCEwPU1K5gJHbIQh0Hy2', 'admin'),
('John Doe', 'john@example.com', '$2a$12$LJ3m4ys3Gkl0TdGHbG9waeXbMfE1.fVLVqCEwPU1K5gJHbIQh0Hy2', 'customer'),
('Jane Smith', 'jane@example.com', '$2a$12$LJ3m4ys3Gkl0TdGHbG9waeXbMfE1.fVLVqCEwPU1K5gJHbIQh0Hy2', 'customer'),
('Bob Wilson', 'bob@example.com', '$2a$12$LJ3m4ys3Gkl0TdGHbG9waeXbMfE1.fVLVqCEwPU1K5gJHbIQh0Hy2', 'customer');
