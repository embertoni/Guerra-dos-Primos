import { test, expect } from '@playwright/test';

test('preparação bloqueada, início fixo e reordenação por alça preservam os jogadores', async ({
  page,
  isMobile,
}, info) => {
  await page.goto('/');
  const territory = page.locator('[data-territory-id="north-01"]');
  await expect(territory).toHaveAttribute('aria-disabled', 'true');
  await expect(
    page.getByRole('region', { name: 'Detalhes do território' }),
  ).toHaveCount(0);
  await expect(page.getByLabel('Escolher território')).toHaveCount(0);
  const bounds = (await territory.boundingBox())!;
  await page.mouse.click(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await territory.focus();
  await page.keyboard.press('Enter');
  await expect(territory).toHaveAttribute('aria-pressed', 'false');
  const footer = (await page.locator('.setup-footer').boundingBox())!;
  expect(footer.y + footer.height).toBeCloseTo(page.viewportSize()!.height, 0);
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Adicionar jogador', exact: true })
    .click();
  await page.getByLabel('Nome do jogador 3').fill('Carla');
  const color = await page.getByLabel('Cor do jogador 3').inputValue();
  await page
    .getByRole('button', { name: 'Excluir jogador 2', exact: true })
    .click();
  await expect(page.getByLabel('Nome do jogador 2')).toHaveValue('Carla');
  await page
    .getByRole('button', { name: 'Adicionar jogador', exact: true })
    .click();
  await page.getByLabel('Nome do jogador 3').fill('Davi');
  const handle = (await page
    .getByRole('button', { name: 'Reordenar jogador 1', exact: true })
    .boundingBox())!;
  const target = (await page.locator('.player-input').nth(2).boundingBox())!;
  const x = handle.x + handle.width / 2,
    from = handle.y + handle.height / 2,
    to = target.y + target.height / 2;
  if (isMobile) {
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y: from, id: 1 }],
    });
    for (let step = 1; step <= 10; step++)
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: from + ((to - from) * step) / 10, id: 1 }],
      });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await session.detach();
  } else {
    await page.mouse.move(x, from);
    await page.mouse.down();
    await page.mouse.move(x, to, { steps: 10 });
    await page.mouse.up();
  }
  await expect(page.getByLabel('Nome do jogador 1')).toHaveValue('Carla');
  await expect(page.getByLabel('Nome do jogador 2')).toHaveValue('Davi');
  await expect(page.getByLabel('Nome do jogador 3')).toHaveValue('Ana');
  await expect(page.getByLabel('Cor do jogador 1')).toHaveValue(color);
  await page.screenshot({
    path: `test-results/setup-${info.project.name}.png`,
  });
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  await expect(territory).toHaveAttribute('aria-disabled', 'false');
  await expect(
    page.getByRole('button', { name: 'Vez de Carla', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const turns = page.getByRole('region', { name: 'Controle de rodadas' });
  const bar = (await turns.boundingBox())!;
  expect(
    page.viewportSize()!.height - (bar.y + bar.height),
  ).toBeLessThanOrEqual(16);
  await expect(page.locator('.turn-seat')).toHaveText(['', '', '']);
});

test('números ficam acima das fronteiras, separados e ancorados no território correto', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.locator('.number-layer .territory-number')).toHaveCount(42);
  const audit = await page.locator('.number-layer').evaluate((layer) => {
    const numbers = [...layer.querySelectorAll<SVGTextElement>('text')];
    const collisions: string[] = [];
    const misplaced: string[] = [];
    for (let i = 0; i < numbers.length; i++) {
      const text = numbers[i]!,
        box = text.getBBox(),
        id = text.getAttribute('data-number-for')!;
      const point = new DOMPoint(
        Number(text.getAttribute('x')),
        Number(text.getAttribute('y')),
      );
      const paths = [
        ...document.querySelectorAll<SVGPathElement>(
          `[data-territory-id="${id}"] path`,
        ),
      ];
      if (!paths.some((path) => path.isPointInFill(point)))
        misplaced.push(text.textContent!);
      for (let j = 0; j < i; j++) {
        const other = numbers[j]!.getBBox();
        if (
          box.x < other.x + other.width + 2 &&
          box.x + box.width + 2 > other.x &&
          box.y < other.y + other.height + 2 &&
          box.y + box.height + 2 > other.y
        )
          collisions.push(`${text.textContent}/${numbers[j]!.textContent}`);
      }
    }
    return {
      collisions,
      misplaced,
      lastLayer: layer.parentElement!.lastElementChild === layer,
    };
  });
  expect(audit.lastLayer).toBe(true);
  expect(audit.collisions).toEqual([]);
  expect(audit.misplaced).toEqual([]);
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  const move = await page
    .locator('[data-number-for="europe-06"]')
    .evaluate((label) => {
      const box = label.getBoundingClientRect(),
        svg = (
          label as SVGTextElement
        ).ownerSVGElement!.getBoundingClientRect();
      return {
        dx: svg.x + svg.width / 2 - box.x - box.width / 2,
        dy: svg.y + svg.height * 0.25 - box.y - box.height / 2,
        startX: svg.x + svg.width / 2,
        startY: svg.y + 40,
      };
    });
  await page.mouse.move(move.startX, move.startY);
  await page.mouse.down();
  await page.mouse.move(move.startX + move.dx, move.startY + move.dy, {
    steps: 8,
  });
  await page.mouse.up();
  await page.locator('[data-number-for="europe-06"]').click();
  await expect(page.locator('[data-territory-id="europe-06"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.screenshot({
    path: `test-results/labels-${info.project.name}.png`,
  });
});
