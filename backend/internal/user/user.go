package user

import (
	"sync"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

var (
	users      = make(map[int]*User)
	mu         sync.Mutex
	nextUserID = 1
)

// CreateUser creates a new user with a unique incremental ID and stores it
func CreateUser(name string) *User {
	mu.Lock()
	defer mu.Unlock()
	user := &User{
		ID:   nextUserID,
		Name: name,
	}
	users[nextUserID] = user
	nextUserID++
	return user
}

// GetUser returns a user by ID
func GetUser(id int) (*User, bool) {
	mu.Lock()
	user, ok := users[id]
	mu.Unlock()
	return user, ok
}
