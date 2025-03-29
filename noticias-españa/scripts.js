    function mostrarInfo() {
        var info = document.getElementById("infoExtra");
        if (info.classList.contains("hidden")) {
            info.classList.remove("hidden");
        } else {
            info.classList.add("hidden");
        }
    }