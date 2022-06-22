export const formatoFecha = (date: string) => {
    return new Date(date).toLocaleTimeString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).replace(/(^\w{1})|(\s+\w{1})/g, (letra: any) => letra.toUpperCase());
}


export const upperCaseConvert = (value: string) => {

    return value.toUpperCase();

}