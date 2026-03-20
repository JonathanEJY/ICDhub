/* =========================================================
   ICD HUB - BACKGROUND CENTRAL
   ========================================================= */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Escuta o aviso de que dados foram capturados (GYG, Headout ou Grayline)
    if (request.acao === "DADOS_PRONTOS") {
        
        // Procura todas as abas abertas
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                // SÓ envia a mensagem para abas do Ingresso com Desconto
                // Isso evita erros no console e melhora a performance
                if (tab.url && tab.url.includes("ingressocomdesconto.com.br")) {
                    chrome.tabs.sendMessage(tab.id, request).catch(() => {
                        // Ignora abas que ainda não carregaram o script
                    });
                }
            });
        });

        // Feedback no console do desenvolvedor para você saber que funcionou
        console.log("📢 Hub: Dados replicados para o sistema de vendas.");
        sendResponse({ status: "OK" });
    }
    return true; // Mantém o canal de comunicação estável
});