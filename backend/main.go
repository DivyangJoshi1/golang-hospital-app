package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/DivyangJoshi1/golang-hospital-app/internal/config"
	"github.com/DivyangJoshi1/golang-hospital-app/internal/models"
	"github.com/DivyangJoshi1/golang-hospital-app/internal/routes"
)

func main() {
	// Load .env
	// config.LoadEnv()

	// Connect to DB
	config.ConnectDB()

	// Auto-migrate models
	if err := config.DB.AutoMigrate(&models.User{}, &models.Patient{}); err != nil {
		log.Fatalf("❌ Auto-migration failed: %v", err)
	}

	// Gin Router
	r := gin.Default()

	// ✅ Use Gin-contrib CORS middleware properly
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ✅ Routes (must come AFTER cors setup)
	routes.AuthRoutes(r)
	routes.PatientRoutes(r)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "✅ DB Connected & Server Running"})
	})

	// Start server
	port := config.GetEnv("PORT", "8080")
	log.Println("🚀 Server is running on port", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
