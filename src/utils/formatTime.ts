import { format } from "date-fns";
import { vi } from 'date-fns/locale';
export function formatHoursToDays(hours: number): string {
    const days = hours / 24.0;
    
    if (hours < 24) {
        return `${hours} giờ`;
    }
    if (hours % 24 === 12) {
        const wholeDays = Math.floor(days);
        return `${wholeDays + 0.5} ngày`;
    }
    
    if (hours % 24 === 0) {
        return `${days} ngày`;
    }
    

    return `${days}day`;
}
export function formatDate(date: string | Date){
    return format(date, 'dd/MM/yyyy', { locale: vi })
}