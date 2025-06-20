package config

import (
    "github.com/joho/godotenv"
    "log"
    "os"
)

// Loads the .env file
func LoadEnv() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
}

// Safe wrapper to get environment variables
func GetEnv(key string, fallback string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return fallback
}
