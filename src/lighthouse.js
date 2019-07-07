process.env.CHROME_PATH = require('puppeteer').executablePath();
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const { urls } = require('../assets/json/sites.json');