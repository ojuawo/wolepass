import { test, expect } from '@playwright/test';

test('billing enforcement displays on suspended estate', async ({ page }) => {
  await page.goto('/login');

  // Fill the email input
  await page.fill('input[type="email"]', 'admin@wolepass.com');
  await page.fill('input[type="password"]', 'password');

  // Click the Login button
  await page.click('button:has-text("Sign In")');

  // Wait for the URL to change to /dashboard (proving auth works)
  await page.waitForURL('**/dashboard');

  // Click the "Generate Dispatch Pass" button to navigate to /generate
  await page.click('button:has-text("Generate Dispatch Pass"), a:has-text("Generate Dispatch Pass")');

  // Wait for URL to change to /generate
  await page.waitForURL('**/generate');

  // Fill out the Generate Pass form
  await page.selectOption('select', 'dispatch');
  
  // Set expected arrival time to tomorrow at noon to ensure it's in the future
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);
  
  // Datetime-local requires YYYY-MM-DDThh:mm format
  const offset = tomorrow.getTimezoneOffset() * 60000;
  const timeString = new Date(tomorrow.getTime() - offset).toISOString().slice(0, 16);
  await page.fill('input[type="datetime-local"]', timeString);

  // Click "Generate New Pass"
  await page.click('button:has-text("Generate New Pass")');

  // Wait for the suspended state to appear
  await expect(page.getByText('Subscription Suspended')).toBeVisible();
  const paystackButton = page.getByRole('button', { name: /Pay with Paystack/i });
  await expect(paystackButton).toBeVisible();

  // Take a screenshot of the browser at the exact moment the Paystack button appears
  await page.screenshot({ path: 'artifacts/billing_enforcement_paystack.png', fullPage: true });
});
