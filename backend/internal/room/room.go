package room

import (
	"math/rand"
	"sync"
	"time"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func init() {
	rand.Seed(time.Now().UnixNano())
}

type Room struct {
	ID string
	// needs more fields later
}

var (
	rooms = make(map[string]*Room)
	mu    sync.Mutex
)

func generateRoomID() string {
	b := make([]byte, 6)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

func CreateRoom() *Room {
	mu.Lock()
	defer mu.Unlock()
	var id string
	for {
		id = generateRoomID()
		if _, exists := rooms[id]; !exists {
			break
		}
	}
	r := &Room{ID: id}
	rooms[id] = r
	return r
}

// GetRoom returns a room by ID
func GetRoom(id string) (*Room, bool) {
	mu.Lock()
	r, ok := rooms[id]
	mu.Unlock()
	return r, ok
}
