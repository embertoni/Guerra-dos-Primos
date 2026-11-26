/** Fatores primos em ordem crescente, com repetição (12 → [2, 2, 3]). */
export function primeFactors(value: number): number[] {
  if (!Number.isInteger(value) || value < 2) return [];
  const factors: number[] = [];
  let rest = value;
  for (let divisor = 2; divisor * divisor <= rest; divisor++)
    while (rest % divisor === 0) {
      factors.push(divisor);
      rest /= divisor;
    }
  if (rest > 1) factors.push(rest);
  return factors;
}