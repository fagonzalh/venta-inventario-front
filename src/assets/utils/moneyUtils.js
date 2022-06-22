
function milesNumeros(numero) {
    return numero.toString().replace(/(\.\d+)|\B(?=(\d{3})+(?!\d))/g, function (m, g1) {
        return g1 || ","
    });
};


export const formatMoney = (value) => {
    var formateado = Number(value).toFixed(2)
    formateado = milesNumeros(formateado);
    return formateado
}


