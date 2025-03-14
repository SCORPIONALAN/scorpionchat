export function tiempoFormato(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour:'2-digit',
        minute:'2-digit',
        hour12: false,
    })
}