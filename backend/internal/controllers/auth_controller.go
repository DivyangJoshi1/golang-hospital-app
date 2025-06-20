package controllers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"

    "github.com/DivyangJoshi1/golang-hospital-app/internal/config"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/models"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/utils"
)

func Login(c *gin.Context) {
    var input struct {
        Username string `json:"username" binding:"required"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    var user models.User
    if err := config.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
        return
    }

    token, err := utils.GenerateToken(user.Username, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Login successful",
        "token":   token,
        "role":    user.Role,
    })
}

func Register(c *gin.Context) {
    var input struct {
        Username string `json:"username" binding:"required"`
        Password string `json:"password" binding:"required"`
        Role     string `json:"role" binding:"required,oneof=doctor receptionist"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    var existing models.User
    if err := config.DB.Where("username = ?", input.Username).First(&existing).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
        return
    }

    newUser := models.User{
        Username: input.Username,
        Role:     input.Role,
    }

    if err := newUser.HashPassword(input.Password); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    if err := config.DB.Create(&newUser).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}
