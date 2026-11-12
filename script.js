const fotos = [
    { src: "imagens/foto1.jpg", alt: "Registro do cotidiano" },
    { src: "imagens/foto2.jpg", alt: "Olhar sobre a escola" },
    { src: "imagens/foto3.jpg", alt: "Momento coletivo" },
    { src: "imagens/foto4.jpg", alt: "Luz e sombra" },
    { src: "imagens/foto5.jpg", alt: "Detalhes" },
    { src: "imagens/foto6.jpg", alt: "Retrato" }
];

// ===== ELEMENTOS =====
const galeria = document.getElementById("galeria");
const lightbox = document.getElementById("lightbox");
const imagemAmpliada = document.getElementById("imagem-ampliada");
const fechar = document.getElementById("fechar");
const btnAnterior = document.getElementById("anterior");
const btnProxima = document.getElementById("proxima");
const contador = document.getElementById("contador");

// ===== ESTADO =====
let indiceAtual = 0;
let ultimoFoco = null;

// ===== RENDERIZAR GALERIA =====
function renderizarGaleria() {
    galeria.innerHTML = "";

    fotos.forEach((foto, index) => {
        const div = document.createElement("div");
        div.classList.add("foto");
        div.setAttribute("role", "button");
        div.setAttribute("tabindex", "0");
        div.setAttribute("aria-label", `Abrir foto: ${foto.alt}`);

        const img = document.createElement("img");
        img.src = foto.src;
        img.alt = foto.alt;
        img.loading = "lazy";

        // Fallback se a imagem não existir
        img.addEventListener("error", () => {
            img.src = "imagens/placeholder.jpg";
            img.alt = "Imagem indisponível";
        });

        // Clique abre o lightbox
        div.addEventListener("click", () => abrirLightbox(index));

        // Acessibilidade: Enter/Espaço também abrem
        div.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                abrirLightbox(index);
            }
        });

        div.appendChild(img);
        galeria.appendChild(div);
    });
}

// ===== LIGHTBOX =====
function abrirLightbox(index) {
    ultimoFoco = document.activeElement;
    indiceAtual = index;
    atualizarLightbox();
    lightbox.classList.add("ativo");
    lightbox.setAttribute("aria-hidden", "false");
    fechar.focus();
}

function fecharLightbox() {
    lightbox.classList.remove("ativo");
    lightbox.setAttribute("aria-hidden", "true");
    imagemAmpliada.src = "";
    if (ultimoFoco) ultimoFoco.focus();
}

function atualizarLightbox() {
    const foto = fotos[indiceAtual];
    imagemAmpliada.src = foto.src;
    imagemAmpliada.alt = foto.alt;

    if (contador) {
        contador.textContent = `${indiceAtual + 1} / ${fotos.length}`;
    }
}

function proximaFoto() {
    indiceAtual = (indiceAtual + 1) % fotos.length;
    atualizarLightbox();
}

function fotoAnterior() {
    indiceAtual = (indiceAtual - 1 + fotos.length) % fotos.length;
    atualizarLightbox();
}

// ===== EVENTOS =====
fechar.addEventListener("click", fecharLightbox);

if (btnProxima) btnProxima.addEventListener("click", (e) => {
    e.stopPropagation();
    proximaFoto();
});

if (btnAnterior) btnAnterior.addEventListener("click", (e) => {
    e.stopPropagation();
    fotoAnterior();
});

// Clique fora da imagem fecha
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fecharLightbox();
});

// Teclado
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("ativo")) return;

    switch (e.key) {
        case "Escape":
            fecharLightbox();
            break;
        case "ArrowRight":
            proximaFoto();
            break;
        case "ArrowLeft":
            fotoAnterior();
            break;
    }
});

// ===== INICIAR =====
renderizarGaleria();