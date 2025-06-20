package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "net/http"
    "os"
    "strings"
)

// AuthMiddleware handles token validation and role-based access control
func AuthMiddleware(requiredRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")

        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
            c.Abort()
            return
        }

        if strings.HasPrefix(tokenString, "Bearer ") {
            tokenString = strings.TrimPrefix(tokenString, "Bearer ")
        }

        token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        claims := token.Claims.(*jwt.MapClaims)
        role := (*claims)["role"].(string)

        if requiredRole != "" && !roleAllowed(role, requiredRole) {
            c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
            c.Abort()
            return
        }

        c.Set("username", (*claims)["username"].(string))
        c.Set("role", role)

        c.Next()
    }
}

func roleAllowed(actual, required string) bool {
    if actual == required {
        return true
    }

    if required == "receptionist-doctor" && (actual == "receptionist" || actual == "doctor") {
        return true
    }

    return false
}
