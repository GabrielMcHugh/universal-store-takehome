import test, { expect } from "@playwright/test";


test.describe('Product Landing Page', () => {
    test('loads and shows the store logo', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('img', { name: 'logo' })).toBeVisible()
    })

    test('shows in-stock products from catalog + inventory', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'Pen' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Paper' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Key' })).toBeVisible();
    })

    test('does not show out-of-stock products', async ({ page }) => {
        await page.goto('/');

        const penCard = page.locator('article.product-card').filter({
            has: page.getByRole('heading', { name: 'Pen' })
        })

        await expect(penCard.getByText('SKU: 111111')).toBeVisible();
        await expect(penCard.getByText('3 in stock')).toBeVisible();
        await expect(penCard.getByText('$3.00')).toBeVisible();
        await expect(penCard.getByRole('img', { name: 'Pen' })).toBeVisible();
    })
})

