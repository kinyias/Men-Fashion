export function formatCurrency(amount: number) {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    return formatted + 'đ';
  }
  export function formatNumber(value: number): string {
    return new Intl.NumberFormat('de-DE').format(value);
}
export function parseCurrency(value: string): string {
    return String(value.replace(/[^\d]/g, ''));
}