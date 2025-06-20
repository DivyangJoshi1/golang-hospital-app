package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/controllers"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/middleware"
)

func PatientRoutes(r *gin.Engine) {
    api := r.Group("/api/patients")

    // ✅ Shared access: any logged-in user (doctor or receptionist)
    api.GET("", middleware.AuthMiddleware(""), controllers.GetAllPatients)
    api.GET("/", middleware.AuthMiddleware(""), controllers.GetAllPatients)
    api.GET("/:id", middleware.AuthMiddleware(""), controllers.GetPatientByID)

    // ✅ Create & delete: only receptionists
    api.POST("/", middleware.AuthMiddleware("receptionist"), controllers.CreatePatient)
    api.DELETE("/:id", middleware.AuthMiddleware("receptionist"), controllers.DeletePatient)

    // ✅ Update: both doctor and receptionist can update
    api.PUT("/:id", middleware.AuthMiddleware("receptionist-doctor"), controllers.UpdatePatient)
}
