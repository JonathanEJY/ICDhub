function extrairDados() {
    // 1. Captura o Código GYG
    const codigoGYG = document.body.innerText.match(/GYG[A-Z0-9]+/)?.[0] || "";
    
    // 2. Captura o Nome (Lead Traveler)
    const elementos = Array.from(document.querySelectorAll('span, div, b, td, p'));
    const leadTravelerLabel = elementos.find(el => el.innerText.trim() === "Lead traveler");
    
    let nomeCompleto = "";
    if (leadTravelerLabel) {
        nomeCompleto = leadTravelerLabel.parentElement.innerText
            .replace("Lead traveler", "")
            .split('(')[0]
            .trim()
            .toUpperCase();
    }

    // 3. Captura o E-mail (Mascara do GYG)
    const emailMatch = document.body.innerText.match(/customer-[\w.-]+@[\w.-]+/);
    const email = emailMatch ? emailMatch[0] : "";

    // 4. Captura o Telefone (Baseado no seu print do link 'tel:')
    const linkTelefone = document.querySelector('a[href^="tel:"]');
    const telefone = linkTelefone ? linkTelefone.innerText.trim() : "";

    if (nomeCompleto && codigoGYG) {
        const dados = { 
            nome: nomeCompleto, 
            email: email, 
            gyg: codigoGYG,
            telefone: telefone, // <-- NOVO CAMPO ADICIONADO
            origem: "GETYOURGUIDE" 
        };
        
        // Salva no storage para o Maestro capturar
        chrome.storage.local.set({ dadosPedido: dados }, () => {
            try {
                chrome.runtime.sendMessage({ acao: "DADOS_PRONTOS", dados: dados });
            } catch (e) { 
                console.log("Aviso: Hub ainda não detectou a mensagem, mas os dados foram salvos no storage."); 
            }

            // Alerta de sucesso atualizado para mostrar o telefone capturado
            alert(`✅ Capturado com Sucesso!\n👤 ${nomeCompleto}\n🎫 ${codigoGYG}\n📞 ${telefone || "Não encontrado"}`);
        });
    } else {
        alert("⚠️ Dados não encontrados. Certifique-se de que a reserva está aberta na tela.");
    }
}

function renderizarBotao() {
    if (document.getElementById('btn-copy-gyg')) return;
    
    const btn = document.createElement("button");
    btn.id = 'btn-copy-gyg';
    
    const logoUrl = chrome.runtime.getURL("icon.png"); 
    
    btn.innerHTML = `
        <img src="${logoUrl}" style="width:24px;height:24px;margin-right:10px;border-radius:4px;">
        <span>COPIAR PARA INGRESSO</span>
    `;
    
    btn.style = "position:fixed;top:100px;right:20px;z-index:9999;padding:12px 20px;background:#ff5a00;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;display:flex;align-items:center;box-shadow: 0 4px 15px rgba(0,0,0,0.4);font-family: Arial;";
    
    btn.onclick = extrairDados;
    document.body.appendChild(btn);
}

renderizarBotao();
// Reforço caso a página demore a carregar
setTimeout(renderizarBotao, 3000);