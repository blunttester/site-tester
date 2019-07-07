process.env.CHROME_PATH = require('puppeteer').executablePath();
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const { urls } = require('../assets/json/sites.json');

for (let url of urls) {
    (async () => {
        try {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--ignore-certificate-errors'
                ]
            });

            const {
                lhr: {
                    audits: {
                        'first-meaningful-paint': { rawValue: firstMeaningfulPaintRawValue },
                        'first-contentful-paint': { rawValue: firstContentfulPaintRawValue },
                        'estimated-input-latency': { rawValue: estimatedInputLatencyRawValue },
                        'speed-index': { rawValue: speedIndexRawValue }
                    },
                    categories: {
                        performance: { score: performanceScore },
                        pwa: { score: pwaScore },
                        accessibility: { score: accessibilityScore },
                        'best-practices': { score: bestPracticesScore },
                        seo: { score: seoScore }
                    }
                }
            } = await lighthouse(url, {
                port: new URL(browser.wsEndpoint()).port,
                chromeFlags: ['--headless']
            });

            console.log(
                JSON.stringify({
                    url,
                    firstMeaningfulPaintRawValue: convertToMs(firstMeaningfulPaintRawValue),
                    firstContentfulPaintRawValue: convertToMs(firstContentfulPaintRawValue),
                    estimatedInputLatencyRawValue: convertToMs(estimatedInputLatencyRawValue),
                    speedIndexRawValue: convertToMs(speedIndexRawValue),
                    performanceScore: convertToProcent(performanceScore),
                    pwaScore: convertToProcent(pwaScore),
                    accessibilityScore: convertToProcent(accessibilityScore),
                    bestPracticesScore: convertToProcent(bestPracticesScore),
                    seoScore: convertToProcent(seoScore)
                })
            );

            await browser.close();
        } catch (e) {
            console.log(e);
        }
    })();
}

function convertToProcent(value) {
    return value === 0 ? null : Math.floor(value * 100);
}

function convertToMs(value) {
    return value === 0 ? null : (value / 1000).toFixed(3);
}
