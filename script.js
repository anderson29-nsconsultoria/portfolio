const output = document.getElementById("output");

const text = `
root@nsconsultoria.tech:~# PORTFÓLIO PROFISSIONAL

> SOBRE MIM
Sou estudante  em Cibersegurança, com foco em análise de vulnerabilidades, hardening de sistemas, automação e hacking ético.

> FERRAMENTAS DOMINADAS
- Nmap, Nikto, WhatWeb, Dirb, Gobuster
- Fail2Ban, ClamAV, Proxychains
- Kali Linux, Burp Suite, Metasploit

> PROJETOS EM DESTAQUE
[+] vulnscanner — Scanner Web com análise integrada
[+] monitor_vulnerabilidades — Painel de segurança em tempo real
[+] Proxychains Suite — Roteamento seguro para varreduras

> CONTATO
Email: anderson.souza@nsconsultoria.tech
GitHub: github.com/anderson29-nsconsultoria
`;

let i = 0;

function typeText() {
    if (i < text.length) {
        output.textContent += text[i];
        i++;
        setTimeout(typeText, 20);
    }
}
typeText();
