document.addEventListener('DOMContentLoaded', () => {
    const listaBotoesDiv = document.getElementById('listaBotoes');
    const inputArquivo = document.getElementById('inputArquivo');
    const editIndexField = document.getElementById('editIndex');
    const tituloForm = document.getElementById('tituloForm');
    const btnCancelar = document.getElementById('btnCancelarEdicao');
    const seletorPosicao = document.getElementById('posicaoBarra');
    const btnSalvarPref = document.getElementById('btnSalvarPref');
    
    let configBotoes = [];
    let dragSrcIndex = null; // Controle de arrasto

    chrome.storage.local.get(['configMaster', 'posicaoBarra'], (res) => {
        if (res.configMaster) {
            configBotoes = res.configMaster;
            renderizarLista();
        }
        if (res.posicaoBarra) {
            seletorPosicao.value = res.posicaoBarra;
        }
    });

    btnSalvarPref.onclick = () => {
        const posicao = seletorPosicao.value;
        chrome.storage.local.set({ posicaoBarra: posicao }, () => {
            alert("✅ Preferência de posição salva! Atualize o WhatsApp para aplicar a mudança.");
        });
    };

    document.getElementById('btnAdicionarBotao').onclick = () => {
        const nome = document.getElementById('novoNomeBotao').value.trim();
        const texto = document.getElementById('novoTextoBotao').value.trim();
        const imagem = document.getElementById('novaImagemBotao').value.trim();
        const idx = parseInt(editIndexField.value);

        if (nome && texto) {
            const dadosBotao = { 
                id: idx === -1 ? "custom_" + Date.now() : configBotoes[idx].id, 
                nome, 
                texto, 
                imagem: imagem || null,
                isExtra: true 
            };

            if (idx === -1) {
                configBotoes.push(dadosBotao);
            } else {
                configBotoes[idx] = dadosBotao;
            }

            salvar();
            limparFormulario();
        } else {
            alert("Por favor, preencha pelo menos o nome e o texto da mensagem.");
        }
    };

    function renderizarLista() {
        if (!listaBotoesDiv) return;
        listaBotoesDiv.innerHTML = "";

        configBotoes.forEach((btn, index) => {
            const item = document.createElement('div');
            item.className = 'item-lista';
            item.draggable = true; 
            item.dataset.index = index;

            item.innerHTML = `
                <div class="drag-handle" title="Arraste para reordenar">☰</div>
                <div class="info">
                    <strong>${btn.nome} ${btn.imagem ? '🖼️' : ''}</strong>
                    <p>${btn.texto.substring(0, 50)}...</p>
                </div>
                <div class="acoes">
                    <button class="btn-edit" data-index="${index}">Editar</button>
                    <button class="btn-del" data-index="${index}">Excluir</button>
                </div>
            `;
            
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);

            listaBotoesDiv.appendChild(item);
        });


        document.querySelectorAll('.btn-edit').forEach(b => {
            b.onclick = (e) => preencherParaEditar(e.target.dataset.index);
        });

        document.querySelectorAll('.btn-del').forEach(b => {
            b.onclick = (e) => {
                if(confirm("Deseja realmente excluir este atalho?")) {
                    configBotoes.splice(e.target.dataset.index, 1);
                    salvar();
                }
            };
        });
    }

    function handleDragStart(e) {
        dragSrcIndex = this.dataset.index;
        this.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();
        
        const targetIndex = this.dataset.index;

        if (dragSrcIndex !== targetIndex) {
            const movedItem = configBotoes.splice(dragSrcIndex, 1)[0];
            configBotoes.splice(targetIndex, 0, movedItem);
            salvar();
        }
        return false;
    }

    function handleDragEnd() {
        this.style.opacity = '1';
    }

    function preencherParaEditar(index) {
        const btn = configBotoes[index];
        document.getElementById('novoNomeBotao').value = btn.nome;
        document.getElementById('novoTextoBotao').value = btn.texto;
        document.getElementById('novaImagemBotao').value = btn.imagem || "";
        editIndexField.value = index;
        
        tituloForm.innerText = "📝 Editando Atalho";
        btnCancelar.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function limparFormulario() {
        document.getElementById('novoNomeBotao').value = "";
        document.getElementById('novoTextoBotao').value = "";
        document.getElementById('novaImagemBotao').value = "";
        editIndexField.value = "-1";
        tituloForm.innerText = "➕ Adicionar Novo Atalho";
        btnCancelar.style.display = "none";
    }

    btnCancelar.onclick = limparFormulario;

    function salvar() {
        chrome.storage.local.set({ configMaster: configBotoes }, () => {
            renderizarLista();
        });
    }

    document.getElementById('btnExportar').onclick = () => {
        if (configBotoes.length === 0) return alert("Não há dados para exportar.");
        const blob = new Blob([JSON.stringify(configBotoes, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; 
        a.download = 'backup_botoes_icd.json'; 
        a.click();
        URL.revokeObjectURL(url);
    };

    document.getElementById('btnImportar').onclick = () => inputArquivo.click();
    
    inputArquivo.onchange = (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const dados = JSON.parse(ev.target.result);
                if (Array.isArray(dados)) {
                    configBotoes = dados;
                    salvar();
                    alert("✅ Importação concluída com sucesso!");
                }
            } catch (err) {
                alert("Erro ao ler o arquivo.");
            }
        };
        reader.readAsText(arquivo);
        inputArquivo.value = "";
    };
});

chrome.storage.local.get(['emailAssunto', 'emailCorpo'], (res) => {
    if (res.emailAssunto) document.getElementById('emailAssuntoPadrao').value = res.emailAssunto;
    if (res.emailCorpo) document.getElementById('emailCorpoPadrao').value = res.emailCorpo;
});


document.getElementById('btnSalvarEmailConfig').onclick = () => {
    const assunto = document.getElementById('emailAssuntoPadrao').value;
    const corpo = document.getElementById('emailCorpoPadrao').value;
    chrome.storage.local.set({ emailAssunto: assunto, emailCorpo: corpo }, () => {
        alert("Configurações de e-mail salvas!");
    });
};