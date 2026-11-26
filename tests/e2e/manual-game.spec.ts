import { test, expect } from '@playwright/test';
import { territories } from '../../packages/shared/src/index';
test('controle manual: nomes, timer, ciclo, transferência, placar e vencedor', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  await page.goto('/');
  await page.getByLabel('Nome do jogador 1').fill('Ana');
  await page.getByLabel('Nome do jogador 2').fill('Bruno');
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  const turns = page.getByRole('region', { name: 'Controle de rodadas' });
  await expect(
    page.getByRole('button', { name: 'Vez de Ana', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const rankingBox = (await page
    .getByRole('region', { name: 'Placar', exact: true })
    .boundingBox())!;
  const legendBox = (await page
    .getByRole('region', { name: 'Controles do mapa', exact: true })
    .boundingBox())!;
  expect(rankingBox.y + rankingBox.height).toBeLessThan(legendBox.y);
  expect(await turns.evaluate((el) => getComputedStyle(el).position)).toBe(
    'fixed',
  );
  await page.getByLabel('Escolher território').selectOption('north-01');
  await page.getByRole('button', { name: 'Editar tempo (segundos)' }).click();
  await page.getByLabel('Tempo em segundos').fill('1');
  await expect(page.getByRole('timer')).toHaveText('00:01');
  await page
    .getByRole('button', { name: 'Iniciar timer', exact: true })
    .click();
  await expect(page.getByRole('timer')).toHaveText('00:00');
  await expect(
    turns.getByRole('heading', { name: 'Ana', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('listitem', { name: 'Ana: 0 pontos', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Registrar ficha', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Próximo jogador', exact: true })
    .click();
  await expect(
    turns.getByRole('heading', { name: 'Bruno', exact: true }),
  ).toBeVisible();
  await page.getByRole('radio', { name: /2 pontos/ }).check();
  await page
    .getByRole('button', { name: 'Registrar ficha', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /^Território 907,/ }),
  ).toHaveAccessibleName(/domínio de Ana/);
  await page
    .getByRole('button', { name: 'Confirmar alteração', exact: true })
    .click();
  await expect(
    page.getByRole('listitem', { name: 'Ana: 0 pontos', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('listitem', { name: 'Bruno: 2 pontos', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /^Território 907,/ }),
  ).toHaveAccessibleName(/domínio de Bruno, ficha de 2 pontos/);
  await page
    .getByRole('button', { name: 'Próximo jogador', exact: true })
    .click();
  await expect(page.getByText('RODADA 2 · VEZ 1/2')).toBeVisible();
  for (const territory of territories.slice(1, 7)) {
    await page.getByLabel('Escolher território').selectOption(territory.id);
    await page.getByRole('radio', { name: /3 pontos/ }).check();
    await page
      .getByRole('button', { name: 'Registrar ficha', exact: true })
      .click();
  }
  const dialog = page.getByRole('dialog', { name: 'Ana venceu!', exact: true });
  await expect(dialog).toBeVisible();
  await expect(
    page.locator('.scoreboard [data-player-id="player-1"]'),
  ).toHaveAttribute('aria-label', 'Ana: 18 pontos');
  await expect(dialog.locator('.victory-color')).toHaveCSS(
    'background-color',
    'rgb(102, 65, 201)',
  );
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  expect(
    await page
      .locator('.next-turn')
      .evaluate((button) => button.closest('[inert]') !== null),
  ).toBe(true);
  await expect(page.locator('.turn-timer')).toHaveCount(0);
  const undo = dialog.getByRole('button', {
      name: 'Voltar último movimento',
      exact: true,
    }),
    reset = dialog.getByRole('button', { name: 'Resetar jogo', exact: true });
  await expect(undo).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(reset).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(undo).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  const currentTurn = await page.locator('.turn-caption').textContent();
  const nextBox = (await page.locator('.next-turn').boundingBox())!;
  await page.mouse.click(
    nextBox.x + nextBox.width / 2,
    nextBox.y + nextBox.height / 2,
  );
  await page.mouse.click(2, 2);
  await expect(dialog).toBeVisible();
  await expect(page.locator('.turn-caption')).toHaveText(currentTurn!);
  await page.screenshot({
    path: `test-results/victory-${info.project.name}.png`,
  });
  await undo.click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole('listitem', { name: 'Ana: 15 pontos', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('listitem', { name: 'Bruno: 2 pontos', exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(`[data-territory-id="${territories[6]!.id}"]`),
  ).toHaveAccessibleName(/neutro/);
  await expect(
    page.getByRole('button', { name: 'Próximo jogador', exact: true }),
  ).toBeVisible();
  await page.getByRole('radio', { name: '3 pontos', exact: true }).check();
  await page
    .getByRole('button', { name: 'Registrar ficha', exact: true })
    .click();
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Resetar jogo', exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel('Nome do jogador 1')).toHaveValue('Ana');
  await expect(
    page.locator('[data-territory-id="north-01"]'),
  ).toHaveAccessibleName(/neutro/);
  await expect(page.locator('[data-territory-id="north-01"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(
    page.getByRole('region', { name: 'Placar', exact: true }),
  ).toHaveCount(0);
});

test('seis jogadores e escolha direta da vez pelos botões coloridos', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Excluir jogador 1', exact: true }),
  ).toBeDisabled();
  for (let i = 0; i < 4; i++)
    await page
      .getByRole('button', { name: 'Adicionar jogador', exact: true })
      .click();
  await expect(
    page.getByRole('button', { name: 'Adicionar jogador', exact: true }),
  ).toBeDisabled();
  for (let i = 1; i <= 6; i++)
    await page
      .getByLabel(`Nome do jogador ${i}`, { exact: true })
      .fill(`Jogador ${i}`);
  await page
    .getByRole('button', { name: 'Iniciar partida', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Vez de Jogador 6', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Vez de Jogador 6', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('RODADA 1 · VEZ 6/6', { exact: true }),
  ).toBeAttached();
  await page
    .getByRole('button', { name: 'Próximo jogador', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Vez de Jogador 1', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('RODADA 2 · VEZ 1/6', { exact: true }),
  ).toBeAttached();
  await expect(
    page
      .getByRole('region', { name: 'Placar', exact: true })
      .getByRole('listitem'),
  ).toHaveCount(6);
  await page.screenshot({
    path: `test-results/six-players-${info.project.name}.png`,
  });
});