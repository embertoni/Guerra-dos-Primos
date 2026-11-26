import { primeFactors } from './Primes';

/** Só aparece para territórios com ficha de 2 ou 3 pontos. */
export function PrimeInfo({ number }: { number: number }) {
  const factors = primeFactors(number);
  const text =
    factors.length === 0
      ? `${number} não é primo nem composto`
      : factors.length === 1
        ? `${number} é primo`
        : `${number} = ${factors.join(' × ')}`;
  return (
    <div className="prime-info">
      <span>Decomposição em primos</span>
      <strong>{text}</strong>
    </div>
  );
}
