import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { territories, geometry } from '@primos/shared';
import App from './App';
describe('revisão local do mapa', () => {
  it('permite selecionar cada uma das 42 regiões e todas as suas ilhas', () => {
    render(<App />);
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
    const region = screen.getByRole('button', { name: /^Território 907,/ });
    fireEvent.keyDown(region, { key: 'Escape' });
    expect(region).toHaveAttribute('aria-pressed', 'false');
    for (const key of ['Enter', ' ']) {
      fireEvent.keyDown(region, { key });
      expect(region).toHaveAttribute('aria-pressed', 'true');
    }
  });
  it('separa domínio de teste de continente, troca e limpa apenas o estado local', () => {
    render(<App />);
    const first = screen.getByRole('button', { name: /^Território 907,/ });
    const second = screen.getByRole('button', { name: /^Território 618,/ });
    fireEvent.click(first);
    const color = first.querySelector('path')!.getAttribute('fill');
    const select = screen.getByLabelText('Proprietário de teste');
    fireEvent.change(select, { target: { value: 'preview-a' } });
    expect(first).toHaveAccessibleName(/domínio de Ana/);
    expect(first.querySelector('path')).not.toHaveAttribute('fill', color);
    expect(second).toHaveAccessibleName(/neutro/);
    expect(within(first).getByText('J1')).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'preview-b' } });
    expect(first).toHaveAccessibleName(/domínio de Bruno/);
    fireEvent.click(
      screen.getByRole('button', { name: 'Limpar domínios de teste' }),
    );
    expect(first).toHaveAccessibleName(/neutro/);
    expect(first.querySelector('path')).toHaveAttribute('fill', color);
  });
  it('oferece alternativa à seleção de ilhas pequenas e alterna a referência', () => {
    render(<App />);
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
      '/assets/tabuleiro-original.jpeg',
    );
    fireEvent.click(screen.getByLabelText('Números'));
    expect(document.querySelectorAll('.territory-number')).toHaveLength(0);
  });
});
