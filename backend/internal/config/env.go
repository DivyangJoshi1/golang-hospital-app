// internal/config/env.go
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads .env file in local development; skips silently in production
func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  Skipping .env load (likely running in production):", err)
	}
}

// GetEnv gets an environment variable or falls back to a default
func GetEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
