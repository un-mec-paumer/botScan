import Express from 'express';
import { launch } from 'puppeteer';

const app = Express();
app.use(Express.json());


app.use((req, res, next ) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(Express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server started! Listening on port " + 3000);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const browser = await launch({
    headless: true,
    args: [
        '--no-sandbox',
        // '--disable-setuid-sandbox',
        // '--disable-blink-features=AutomationControlled',
        // '--disable-extensions',
        // '--enable-gpu'
    ],
    executablePath: '/usr/bin/chromium',
    // ignoreHTTPSErrors: true,
    protocolTimeout: 60000,
});

const casMerde = [
    "captcha", 
    "recaptcha", 
    "hcaptcha", 
    "just a moment..."
] 

app.get("/scrape", async (req, res) => {
    const url = req.query.url as string;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }
    console.log("Scraping URL: " + url);
    try {
        const html = await scrape(url);
        res.json({ result: html });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
});

app.get("/html", async (req, res) => {
    const url = req.query.url as string;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const html = await scrape(url);
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
});

async function scrape(url: string): Promise<string> {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const html = await page.content();
    if (casMerde.some((cas) => html.includes(cas))) {
        await page.close();
        throw new Error("Captcha detected");
    }
    await page.close();
    return html;
}
