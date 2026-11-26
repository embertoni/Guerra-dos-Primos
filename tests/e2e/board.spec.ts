import { test, expect } from '@playwright/test';
import { territories } from '../../packages/shared/src/index';

test('ilha inferior seleciona o 62 e recebe o mesmo domínio sem afetar o 369', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  const color = await page.getByLabel('Cor do jogador 1').inputValue();
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  const target = async () =>
    page.locator('.map-camera').evaluate((camera) => {
      const point = new DOMPoint(1957, 881).matrixTransform(
        (camera as SVGGElement).getScreenCTM()!,
      );
      return { x: point.x, y: point.y };
    });
  const start = await target();
  const box = (await page.locator('.board').boundingBox())!;
  const x = box.x + box.width / 2,
    y = box.y + box.height * 0.3;
  await page.mouse.move(x, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(x + x - start.x, box.y + 40 + y - start.y, {
    steps: 8,
  });
  await page.mouse.up();
  await page.mouse.move(x, y);
  await page.mouse.wheel(0, -700);
  await expect
    .poll(() => page.locator('.map-camera').getAttribute('transform'))
    .not.toContain('scale(1)');
  const point = await target();
  if (isMobile) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
  const territory = page.locator('[data-territory-id="oceania-04"]');
  await expect(territory).toHaveAttribute('aria-pressed', 'true');
  await page
    .getByRole('button', { name: 'Registrar ficha', exact: true })
    .click();
  for (const path of await territory.locator('path').all())
    await expect(path).toHaveAttribute('fill', color);
  await expect(
    page.locator('[data-territory-id="oceania-03"]'),
  ).toHaveAccessibleName(/neutro/);
  await page.getByRole('button', { name: 'Mostrar legenda' }).click();
  await page.getByLabel('Visualização').selectOption('original');
  await expect(page.locator('svg image')).toHaveAttribute(
    'href',
    '/assets/tabuleiro-original.png',
  );
  await expect(page.locator('.number-layer text')).toHaveCount(42);
});
test('seleção, domínio independente, referência e recarga', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  await expect(page.getByRole('button', { name: /^Território / })).toHaveCount(
    42,
  );
  for (const t of territories) {
    await page.getByLabel('Escolher território').selectOption(t.id);
    await expect(
      page.getByRole('button', {
        name: new RegExp(`^Território ${t.number},`),
      }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByLabel('Escolher território').selectOption('north-01');
  await page
    .getByRole('button', { name: 'Registrar ficha', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /^Território 907,/ }),
  ).toHaveAccessibleName(/domínio de Ana/);
  await expect(
    page.getByRole('button', { name: /^Território 618,/ }),
  ).toHaveAccessibleName(/neutro/);
  await expect(
    page.getByRole('listitem', { name: 'Ana: 1 ponto', exact: true }),
  ).toBeVisible();
  await page.locator('.details').evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.screenshot({
    path: `test-results/${info.project.name}-mapa.png`,
    fullPage: true,
  });
  await page.getByLabel('Visualização').selectOption('overlay');
  await expect(page.locator('svg image')).toBeVisible();
  await expect(page.getByRole('combobox', { name: /^Ampliação/ })).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(() => document.body.scrollWidth <= window.innerWidth),
  ).toBe(true);
  await page.reload();
  await expect(
    page.getByRole('button', { name: /^Território 907,/ }),
  ).toHaveAccessibleName(/neutro/);
  expect(errors).toEqual([]);
});
test('teclado e clique ou toque selecionam a forma real', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const region = page.getByRole('button', { name: /^Território 907,/ });
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  const point = await page.locator('.board').evaluate((svg) => {
    const p = new DOMPoint(160, 168).matrixTransform(
      (svg as SVGSVGElement).getScreenCTM()!,
    );
    const box = svg.getBoundingClientRect();
    return {
      x: p.x,
      y: p.y,
      dx: box.x + box.width / 2 - p.x,
      dy: box.y + box.height * 0.25 - p.y,
      startX: box.x + box.width / 2,
      startY: box.y + 40,
    };
  });
  await page.mouse.move(point.startX, point.startY);
  await page.mouse.down();
  await page.mouse.move(point.startX + point.dx, point.startY + point.dy, {
    steps: 8,
  });
  await page.mouse.up();
  const target = await page.locator('.board').evaluate((svg) => {
    const camera = svg.querySelector<SVGGElement>('.map-camera')!;
    const point = new DOMPoint(160, 168).matrixTransform(
      camera.getScreenCTM()!,
    );
    return { x: point.x, y: point.y };
  });
  if (isMobile) await page.touchscreen.tap(target.x, target.y);
  else await page.mouse.click(target.x, target.y);
  await expect(region).toHaveAttribute('aria-pressed', 'true');
  const other = page.getByRole('button', { name: /^Território 618,/ });
  await region.focus();
  await page.keyboard.press('Tab');
  await expect(other).toBeFocused();
  await page.keyboard.press('Space');
  await expect(other).toHaveAttribute('aria-pressed', 'true');
  await region.focus();
  await page.keyboard.press('Enter');
  await expect(region).toHaveAttribute('aria-pressed', 'true');
});

test('cada território recebe clique ou toque dentro de um path visível', async ({
  page,
  isMobile,
}) => {
  test.setTimeout(90000);
  await page.goto('/');
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  for (const territory of territories) {
    await page
      .getByRole('button', { name: 'Recentralizar mapa', exact: true })
      .click();
    const region = page.locator(`[data-territory-id="${territory.id}"]`);
    const paths = region.locator('path');
    const largest = await paths.evaluateAll(
      (elements) =>
        elements
          .map((element, index) => {
            const box = (element as SVGPathElement).getBBox();
            return { index, area: box.width * box.height };
          })
          .sort((a, b) => b.area - a.area)[0]!.index,
    );
    const path = paths.nth(largest);
    // Move each real shape to the clear center of the map, away from the
    // floating legend, using the same pointer gesture available to users.
    const center = await path.evaluate((element) => {
      const shape = element as SVGPathElement;
      const box = shape.getBBox();
      const point = new DOMPoint(
        box.x + box.width / 2,
        box.y + box.height / 2,
      ).matrixTransform(shape.getScreenCTM()!);
      const viewport = shape.ownerSVGElement!.getBoundingClientRect();
      return {
        dx: viewport.x + viewport.width / 2 - point.x,
        dy: viewport.y + viewport.height * 0.3 - point.y,
        startX: viewport.x + viewport.width / 2,
        startY: viewport.y + 40,
      };
    });
    await page.mouse.move(center.startX, center.startY);
    await page.mouse.down();
    await page.mouse.move(
      center.startX + center.dx,
      center.startY + center.dy,
      { steps: 8 },
    );
    await page.mouse.up();
    if (isMobile) {
      const viewport = await page.locator('.board').boundingBox();
      await page.mouse.move(
        viewport!.x + viewport!.width / 2,
        viewport!.y + viewport!.height * 0.3,
      );
      await page.mouse.wheel(0, -900);
      await expect
        .poll(() => page.locator('.map-camera').getAttribute('transform'))
        .not.toContain('scale(1)');
    }
    const point = await path.evaluate((element) => {
      const shape = element as SVGPathElement;
      const box = shape.getBBox();
      const matrix = shape.getScreenCTM()!;
      const order = [
        10, 9, 11, 8, 12, 7, 13, 6, 14, 5, 15, 4, 16, 3, 17, 2, 18, 1, 19,
      ];
      for (const row of order)
        for (const col of order) {
          const local = new DOMPoint(
            box.x + (box.width * col) / 20,
            box.y + (box.height * row) / 20,
          );
          if (!shape.isPointInFill(local)) continue;
          const screen = local.matrixTransform(matrix);
          const hit = document.elementFromPoint(screen.x, screen.y);
          if (
            hit === shape ||
            hit?.getAttribute('data-number-for') ===
              shape.parentElement?.getAttribute('data-territory-id')
          )
            return { x: screen.x, y: screen.y };
        }
      return null;
    });
    expect(
      point,
      `Área clicável do território ${territory.number}`,
    ).not.toBeNull();
    if (isMobile) await page.touchscreen.tap(point!.x, point!.y);
    else await page.mouse.click(point!.x, point!.y);
    await expect(region).toHaveAttribute('aria-pressed', 'true');
  }
});

test('tela contínua, arraste sem seleção, zoom pelo scroll e recentralização', async ({
  page,
}) => {
  await page.goto('/');
  const map = page.locator('.board');
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  const camera = page.locator('.map-camera');
  const initial = await camera.getAttribute('transform');
  const box = (await map.boundingBox())!;
  const header = (await page.locator('header').boundingBox())!;
  const sidebar = (await page.getByRole('complementary').boundingBox())!;
  expect(box.y).toBe(header.y + header.height);
  expect(sidebar.x).toBe(box.x + box.width);
  expect(box.y + box.height).toBe(page.viewportSize()!.height);
  expect(
    await page
      .locator('.map-overlays')
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe('fixed');
  await page.getByLabel('Escolher território').selectOption('north-01');
  await page.mouse.move(box.x + box.width / 2, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 35, box.y + 95, { steps: 8 });
  await page.mouse.up();
  await expect(camera).not.toHaveAttribute('transform', initial!);
  await expect(
    page.locator('[data-territory-id][aria-pressed="true"]'),
  ).toHaveAttribute('data-territory-id', 'north-01');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.25);
  await page.mouse.wheel(0, -400);
  await expect
    .poll(() => camera.getAttribute('transform'))
    .not.toContain('scale(1)');
  await page
    .getByRole('button', { name: 'Recentralizar mapa', exact: true })
    .click();
  await expect(camera).toHaveAttribute('transform', initial!);
  await page.screenshot({
    path: `test-results/navigation-${test.info().project.name}.png`,
  });
});