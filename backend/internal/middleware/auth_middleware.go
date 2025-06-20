package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "net/http"
    "os"
    "strings"
)

// ✅ Handles both "receptionist", "doctor", and "receptionist-doctor"
func AuthMiddleware(requiredRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")

        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
            c.Abort()
            return
        }

        // ✅ Remove Bearer prefix
        if strings.HasPrefix(tokenString, "Bearer ") {
            tokenString = strings.TrimPrefix(tokenString, "Bearer ")
        }

        // ✅ Parse token
        token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // ✅ Extract role
        claims := token.Claims.(*jwt.MapClaims)
        role := (*claims)["role"].(string)

        // ✅ Flexible role checking
        if requiredRole != "" && !roleAllowed(role, requiredRole) {
            c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
            c.Abort()
            return
        }

        // ✅ Set context
        c.Set("username", (*claims)["username"].(string))
        c.Set("role", role)

        c.Next()
    }
}

// ✅ Helper: allow multiple roles like "receptionist-doctor"
func roleAllowed(actual, required string) bool {
    if actual == required {
        return true
    }

    // Check if multi-role allowed
    if required == "receptionist-doctor" && (actual == "receptionist" || actual == "doctor") {
        return true
    }

    return false
}
