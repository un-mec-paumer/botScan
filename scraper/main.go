package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/chromedp/chromedp"
)

func main() {
	userAgent := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.UserAgent(userAgent),
		chromedp.Flag("headless", "new"),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("enable-automation", false),
		chromedp.Flag("disable-blink-features", "AutomationControlled"),
	)

	allocCtx, cancelAlloc := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancelAlloc()

	browserCtx, cancelBrowser := chromedp.NewContext(allocCtx)
	defer cancelBrowser()

	fmt.Println("Démarrage du navigateur Chrome...")
	if err := chromedp.Do(browserCtx); err != nil {
		log.Fatalf("Erreur au démarrage du navigateur : %v", err)
	}
	fmt.Println("Navigateur prêt !")

	http.HandleFunc("/html", func(w http.ResponseWriter, r *http.Request) {
		res, err := handlerHTTP(w, r, browserCtx)
		if err != nil {
			log.Printf("Error in handlerHTTP: %v", err)
			return
		}
		w.Write([]byte(res))
	})

	http.HandleFunc("/scrape", func(w http.ResponseWriter, r *http.Request) {
		res, err := handlerHTTP(w, r, browserCtx)
		if err != nil {
			log.Printf("Error in handlerHTTP: %v", err)
			return
		}
		response := map[string]string{"result": res}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	fmt.Println("Starting server on http://127.0.0.1:3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal(err)
	}
}

func handlerHTTP(w http.ResponseWriter, r *http.Request, browserCtx context.Context) (string, error) {
	url := r.URL.Query().Get("url")
	// fmt.Printf("Received request to scrape URL: %s\n", url)
	if url == "" {
		http.Error(w, "Missing url parameter", http.StatusBadRequest)
		return "", fmt.Errorf("missing url parameter")
	}

	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		http.Error(w, "Invalid url parameter", http.StatusBadRequest)
		return "", fmt.Errorf("invalid url parameter")
	}
	var res string
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func(res *string) {
		defer wg.Done()
		html, err := Scrape(browserCtx, url)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			*res = ""
			return
		}

		if html == "" {
			http.Error(w, "No content extracted", http.StatusInternalServerError)
			*res = ""
			return
		}
		*res = html
	}(&res)

	wg.Wait()
	return res, nil
}
