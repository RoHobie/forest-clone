package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	httpapi "backend/internal/http"
)

func main() {
	r := chi.NewRouter()
	r.Use(corsMiddleware)
	r.Use(middleware.Logger)

	r.Post("/room/create", httpapi.CreateRoomHandler)
	r.Post("/timer/start", httpapi.StartTimerHandler)
	r.Post("/timer/stop/{id}", httpapi.StopTimerHandler)
	r.Get("/timer/{id}", httpapi.GetTimerHandler)

	http.ListenAndServe(":8080", r)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
