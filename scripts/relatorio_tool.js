function injetarFerramentasRelatorio() {

    const btnMassa = document.createElement('button');
    btnMassa.innerText = "📧 Enviar p/ Selecionados (CCO)";
    btnMassa.style = "position: fixed; top: 20px; right: 20px; z-index: 10001; padding: 12px 20px; background: #612d87; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;";
    
    btnMassa.onmouseover = () => btnMassa.style.transform = "scale(1.05)";
    btnMassa.onmouseout = () => btnMassa.style.transform = "scale(1)";
    btnMassa.onclick = dispararEmMassa;
    
    document.body.appendChild(btnMassa);


    const linhas = document.querySelectorAll('table tr'); 

    linhas.forEach((linha, index) => {
        const celulas = linha.querySelectorAll('td');
        

        if (celulas.length >= 5) {
            const nomeCliente = celulas[2]?.innerText.trim();
            const emailCliente = celulas[3]?.innerText.trim();

            if (emailCliente && emailCliente.includes('@')) {

                const tdCheck = document.createElement('td');
                tdCheck.style.textAlign = "center";
                tdCheck.innerHTML = `<input type="checkbox" class="check-email-icd" value="${emailCliente}" data-nome="${nomeCliente}" style="width:18px; height:18px; cursor:pointer;">`;
                linha.prepend(tdCheck);


                const tdBtn = document.createElement('td');
                const btnIndiv = document.createElement('button');
                btnIndiv.innerText = "📧 Enviar";
                btnIndiv.style = "padding: 5px 10px; cursor: pointer; background: #34B7F1; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold;";
                btnIndiv.onclick = () => prepararEnvioCCO([emailCliente]);
                tdBtn.appendChild(btnIndiv);
                linha.appendChild(tdBtn);
            } else if (index === 0 || celulas.length > 1) {
                const tdVazio = document.createElement('td');
                linha.prepend(tdVazio);
            }
        }
    });
}

async function prepararEnvioCCO(listaEmails) {
    const res = await chrome.storage.local.get(['emailAssunto', 'emailCorpo']);
    
    if (!res.emailAssunto || !res.emailCorpo) {
        alert("⚠️ Por favor, configure o Assunto e o Corpo do e-mail no Painel de Controle!");
        return;
    }

    const destinatariosCCO = listaEmails.join(', ');

    chrome.storage.local.set({
        dadosParaEmail: {
            modo: 'CCO',
            email: destinatariosCCO, 
            assunto: res.emailAssunto,
            corpo: res.emailCorpo
        }
    }, () => {
        window.open('https://webmail-seguro.com.br/?_task=mail&_action=compose', '_blank');
    });
}

function dispararEmMassa() {
    const selecionados = document.querySelectorAll('.check-email-icd:checked');
    const lista = Array.from(selecionados).map(cb => cb.value);

    if (lista.length === 0) {
        return alert("Selecione pelo menos um cliente na lista!");
    }
    
    prepararEnvioCCO(lista);
}

setTimeout(injetarFerramentasRelatorio, 2000);