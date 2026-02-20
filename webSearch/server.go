package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/playwright-community/playwright-go"
)

func search(w http.ResponseWriter, r *http.Request, browser playwright.Browser) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	url := r.URL.Query().Get("url")
	fmt.Println("Received URL:", url)
	if url == "" {
		http.Error(w, "Missing query parameter 'url'", http.StatusBadRequest)
		fmt.Println("Missing query parameter 'url'")
		return
	}

	html, err := fetcher(browser, url)
	if err != nil {
		http.Error(w, "Failed to fetch URL", http.StatusInternalServerError)
		fmt.Println("Failed to fetch Error: ", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := map[string]string{"result": html}
	json.NewEncoder(w).Encode(response)
}

func main() {
	pw, err := playwright.Run()
	if err != nil {
		panic("plantage playwright: " + err.Error())
	}
	browser, err := pw.Chromium.Launch()
	if err != nil {
		panic("plantage chromium: " + err.Error())
	}

	http.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
		search(w, r, browser)
	})
	fmt.Println("Server is running on port 8080...")
	http.ListenAndServe(":8080", nil)
}
