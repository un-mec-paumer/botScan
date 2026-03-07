package main

import (
	"fmt"
	"strings"

	"github.com/playwright-community/playwright-go"
)

func fetcher(browser playwright.Browser, url string) (string, error) {
	var htmlContent string

	page, err := browser.NewPage()
	if err != nil {
		return "", err
	}
	defer page.Close()

	err = page.Route("**/*", func(route playwright.Route) {
		req := route.Request()
		if req.ResourceType() == "image" || req.ResourceType() == "media" || req.ResourceType() == "font" {
			route.Abort()
		} else {
			route.Continue()
		}
	})

	if err != nil {
		return "", err
	}

	_, err = page.Goto(url, playwright.PageGotoOptions{
		WaitUntil: playwright.WaitUntilStateNetworkidle,
		Timeout:   playwright.Float(60000),
	})

	// time.Sleep(3 * time.Second)

	if err != nil {
		return "", err
	}

	htmlContent, err = page.Content()
	if err != nil {
		return "", err
	}

	if htmlContent == "" {
		fmt.Printf("Failed to fetch content from %s\n", url)
		return "", nil
	}

	if strings.Contains(htmlContent, "captcha") ||
		strings.Contains(htmlContent, "Please verify you're a human") ||
		strings.Contains(htmlContent, "Just a moment...") {

		fmt.Printf("Captcha detected on %s, skipping...\n", url)
		return "", nil
	}

	return htmlContent, nil
}
