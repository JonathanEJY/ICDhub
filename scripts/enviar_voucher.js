if (!document.getElementById('btn-abrir-mail')) {
    const btn = document.createElement("button");
    btn.id = 'btn-abrir-mail';
    btn.innerText = "📧 Abrir Webmail Locaweb";
    btn.style = "position:fixed;bottom:20px;right:20px;z-index:9999;padding:15px;background:#612d87;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
    btn.onclick = () => window.open("https://webmail-seguro.com.br/?_task=mail&_action=compose", "_blank");
    document.body.appendChild(btn);
}

chrome.storage.local.get(["dadosPedido", "nomeOperador", "bridgeData", "reservaGrayline", "usuarioConfigurado"], (res) => {
    if (res.dadosPedido) preencherCamposGYG(res.dadosPedido, res.nomeOperador);
    if (res.bridgeData) preencherHeadoutGrayline(res.bridgeData, res.usuarioConfigurado);
    if (res.reservaGrayline) preencherHeadoutGrayline(res.reservaGrayline, res.usuarioConfigurado);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        chrome.storage.local.get(["nomeOperador", "usuarioConfigurado"], (res) => {
            if (changes.dadosPedido?.newValue) {
                preencherCamposGYG(changes.dadosPedido.newValue, res.nomeOperador);
            }
            if (changes.bridgeData?.newValue) {
                preencherHeadoutGrayline(changes.bridgeData.newValue, res.usuarioConfigurado);
            }
            if (changes.reservaGrayline?.newValue) {
                preencherHeadoutGrayline(changes.reservaGrayline.newValue, res.usuarioConfigurado);
            }
        });
    }
});