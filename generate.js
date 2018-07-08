const fs = require('fs');
const puppeteer = require('puppeteer');
const pug = require('pug');
const yaml = require('js-yaml');
const marked = require('marked');

const guides = yaml.safeLoad(fs.readFileSync('./src/data/guides.yml', 'utf8'));

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--allow-file-access-from-files',
      '--enable-local-file-accesses',
      '--disable-translate',
      '--disable-extensions',
      '--disable-sync',
      '--no-sandbox',
    ]
  });
  const page = await browser.newPage();
  const html = pug.renderFile('src/index.pug', { fs, guides, marked });
  fs.writeFileSync('guides.html', html);
  await page.goto(`file://${ __dirname }/guides.html`);
  await page.pdf({ path: 'guides.pdf', width: '8.5in', height: '11in', printBackground: true });
  await browser.close();
})();
