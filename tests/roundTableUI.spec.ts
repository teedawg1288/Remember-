import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

for (const device of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Round Table controls work on ${device.name}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: device.width, height: device.height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:43177', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /Someone ignored your text or walked past you/ }).click();
    await page.getByRole('button', { name: /The Living Rosetta Stone/ }).click();
    await expect(page.getByText('Who gets the floor?')).toBeVisible();

    await page.getByRole('button', { name: 'My Mix' }).click();
    const sliders = page.locator('input[type="range"]');
    expect(await sliders.count()).toBeGreaterThanOrEqual(2);
    const first = sliders.first();
    const before = Number(await first.inputValue());
    await first.focus();
    await first.press('ArrowRight');
    const after = Number(await first.inputValue());
    expect(after).toBeGreaterThan(before);
    const total = (await sliders.evaluateAll(items => items.reduce((sum, item) => sum + Number(item.value), 0)));
    expect(total).toBe(100);

    mkdirSync('screenshots', { recursive: true });
    await page.screenshot({ path: `screenshots/roundtable-${device.name}.png`, fullPage: true });

    await page.getByRole('button', { name: /Run the Round Table With This Mix/ }).click();
    await expect(page.getByRole('alert')).toContainText(/needs an AI connection/i);
    expect(errors).toEqual([]);
    await context.close();
  });
}
