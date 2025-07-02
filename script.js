// Exemplo de efeito de digitação (opcional)
document.addEventListener("DOMContentLoaded", function () {
    const pre = document.getElementById("output");
    const text = pre.textContent;
    pre.textContent = "";
    let i = 0;

    function type() {
        if (i < text.length) {
            pre.textContent += text.charAt(i);
            i++;
            setTimeout(type, 10); // velocidade
        }
    }

    type();
});
