// Reproducir el himno automáticamente al cargar la página
window.onload = function() {
    var himno = document.getElementById('himno');
    himno.play(); // Reproducir el himno cuando se carga la página
};

function actualizarReloj() {
    let now = new Date();

    // Hora en España (zona horaria GMT+1)
    let optionsEspana = { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let horaEspana = new Intl.DateTimeFormat('es-ES', optionsEspana).format(now);

    // Hora en Canarias (zona horaria GMT+0)
    let optionsCanarias = { timeZone: 'Atlantic/Canary', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let horaCanarias = new Intl.DateTimeFormat('es-ES', optionsCanarias).format(now);

    // Hora en GMT (zona horaria GMT+0)
    let optionsGMT = { timeZone: 'GMT', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let horaGMT = new Intl.DateTimeFormat('en-GB', optionsGMT).format(now);

    // Actualizar los relojes en la página
    document.getElementById('reloj-espana').innerHTML = `<strong>Hora España:</strong> <span>${horaEspana}</span>`;
    document.getElementById('reloj-canarias').innerHTML = `<strong>Hora Canarias:</strong> <span>${horaCanarias}</span>`;
    document.getElementById('reloj-gmt').innerHTML = `<strong>Hora GMT:</strong> <span>${horaGMT}</span>`;
}

// Actualizar cada segundo
setInterval(actualizarReloj, 1000);