import { createServer } from 'node:http';
import { copyFile, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordingsDir = path.join(root, 'recordings');
const finalVideoPath = path.join(recordingsDir, 'command-gravity-demo.webm');
const finalScreenshotPath = path.join(recordingsDir, 'command-gravity-final.png');

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webm', 'video/webm'],
]);

function createStaticServer() {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '');
      const requestedPath = path.resolve(root, safePath || 'index.html');

      if (!requestedPath.startsWith(root)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      const requestedStat = await stat(requestedPath).catch(() => null);
      const filePath = requestedStat?.isDirectory()
        ? path.join(requestedPath, 'index.html')
        : requestedPath;
      const data = await readFile(filePath);

      response.writeHead(200, {
        'content-type': mimeTypes.get(path.extname(filePath)) ?? 'application/octet-stream',
      });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  return server.address().port;
}

async function close(server) {
  await new Promise((resolve) => server.close(resolve));
}

async function main() {
  await mkdir(recordingsDir, { recursive: true });
  await rm(finalVideoPath, { force: true });
  await rm(finalScreenshotPath, { force: true });

  const useServer = process.env.RECORD_COMMAND_GRAVITY_SERVER === '1';
  const server = useServer ? createStaticServer() : null;
  const port = server ? await listen(server) : null;
  const url = server
    ? `http://127.0.0.1:${port}/experiments/command-gravity/`
    : pathToFileURL(path.join(root, 'experiments/command-gravity/index.html')).href;

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      recordVideo: {
        dir: recordingsDir,
        size: { width: 1280, height: 900 },
      },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    await page.locator('#commandSearch').click();
    await page.keyboard.type('layout', { delay: 80 });
    await page.waitForTimeout(700);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(450);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);

    await page.locator('#commandSearch').fill('');
    await page.waitForTimeout(400);
    await page.locator('.gravity-chip[data-query="motion"]').click();
    await page.waitForTimeout(700);

    const field = await page.locator('#gravityNodes').boundingBox();
    const firstNode = await page.locator('.gravity-node').first().boundingBox();
    const startX = firstNode.x + firstNode.width * 0.5;
    const startY = firstNode.y + firstNode.height * 0.5;

    await page.mouse.move(startX, startY, { steps: 18 });
    await page.mouse.down();
    await page.waitForTimeout(250);
    await page.mouse.move(field.x + field.width * 0.72, field.y + field.height * 0.64, { steps: 36 });
    await page.waitForTimeout(300);
    await page.mouse.move(field.x + field.width * 0.36, field.y + field.height * 0.34, { steps: 32 });
    await page.waitForTimeout(250);
    await page.mouse.up();
    await page.waitForTimeout(900);

    await page.locator('.gravity-chip[data-query="tokens"]').click();
    await page.waitForTimeout(900);
    await page.locator('#commandSearch').click();
    await page.keyboard.type('contrast', { delay: 70 });
    await page.waitForTimeout(900);

    await page.screenshot({ path: finalScreenshotPath, fullPage: true });
    const video = page.video();
    await context.close();
    await copyFile(await video.path(), finalVideoPath);
  } finally {
    await browser?.close();
    if (server) {
      await close(server);
    }
  }

  console.log(`Recorded ${finalVideoPath}`);
  console.log(`Captured ${finalScreenshotPath}`);
}

main().catch((error) => {
  console.error(error);
  console.error('If the browser binary is missing, run: npx playwright install chromium');
  process.exitCode = 1;
});
