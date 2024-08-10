document.addEventListener('DOMContentLoaded', function () {
    // Configuração da chave pública do Mercado Pago
    const PUBLIC_KEY = 'TEST-ca22cadb-6c68-4bae-8fef-cb3b309a4efe'; // Substitua pela sua chave pública do Mercado Pago
    const pontosSelect = document.getElementById('pontos');
    const dinheiroSpan = document.getElementById('dinheiro');
    const buttonContainer = document.getElementById('button-container');

    function converterPontos() {
        const pontos = pontosSelect.value;
        const taxa = 70; // 1000 pontos = 70 dinheiros
        const dinheiro = (pontos / 1000) * taxa;

        // Formatar o valor com ponto como separador de milhares
        const dinheiroFormatado = dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        dinheiroSpan.innerText = dinheiroFormatado;
        iniciarCheckout(dinheiro);
    }

    function iniciarCheckout(valor) {
        // Configuração do Mercado Pago
        mercadopago.configure({
            public_key: PUBLIC_KEY
        });

        // Criação do botão de pagamento
        mercadopago.checkout({
            preference: {
                auto_return: 'approved',
                back_urls: {
                    success: 'https://www.seusite.com.br/success',
                    failure: 'https://www.seusite.com.br/failure',
                    pending: 'https://www.seusite.com.br/pending'
                },
                items: [{
                    title: 'Compra de Pontos',
                    unit_price: parseFloat(valor.replace(',', '.')),
                    quantity: 1
                }]
            },
            render: {
                container: '#button-container',
                label: 'Pagar com Mercado Pago'
            }
        });
    }

    pontosSelect.addEventListener('change', converterPontos);
});
