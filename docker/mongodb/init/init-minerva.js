// MongoDB initialization script for Minerva application
// This script runs when MongoDB container starts for the first time

// Switch to the minerva database
db = db.getSiblingDB('minerva');

// Create collections with initial setup if needed
db.users.createIndex({ "email": 1 }, { unique: true });
db.resumes.createIndex({ "userId": 1 });

// Optional: Insert initial data
db.users.insertOne({
  email: 'admin@minerva.com',
  name: 'Admin User',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed for Minerva database');