package models

import "gorm.io/gorm"

type Patient struct {
    gorm.Model
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
    Age       int    `json:"age"`
    Gender    string `json:"gender"`
    Address   string `json:"address"`
    Mobile    string `json:"mobile"`
    Email     string `json:"email"`
}
