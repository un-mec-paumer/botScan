package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
)

// modified it to include a map of selectors for different sites
var awaitSelectors = map[string]string{
	"anime-sama": "[id='selectChapitres']",
	"mangaplus":  "[class*='ChapterListItem']",
}

// max fenetres ouvertes en même temps
const MaxConcurrentTabs = 20

var semaphore = make(chan struct{}, MaxConcurrentTabs)

func Scrape(browserCtx context.Context, url string) (string, error) {
	// 1. Réserve un créneau (attend si 5 onglets tournent déjà)
	semaphore <- struct{}{}
	defer func() { <-semaphore }()

	// 2. Ouvre un onglet isolé dans le navigateur
	tabCtx, cancelTab := chromedp.NewContext(browserCtx)
	defer cancelTab()

	ctx, cancelTimeout := context.WithTimeout(tabCtx, 45*time.Second)
	defer cancelTimeout()
	fmt.Printf("Scraping URL: %s\n", url)
	// fmt.Printf("Awaiting selector for URL: %s\n", awaitSelector(url))
	// 3. Navigation et attente du chargement asynchrone
	sel := awaitSelector(url)
	actions := []chromedp.Action[chromedp.Void]{chromedp.Navigate(url)}
	if sel != "" {
		actions = append(actions, chromedp.WaitVisible(chromedp.CSS(sel)))
	} else {
		actions = append(actions, chromedp.Sleep(2*time.Second))
	}

	err := chromedp.Do(ctx, actions...)
	if err != nil {
		return "", fmt.Errorf("erreur lors du chargement/attente de la page : %w", err)
	}

	// 4. Extraction du contenu HTML
	htmlContent, err := chromedp.Run(ctx, chromedp.OuterHTML(chromedp.CSS("html")))
	if err != nil {
		return "", fmt.Errorf("erreur lors de l'extraction HTML : %w", err)
	}

	return htmlContent, nil
}

func awaitSelector(url string) string {
	for site, selector := range awaitSelectors {
		if strings.Contains(url, site) {
			return selector
		}
	}
	return ""
}
