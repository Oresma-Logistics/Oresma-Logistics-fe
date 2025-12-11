export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return "";

  const first = accountNumber.slice(0, 2);
  const last = accountNumber.slice(-3);
  const masked = "*".repeat(accountNumber.length - 5);

  return `${first}${masked}${last}`;
}
