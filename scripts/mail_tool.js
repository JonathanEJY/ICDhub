function preencherWebmail() {
    chrome.storage.local.get(["dadosParaEmail"], (res) => {
        const dados = res.dadosParaEmail;
        if (!dados) {
            console.log("ℹ️ Nenhum dado de e-mail pendente no Hub.");
            return;
        }

        console.log("📧 ICD Hub: Iniciando preenchimento do e-mail...");

        if (dados.modo === 'CCO') {
            const btnBcc = document.querySelector('.add-bcc, #compose-add-bcc, [data-event="add-bcc"]');
            if (btnBcc) btnBcc.click();

            setTimeout(() => {
                const campoCCO = document.querySelector('textarea[name="_bcc"], #_bcc, .recipient-input[data-type="bcc"] input');
                if (campoCCO) {
                    campoCCO.value = dados.email; 
                    campoCCO.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, 500);
        } else {
            const campoPara = document.querySelector('input[name="_to"], .recipient-input input, #_to');
            if (campoPara) {
                campoPara.value = dados.email;
                campoPara.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        const campoAssunto = document.querySelector('input[name="_subject"], #compose-subject');
        if (campoAssunto) {
            campoAssunto.value = dados.assunto;
            campoAssunto.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const editorSimples = document.getElementById('composebody');
        const iframeEditor = document.querySelector('.cke_wysiwyg_frame, #composebody_ifr');

        if (iframeEditor && iframeEditor.contentDocument) {

            const doc = iframeEditor.contentDocument;
            if (doc.body) {
                const textoHub = dados.corpo.replace(/\n/g, '<br>');
                const conteudoAtual = doc.body.innerHTML;

                if (!conteudoAtual.includes(textoHub.substring(0, 10))) {
                    doc.body.innerHTML = `${textoHub}<br><br>${conteudoAtual}`;
                }
            }
        } else if (editorSimples) {
            const conteudoAtual = editorSimples.value;
            if (!conteudoAtual.includes(dados.corpo.substring(0, 10))) {
                editorSimples.value = `${dados.corpo}\n\n${conteudoAtual}`;
                editorSimples.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        console.log("✅ E-mail preenchido preservando assinatura!");

        setTimeout(() => {
            chrome.storage.local.remove("dadosParaEmail");
        }, 2000);
    });
}

if (window.location.href.includes('_action=compose') || window.location.href.includes('task=mail')) {

    setTimeout(preencherWebmail, 2000);
    setTimeout(preencherWebmail, 4000); 
}