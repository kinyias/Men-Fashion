export function formatCurrency(amount: number) {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    return formatted + 'đ';
  }