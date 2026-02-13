package main

import (
	// "fmt"
	"github.com/playwright-community/playwright-go"
)

func fetcher(browser playwright.Browser, url string) (string, error) {
	var htmlContent string

	page, err := browser.NewPage()
	if err != nil {
		return "", err
	}
	defer page.Close()

	_, err = page.Goto(url)
	if err != nil {
		return "", err
	}

	htmlContent, err = page.Content()
	if err != nil {
		return "", err
	}

	return htmlContent, nil
}
