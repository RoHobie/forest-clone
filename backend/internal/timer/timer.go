package timer

import (
	"sync"
	"time"
)

type Timer struct {
	ID        string    `json:"id"`
	Duration  int       `json:"duration"` // in minutes
	Status    string    `json:"status"`
	StartedAt time.Time `json:"startedAt"`
}

var (
	timers = make(map[string]Timer)
	mu     sync.Mutex
)

func AddTimer(t Timer) {
	mu.Lock()
	timers[t.ID] = t
	mu.Unlock()
}

func GetTimer(id string) (Timer, bool) {
	mu.Lock()
	t, ok := timers[id]
	mu.Unlock()
	return t, ok
}

func UpdateTimer(t Timer) {
	mu.Lock()
	timers[t.ID] = t
	mu.Unlock()
}
