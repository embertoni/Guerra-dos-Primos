import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { territories, geometry } from '@primos/shared';
import App from './App';
function startGame() {
  fireEvent.change(screen.getByLabelText('Nome do jogador 1'), {
    target: { value: 'Ana' },
  });
  fireEvent.change(screen.getByLabelText('Nome do jogador 2'), {
    target: { value: 'Bruno' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar partida' }));
}
describe('revisão local do mapa', () => {
  it('atualiza placar antes do modal e permite desfazer ou resetar a vitória', () => {
    render(<App />);
    startGame();
    for (const territory of territories.slice(0, 6)) {
      fireEvent.change(screen.getByLabelText('Escolher território'), {
        target: { value: territory.id },
      });
      fireEvent.click(screen.getByRole('radio', { name: '3 pontos' }));
      fireEvent.click(screen.getByRole('button', { name: 'Registrar ficha' }));
    }
    const dialog = screen.getByRole('dialog', { name: 'Ana venceu!' });
    expect(
      document.querySelector('.scoreboard [data-player-id="player-1"]'),
    ).toHaveAttribute('aria-label', 'Ana: 18 pontos');
    expect(document.querySelector('main')).toHaveAttribute('inert');
    expect(within(dialog).getByRole('img', { name: 'Cor de Ana' })).toHaveStyle(
      { background: '#6641c9' },
    );
    const undo = within(dialog).getByRole('button', {
        name: 'Voltar último movimento',
      }),
      reset = within(dialog).getByRole('button', { name: 'Resetar jogo' });
    expect(undo).toHaveFocus();
    fireEvent.keyDown(undo, { key: 'Tab', shiftKey: true });
    expect(reset).toHaveFocus();
    fireEvent.keyDown(reset, { key: 'Tab' });
    expect(undo).toHaveFocus();
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog).toHaveAttribute('open');
    fireEvent.click(document.querySelector('.next-turn')!);
    expect(document.querySelector('.turn-caption')).toHaveTextContent(
      'RODADA 1 · VEZ 1/2',
    );
    fireEvent.click(undo);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('listitem', { name: 'Ana: 15 pontos' }),
    ).toBeInTheDocument();
    expect(document.querySelector('main')).not.toHaveAttribute('inert');
    expect(
      screen.getByRole('button', { name: /^Território 471,/ }),
    ).toHaveAccessibleName(/neutro/);
    fireEvent.click(screen.getByRole('radio', { name: '3 pontos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Registrar ficha' }));
    fireEvent.click(screen.getByRole('button', { name: 'Resetar jogo' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nome do jogador 1')).toHaveValue('Ana');
    expect(
      screen.queryByRole('region', { name: 'Placar' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Território 907,/ }),
    ).toHaveAccessibleName(/neutro/);
    expect(
      screen.getByRole('button', { name: /^Território 907,/ }),
    ).toHaveAttribute('aria-disabled', 'true');
  });
  it('permite selecionar cada uma das 42 regiões e todas as suas ilhas', () => {
    render(<App />);
    startGame();
    const details = screen.getByRole('complementary');
    for (const t of territories) {
      const region = screen.getByRole('button', {
        name: new RegExp(`^Território ${t.number},`),
      });
      expect(region.querySelectorAll('path')).toHaveLength(
        geometry[t.id as keyof typeof geometry].length,
      );
      for (const path of region.querySelectorAll('path')) {
        fireEvent.click(path);
        expect(region).toHaveAttribute('aria-pressed', 'true');
        expect(
          within(details).getByRole('heading', { name: String(t.number) }),
        ).toBeInTheDocument();
      }
    }
  });
  it('seleciona por Enter e Espaço e não responde a outras teclas', () => {
    render(<App />);
    startGame();
    const region = screen.getByRole('button', { name: /^Território 907,/ });
    fireEvent.keyDown(region, { key: 'Escape' });
    expect(region).toHaveAttribute('aria-pressed', 'false');
    for (const key of ['Enter', ' ']) {
      fireEvent.keyDown(region, { key });
      expect(region).toHaveAttribute('aria-pressed', 'true');
    }
  });
  it('registra ficha manual, confirma transferência e recalcula os dois placares', () => {
    render(<App />);
    startGame();
    const first = screen.getByRole('button', { name: /^Território 907,/ });
    const second = screen.getByRole('button', { name: /^Território 618,/ });
    fireEvent.click(first);
    const color = first.querySelector('path')!.getAttribute('fill');
    fireEvent.click(screen.getByRole('button', { name: 'Registrar ficha' }));
    expect(first).toHaveAccessibleName(/domínio de Ana/);
    expect(first.querySelector('path')).not.toHaveAttribute('fill', color);
    expect(second).toHaveAccessibleName(/neutro/);
    expect(
      document.querySelector('[data-markers-for="north-01"]'),
    ).toHaveTextContent('J1');
    expect(
      screen.getByRole('listitem', { name: 'Ana: 1 ponto' }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Jogador da ficha'), {
      target: { value: 'player-2' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /2 pontos/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Registrar ficha' }));
    expect(first).toHaveAccessibleName(/domínio de Ana/);
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar alteração' }),
    );
    expect(first).toHaveAccessibleName(/domínio de Bruno/);
    expect(
      screen.getByRole('listitem', { name: 'Ana: 0 pontos' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('listitem', { name: 'Bruno: 2 pontos' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Retirar ficha e domínio' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar alteração' }),
    );
    expect(first).toHaveAccessibleName(/neutro/);
    expect(first.querySelector('path')).toHaveAttribute('fill', color);
  });
  it('limita cadastro a 2–6 e mantém a vez cíclica por ordem de cadastro', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'Excluir jogador 1' }),
    ).toBeDisabled();
    for (let i = 0; i < 4; i++)
      fireEvent.click(
        screen.getByRole('button', { name: 'Adicionar jogador' }),
      );
    expect(
      screen.getByRole('button', { name: 'Adicionar jogador' }),
    ).toBeDisabled();
    for (let i = 0; i < 4; i++)
      fireEvent.click(
        screen.getAllByRole('button', { name: /^Excluir jogador / }).at(-1)!,
      );
    startGame();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo jogador' }));
    expect(
      within(
        screen.getByRole('region', { name: 'Controle de rodadas' }),
      ).getByRole('heading', { name: 'Bruno' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo jogador' }));
    expect(screen.getByText('RODADA 2 · VEZ 1/2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vez de Bruno' }));
    expect(
      screen.getByRole('button', { name: 'Vez de Bruno' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('RODADA 2 · VEZ 2/2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vez de Ana' }));
    expect(screen.getByText('RODADA 2 · VEZ 1/2')).toBeInTheDocument();
  });
  it('timer exige início manual, expira sem passar a vez e é cancelado ao mudar território', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      startGame();
      fireEvent.click(screen.getByRole('button', { name: /^Território 907,/ }));
      fireEvent.change(screen.getByLabelText('Tempo em segundos'), {
        target: { value: '3' },
      });
      act(() => vi.advanceTimersByTime(4000));
      expect(screen.getByRole('timer')).toHaveTextContent('00:03');
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar timer' }));
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByRole('timer')).toHaveTextContent('00:00');
      expect(screen.getByText(/Tempo esgotado/)).toBeInTheDocument();
      expect(screen.getByText('RODADA 1 · VEZ 1/2')).toBeInTheDocument();
      expect(
        screen.getByRole('listitem', { name: 'Ana: 0 pontos' }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar timer' }));
      act(() => vi.advanceTimersByTime(1000));
      fireEvent.click(screen.getByRole('button', { name: /^Território 618,/ }));
      expect(screen.getByRole('timer')).toHaveTextContent('00:03');
      act(() => vi.advanceTimersByTime(4000));
      expect(screen.getByRole('timer')).toHaveTextContent('00:03');
    } finally {
      vi.useRealTimers();
    }
  });
  it('oferece alternativa à seleção de ilhas pequenas e alterna a referência', () => {
    render(<App />);
    startGame();
    fireEvent.change(screen.getByLabelText('Escolher território'), {
      target: { value: 'europe-01' },
    });
    expect(
      screen.getByRole('button', { name: /^Território 354,/ }),
    ).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByLabelText('Visualização'), {
      target: { value: 'overlay' },
    });
    expect(document.querySelector('svg image')).toHaveAttribute(
      'href',
      '/assets/tabuleiro-original.png',
    );
    fireEvent.click(screen.getByLabelText('Números'));
    expect(document.querySelectorAll('.territory-number')).toHaveLength(0);
  });
  it('bloqueia seleção antes do início e mantém os números na última camada', () => {
    render(<App />);
    const region = screen.getByRole('button', { name: /^Território 907,/ });
    expect(region).toHaveAttribute('aria-disabled', 'true');
    expect(region).toHaveAttribute('tabindex', '-1');
    fireEvent.click(region);
    fireEvent.keyDown(region, { key: 'Enter' });
    fireEvent.click(document.querySelector('[data-number-for="north-01"]')!);
    expect(region).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.queryByRole('region', { name: 'Detalhes do território' }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('.map-camera')!.lastElementChild).toHaveClass(
      'number-layer',
    );
    startGame();
    fireEvent.click(document.querySelector('[data-number-for="north-01"]')!);
    expect(region).toHaveAttribute('aria-pressed', 'true');
  });
  it('remove um jogador específico e reordena com teclado preservando nomes e cores', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Nome do jogador 1'), {
      target: { value: 'Ana' },
    });
    fireEvent.change(screen.getByLabelText('Nome do jogador 2'), {
      target: { value: 'Bruno' },
    });
    const color = screen
      .getByLabelText('Cor do jogador 2')
      .getAttribute('value');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar jogador' }));
    fireEvent.change(screen.getByLabelText('Nome do jogador 3'), {
      target: { value: 'Carla' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Excluir jogador 1' }));
    expect(screen.getByLabelText('Nome do jogador 1')).toHaveValue('Bruno');
    expect(screen.getByLabelText('Cor do jogador 1')).toHaveValue(color);
    fireEvent.keyDown(
      screen.getByRole('button', { name: 'Reordenar jogador 2' }),
      { key: 'ArrowUp' },
    );
    expect(screen.getByLabelText('Nome do jogador 1')).toHaveValue('Carla');
    expect(
      screen.getByRole('button', { name: 'Reordenar jogador 1' }),
    ).toHaveFocus();
    expect(screen.getByLabelText('Nome do jogador 2')).toHaveValue('Bruno');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar partida' }));
    expect(
      within(
        screen.getByRole('region', { name: 'Controle de rodadas' }),
      ).getByRole('heading', { name: 'Carla' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Vez de Carla' }),
    ).toHaveTextContent('');
  });
});
