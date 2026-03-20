console.log("✅ ICD Hub: Maestro do Ingresso com Desconto Ativado");

chrome.storage.local.get(["dadosPedido", "nomeOperador", "bridgeData", "reservaGrayline", "usuarioConfigurado"], (res) => {
    if (res.dadosPedido) preencherCamposGYG(res.dadosPedido, res.nomeOperador);
    if (res.bridgeData) preencherHeadoutGrayline(res.bridgeData, res.usuarioConfigurado);
    if (res.reservaGrayline) preencherHeadoutGrayline(res.reservaGrayline, res.usuarioConfigurado);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        chrome.storage.local.get(["nomeOperador", "usuarioConfigurado"], (res) => {
            if (changes.dadosPedido?.newValue) preencherCamposGYG(changes.dadosPedido.newValue, res.nomeOperador);
            if (changes.bridgeData?.newValue) preencherHeadoutGrayline(changes.bridgeData.newValue, res.usuarioConfigurado);
            if (changes.reservaGrayline?.newValue) preencherHeadoutGrayline(changes.reservaGrayline.newValue, res.usuarioConfigurado);
        });
    }
});

const textoPadraoEmail = `Dear visitor,

Thank you for choosing us!

Your coupon is attached to this email.

We hope you enjoy your visit!

If something prevents you from visiting on your chosen date or time, you can reschedule your tickets by replying to this email or the service channels below:

WhatsApp: (11) 93328-0358 / (11) 93495-1053
Phone: (11) 3939-0435 / (21) 4063-3003

We are at your disposal!

Best regards,`;


function preencherAposTexto(numero, valor) {
    const todosElementos = Array.from(document.querySelectorAll('td, span, font, b'));
    const elementoAlvo = todosElementos.find(el => el.innerText.trim() === numero.toString());

    if (elementoAlvo) {
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select'));
        const inputCorreto = inputs.find(input => 
            elementoAlvo.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING
        );

        if (inputCorreto) {
            inputCorreto.value = valor;
            inputCorreto.dispatchEvent(new Event('input', { bubbles: true }));
            inputCorreto.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}


function preencherCamposGYG(dados, nomeOperador) {
    if (!dados) return;
    const valorCV = `${dados.gyg} - ${nomeOperador || "OPERADOR"}`;
    const campos = [
        { nome: 'sAge_Nome', valor: dados.nome },
        { nome: 'sAge_Email', valor: dados.email },
        { nome: 'sAge_CPF', valor: dados.gyg },
        { nome: '_sVen_Cartao', valor: valorCV }
    ];
    campos.forEach(c => {
        const el = document.getElementsByName(c.nome)[0];
        if (el) {
            el.value = c.valor;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    const dadosEmail = {
        email: dados.email,
        assunto: `${dados.gyg} - ${dados.nome}`,
        corpo: textoPadraoEmail
    };
    chrome.storage.local.set({ dadosParaEmail: dadosEmail });
    setTimeout(() => { chrome.storage.local.remove("dadosPedido"); }, 2000);
}

function preencherHeadoutGrayline(d, nomeUsuario) {
    if (!d || !d.nome) return;
    const operador = nomeUsuario || "Sem Nome";
    
    preencherAposTexto(2, d.nome);
    preencherAposTexto(3, d.bookingId);
    preencherAposTexto(4, d.email);
    
    const valorFormatadoCV = `${d.bookingId} - ${operador}`;
    preencherAposTexto(15, valorFormatadoCV);
    
    const dadosEmail = {
        email: d.email,
        assunto: `${d.bookingId} - ${d.nome}`,
        corpo: textoPadraoEmail
    };
    chrome.storage.local.set({ dadosParaEmail: dadosEmail });

    console.log("✅ Preenchimento concluído! Dados de e-mail preparados.");

    setTimeout(() => { 
        chrome.storage.local.remove(["bridgeData", "reservaGrayline"]); 
    }, 2000);
}

function renomear() {
    const texto = document.body.innerText;
    const regCod = /Código da Compra:\s*([A-Z0-9]+)/i;
    const regNome = /Nome Completo:\s*([^\n\r]+)/i;
    const mCod = texto.match(regCod);
    const mNome = texto.match(regNome);

    if (mCod && mNome) {
        const resultado = `${mCod[1].trim()} - ${mNome[1].trim().toUpperCase()}`;
        document.title = resultado;
        if (window.top !== window.self) window.top.document.title = resultado;
    }
}
setInterval(renomear, 1000);