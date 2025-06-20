package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/config"
    "github.com/DivyangJoshi1/golang-hospital-app/internal/models"
)

// Create a new patient
func CreatePatient(c *gin.Context) {
    var input models.Patient

    // Bind JSON to struct
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // 🔍 Check for existing patient with same email or mobile
    var existing models.Patient
    if err := config.DB.Where("email = ? OR mobile = ?", input.Email, input.Mobile).First(&existing).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Patient already exists with given email or mobile"})
        return
    }

    // ✅ Create new patient
    if err := config.DB.Create(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create patient"})
        return
    }

    c.JSON(http.StatusCreated, input)
}


// Get all patients
func GetAllPatients(c *gin.Context) {
    var patients []models.Patient
    config.DB.Find(&patients)
    c.JSON(http.StatusOK, patients)
}

// Get patient by ID
func GetPatientByID(c *gin.Context) {
    id := c.Param("id")
    var patient models.Patient

    if err := config.DB.First(&patient, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
        return
    }

    c.JSON(http.StatusOK, patient)
}

// Update patient by ID
func UpdatePatient(c *gin.Context) {
    id := c.Param("id")
    var patient models.Patient

    if err := config.DB.First(&patient, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
        return
    }

    if err := c.ShouldBindJSON(&patient); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    config.DB.Save(&patient)
    c.JSON(http.StatusOK, patient)
}

// Delete patient by ID
func DeletePatient(c *gin.Context) {
    id := c.Param("id")

    // First check if patient exists
    var patient models.Patient
    if err := config.DB.First(&patient, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
        return
    }

    // Delete it
    if err := config.DB.Delete(&patient).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete patient"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Patient deleted"})
}
