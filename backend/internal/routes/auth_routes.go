package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/controllers"
)

func AuthRoutes(router *gin.Engine) {
    api := router.Group("/api")
    {
        api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register)
    }
}