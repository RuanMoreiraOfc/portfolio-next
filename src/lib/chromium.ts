import { isNull } from 'util';
import chrome from 'chrome-aws-lambda';
import type { Browser, Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';

export { utilizePage };

let browser: Browser | null = null;

type Options = {
  args: string[];
  executablePath: string;
  headless: boolean;
};

const getOptions = async (isDev: boolean): Promise<Options> => {
  if (isDev === false) {
    return {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }

  const chromeExecPaths = {
    win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  };

  const executablePath =
    chromeExecPaths[process.platform as keyof typeof chromeExecPaths];

  return {
    args: [],
    executablePath,
    headless: true,
  };
};

const utilizePage = async <T>(
  isDev: boolean,
  callback: (page: Page) => Promise<T>,
) => {
  browserVerify: {
    if (!isNull(browser)) {
      break browserVerify;
    }

    const options = await getOptions(isDev);
    browser = await puppeteer.launch(options);
  }

  const page = await browser.newPage();
  const response = await callback(page);
  page.close();

  return response;
};
