import { test, expect } from '@playwright/test';

test('homepage displays the onboarding popups', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Home - Blogchain/);

	// Onboarding popup
	await expect(page.locator('text=Customize your homepage')).toBeVisible();

	// Click Next till end
	await expect(page.locator('text=Next')).toBeVisible();
	await page.locator('text=Next').click();

	await expect(page.locator('text=Discover great content')).toBeVisible();
	await page.locator('text=Next').click();

	await expect(page.locator('text=Save and share bookmarks')).toBeVisible();
	await page.locator('text=Next').click();

	await expect(page.locator('text=Create content easily')).toBeVisible();
	await page.locator('text=Next').click();

	await expect(page.locator('text=Join the conversation')).toBeVisible();
	await page.locator('text=Next').click();

	await expect(page.locator('text=Start by editing your profile')).toBeVisible();

	await page.locator('[placeholder="Enter display name"]').fill('John Doe');
	await page.locator('[placeholder="Display Blogchain Bio"]').fill('I`m cool and I know it');

	await page.locator("text=Let's start!").click();
	await expect(page.locator('text=Hello, John Doe')).toBeVisible();
});
