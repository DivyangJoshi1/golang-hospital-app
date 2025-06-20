package config

import (
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "log"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        GetEnv("DB_HOST", "localhost"),
        GetEnv("DB_USER", "postgres"),
        GetEnv("DB_PASSWORD", ""),
        GetEnv("DB_NAME", "hospital"),
        GetEnv("DB_PORT", "5432"),
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("❌ Failed to connect to database:", err)
    }

    log.Println("✅ Connected to PostgreSQL DB")
    DB = db
}
