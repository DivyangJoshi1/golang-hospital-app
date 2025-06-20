// internal/config/env.go
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from a .env file in development.
// It skips loading in production if the file is missing.
func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  .env file not found or skipped in production:", err)
	}
}

// GetEnv retrieves the value of the environment variable named by the key.
// If the variable is not present, it returns the fallback value.
func GetEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
