const textosPadrao = {
    apresentacao: "Olá! Bem-vindo ao nosso atendimento. Como posso ajudar?",
    valor: "Trem do Corcovado – Informações e Valores...",
    documentos: "Para realizar a sua reserva vamos precisar dos seguintes dados...",
    remarcacao: "Para remarcar seu passeio, solicitamos as seguintes informações...",
    estorno: "Para cancelamento e estorno o(a) senhor(a) precisa encaminhar um e-mail...",
    pix: "——— - Trem do Corcovado - PIX\n\nO link de pagamento expira em 30 minutos.",
    cartao: "——— - Trem do Corcovado - Cartão de Crédito\n\nO link de pagamento expira em 30 minutos.",
    autorizacao: "Para continuar com a reserva vou precisar que você preencha uma autorização de débito...",
    anexo: "Anexo seu voucher!\nTenha um ótimo passeio!",
    app: "Tente pelo nosso app!\n\nANDROID - https://play.google.com/store/apps/details?id=com.ingressoscomdescontos.TremdoCorcovado"
};

const menu = document.createElement('div');
menu.id = 'menu-automacao-hub';

function enviarTexto(txt) {
    const textarea = document.querySelector('div[contenteditable="true"][data-tab="10"]');
    if (textarea) {
        textarea.focus();
        const dt = new DataTransfer();
        dt.setData('text/plain', txt);
        const ev = new ClipboardEvent('paste', { 
            clipboardData: dt, 
            bubbles: true, 
            cancelable: true 
        });
        textarea.dispatchEvent(ev);
    }
}

menu.innerHTML = `
    <div id="aba-gatilho">◀</div>
    <div class="titulo-hub">ATALHOS ICD</div>
    <input type="text" id="busca-botoes" placeholder="🔍 Buscar atalho..." style="width: 90%; margin: 0 auto 15px auto; padding: 8px; border-radius: 5px; border: 1px solid #ddd; display: block; font-size: 12px;">
    <div id="container-botoes-hub"></div>
`;

document.body.appendChild(menu);
const aba = document.getElementById('aba-gatilho');

function aplicarPosicao() {
    chrome.storage.local.get(['posicaoBarra'], (res) => {
        const posicao = res.posicaoBarra || 'direita';
        menu.classList.remove('pos-direita', 'pos-esquerda', 'pos-topo');
        menu.classList.add(`pos-${posicao}`);
        
        if (posicao === 'direita') aba.innerText = '◀';
        if (posicao === 'esquerda') aba.innerText = '▶';
        if (posicao === 'topo') aba.innerText = '▼';
    });
}

aba.onclick = () => {
    const estaAberto = menu.classList.toggle('aberto');
    chrome.storage.local.get(['posicaoBarra'], (res) => {
        const p = res.posicaoBarra || 'direita';
        if (p === 'direita') aba.innerText = estaAberto ? '▶' : '◀';
        if (p === 'esquerda') aba.innerText = estaAberto ? '◀' : '▶';
        if (p === 'topo') aba.innerText = estaAberto ? '▲' : '▼';
    });
};

function handleImageDragBase64(e, imgElement, urlImagem) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        ctx.drawImage(imgElement, 0, 0);

        const dataURL = canvas.toDataURL('image/png');
        const nomeArquivo = `icd_doc_${Date.now()}.png`;
        
        e.dataTransfer.setData('DownloadURL', `image/png:${nomeArquivo}:${dataURL}`);
        
    
        e.dataTransfer.setData('text/uri-list', urlImagem);
    } catch (err) {

        e.dataTransfer.setData('text/plain', urlImagem);
    }
}

function carregarBotoes() {
    chrome.storage.local.get(['configMaster'], (res) => {
        const container = document.getElementById('container-botoes-hub');
        const inputBusca = document.getElementById('busca-botoes');
        const botoes = res.configMaster || [];

        function renderizar(filtro = "") {
            container.innerHTML = "";
            const filtrados = botoes.filter(b => b.nome.toLowerCase().includes(filtro.toLowerCase()));

            if (filtrados.length === 0) {
                container.innerHTML = '<p style="font-size:11px; color:#666; text-align:center; padding: 10px;">Nenhum atalho encontrado.</p>';
                return;
            }

            filtrados.forEach(b => {
                const btnWrapper = document.createElement('div');
                btnWrapper.style = "display: flex; align-items: center; gap: 5px; margin-bottom: 8px; padding: 0 10px;";

                const btn = document.createElement('button');
                btn.className = 'btn-atalho-hub';
                btn.style = "flex: 1; display: flex; align-items: center; justify-content: center;";
                btn.innerText = b.nome;
                
                const urlImagem = b.imagem || b.linkFoto;

                if (urlImagem) {
                    btn.innerHTML = `<span>🖼️</span> <span style="margin-left:5px">${b.nome}</span>`;
                    
                    const imgPreview = document.createElement('img');
                    imgPreview.src = urlImagem;
                    imgPreview.crossOrigin = "anonymous"; // evitar erros de segurança ao desenhar no canvas
                    imgPreview.title = "Clique e arraste para enviar esta imagem";
                    imgPreview.draggable = true;
                    imgPreview.style = "width: 35px; height: 35px; border-radius: 4px; cursor: grab; border: 2px solid #612d87; object-fit: cover; background: white;";
                    
                    imgPreview.addEventListener('dragstart', (e) => { 
                        imgPreview.style.opacity = "0.5";
                        handleImageDragBase64(e, imgPreview, urlImagem);
                    });

                    imgPreview.addEventListener('dragend', (e) => { 
                        imgPreview.style.opacity = "1"; 
                    });

                    btnWrapper.appendChild(imgPreview);
                }

                btn.onclick = () => enviarTexto(b.texto || textosPadrao[b.id] || "");
                btnWrapper.prepend(btn); 
                container.appendChild(btnWrapper);
            });
        }

        inputBusca.oninput = (e) => renderizar(e.target.value);
        renderizar();
    });
}

aplicarPosicao();
carregarBotoes();

chrome.storage.onChanged.addListener((changes) => {
    if (changes.configMaster) carregarBotoes();
    if (changes.posicaoBarra) aplicarPosicao();
});