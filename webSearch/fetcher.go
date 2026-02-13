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
	if err != nil {
		return "", err
	}

	htmlContent, err = page.Content()
	if err != nil {
		return "", err
	}

	return htmlContent, nil
}
