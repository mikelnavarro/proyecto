        let votos = {};
        let imagenes = {};
        let eleccionesCerradas = false;
        let escañosTotales = parseInt(document.getElementById('escanos').value);
        let censoElectoral = parseInt(document.getElementById('censo').value);
        let grafico;

        function agregarCandidato() {
            let nombre = document.getElementById("nuevoCandidato").value.trim();
            let imagen = document.getElementById("imagenCandidato").files[0];

            if (nombre && !votos[nombre]) {
                votos[nombre] = 0;
                if (imagen) {
                    let reader = new FileReader();
                    reader.onload = function(event) {
                        imagenes[nombre] = event.target.result;
                    };
                    reader.readAsDataURL(imagen);
                }

                let contenedor = document.getElementById("candidatos");
                let div = document.createElement("div");
                div.classList.add("candidate");
                div.innerHTML = `
                    <span>${nombre}</span>
                    <input type="number" id="input-${nombre}" value="0" min="0">
                    <button onclick="registrarVotos('${nombre}')">Registrar</button>
                `;
                contenedor.appendChild(div);
                document.getElementById("nuevoCandidato").value = "";
                actualizarResultados();
            }
        }

        function registrarVotos(candidato) {
            if (eleccionesCerradas) return alert("Las elecciones han finalizado.");
            let cantidad = parseInt(document.getElementById(`input-${candidato}`).value);
            if (cantidad >= 0) {
                votos[candidato] += cantidad;
                actualizarResultados();
            }
        }

        function actualizarEscanos() {
            escañosTotales = parseInt(document.getElementById('escanos').value);
            censoElectoral = parseInt(document.getElementById('censo').value);
            actualizarResultados();
        }

        function actualizarResultados() {
            let totalVotos = Object.values(votos).reduce((a, b) => a + b, 0);
            let resultadoTexto = "Distribución de escaños:<br>";
            for (let candidato in votos) {
                let porcentaje = totalVotos > 0 ? (votos[candidato] / totalVotos) : 0;
                let escañosAsignados = Math.round(porcentaje * escañosTotales);
                resultadoTexto += `${candidato}: ${votos[candidato]} votos - ${escañosAsignados} escaños<br>`;
            }
            let participacion = ((totalVotos / censoElectoral) * 100).toFixed(2);
            document.getElementById('resultado').innerHTML = resultadoTexto;
            document.getElementById("totalVotos").innerText = `Total de votos: ${totalVotos}`;
            document.getElementById('participacion').innerText = `Participación: ${participacion}%`;

            actualizarGrafico();
        }

        function finalizarElecciones() {
            eleccionesCerradas = true;
            alert("Elecciones cerradas. No se permiten más votos.");
        }

        function generarPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("Resultados Electorales", 10, 10);
    
    let votosTotales = Object.values(votos).reduce((a, b) => a + b, 0);
    let y = 20;
    doc.text(`Total de votos emitidos: ${votosTotales}`, 10, y);
    y += 10;

    for (let candidato in votos) {
        let totalVotos = votos[candidato];
        let porcentaje = votosTotales > 0 ? ((totalVotos / votosTotales) * 100).toFixed(2) : 0;
        let escañosAsignados = Math.round((totalVotos / votosTotales) * escañosTotales);

        doc.text(`${candidato}: ${totalVotos} votos (${porcentaje}%) - ${escañosAsignados} escaños`, 10, y);
        y += 10;
    }

    let participacion = ((votosTotales / censoElectoral) * 100).toFixed(2);
    doc.text(`Participación: ${participacion}%`, 10, y + 10);

    doc.save("resultados_elecciones.pdf");
}



        function generarJSON() {
            let datos = { votos, escañosTotales, censoElectoral };
            let blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "resultados.json";
            a.click();
        }

        function importarDatos() {
            let file = document.getElementById("importarJSON").files[0];
            let reader = new FileReader();
            reader.onload = function(event) {
                let data = JSON.parse(event.target.result);
                votos = data.votos;
                escañosTotales = data.escañosTotales;
                censoElectoral = data.censoElectoral;
                actualizarResultados();
            };
            reader.readAsText(file);
        }

        function actualizarGrafico() {
            let ctx = document.getElementById("graficoResultados").getContext("2d");
            if (grafico) grafico.destroy();
            grafico = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: Object.keys(votos),
                    datasets: [{ data: Object.values(votos), backgroundColor: "blue" }]
                }
            });
        }