import { test, expect } from '@playwright/test';

test('Login by Importing Blogchain private key', async ({ page }) => {
	await page.goto('/login');

	await expect(page).toHaveTitle(/Login - Blogchain/);

	await page.locator('text=Import Blogchain private key').click();

	await page.setInputFiles('input[type="file"]', './tests/testdata/nairobi.test.json');

	await expect(page).toHaveTitle(/Home - Blogchain/);

	await expect(page.locator('text=Hello, Test Account')).toBeVisible();

	await page.waitForTimeout(5000);
});
