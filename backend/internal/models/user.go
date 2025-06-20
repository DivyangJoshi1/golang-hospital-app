package models

import (
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    Username string `gorm:"unique;not null"`
    Password string `gorm:"not null"`
    Role     string `gorm:"type:varchar(20);not null"` // receptionist or doctor
}

// HashPassword hashes the provided plaintext password and stores it in the User struct.
func (u *User) HashPassword(password string) error {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    if err != nil {
        return err
    }
    u.Password = string(bytes)
    return nil
}

