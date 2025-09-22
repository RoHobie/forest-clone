package httpapi

import (
	"encoding/json"
	"net/http"
	"time"

	"backend/internal/room"
	"backend/internal/timer"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func CreateRoomHandler(w http.ResponseWriter, r *http.Request) {
	roomObj := room.CreateRoom()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"roomId": roomObj.ID})
}

func StartTimerHandler(w http.ResponseWriter, r *http.Request) {
	type reqBody struct {
		Duration int `json:"duration"`
	}
	var body reqBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	id := uuid.New().String()
	t := timer.Timer{
		ID:        id,
		Duration:  body.Duration,
		Status:    "running",
		StartedAt: time.Now(),
	}
	timer.AddTimer(t)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}

func StopTimerHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	t, ok := timer.GetTimer(id)
	if ok {
		t.Status = "stopped"
		timer.UpdateTimer(t)
	}
	if !ok {
		http.Error(w, "timer not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(t)
}

func GetTimerHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	t, ok := timer.GetTimer(id)
	if !ok {
		http.Error(w, "timer not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(t)
}
