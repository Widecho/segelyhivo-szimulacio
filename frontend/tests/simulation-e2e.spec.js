const { test, expect } = require('@playwright/test');

test.describe('Szimuláció végponttól végpontig', () => {
  test('sikeres bejelentkezés, szimuláció kitöltése, beküldése, kiértékelése és visszatérés a saját felületre', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Felhasználónév').fill('teszt.elek');
    await page.getByLabel('Jelszó').fill('Abc123');

    await page.getByRole('button', { name: /^Bejelentkezés$/ }).click();

    await expect(page).toHaveURL(/\/dashboard\/user$/);
    await expect(page.getByText('Felhasználói irányítópult')).toBeVisible();

  
    await page.getByRole('link', { name: 'Szimuláció' }).click();

    await expect(page).toHaveURL(/\/user\/simulation$/);
    await expect(
      page.getByText('A hívás fogadása után tölthető ki az adatlap.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Szabad állapot', exact: true }).click();

    const callHandlingButton = page.getByRole('button', {
      name: 'Hívás kezelése',
      exact: true,
    });
    await expect(callHandlingButton).toBeVisible({ timeout: 10000 });
    await expect(callHandlingButton).toBeEnabled({ timeout: 10000 });
    await callHandlingButton.click();

    await expect(
      page.getByRole('heading', { name: 'Bejövő hívás kezelése' })
    ).toBeVisible({ timeout: 10000 });

    const acceptCallButton = page.getByRole('button', {
      name: 'Hívás fogadása',
      exact: true,
    });
    await expect(acceptCallButton).toBeVisible({ timeout: 10000 });
    await acceptCallButton.click();

    // Adatlap kitöltése
    await expect(page.getByLabel('Bejelentő neve')).toBeVisible({ timeout: 10000 });

    await page.getByLabel('Bejelentő neve').fill('Minta Béla');
    await page.getByLabel('Telefonszám').fill('06301234567');

    await page.getByLabel('Kategória').selectOption({ index: 1 });

    await page.getByLabel('Koordináták').fill('48.103415, 20.752698');

    await expect(page.getByText(/Aktuális koordináták:/)).toBeVisible({ timeout: 10000 });

    await page.getByLabel('Jegyzet').fill(
      'A bejelentő közúti balesetet jelentett, sérültek is lehetnek.'
    );

    await page
      .getByRole('button', { name: 'Tovább a készenléti szervekhez', exact: true })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Készenléti szervek kiválasztása' }).last()
    ).toBeVisible({ timeout: 10000 });

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.check();

    await page
      .getByRole('button', { name: 'Készenléti szervek beküldése', exact: true })
      .click();

    await expect(page.getByText('Értékelés:')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Pontszám:')).toBeVisible();
    await expect(page.getByText('Összegzés:')).toBeVisible();

    const conferenceHeading = page.getByRole('heading', { name: 'Konferenciahívás' });
    const conferenceCloseButton = page.getByRole('button', { name: 'Bezárás', exact: true });

    if (await conferenceHeading.isVisible().catch(() => false)) {
      await expect(conferenceCloseButton).toBeVisible({ timeout: 5000 });
      await conferenceCloseButton.click();
    }

    await page.getByRole('link', { name: 'Saját felület', exact: true }).click();

    await expect(page).toHaveURL(/\/dashboard\/user$/);
    await expect(page.getByText('Felhasználói irányítópult')).toBeVisible();
  });
});