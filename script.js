document.addEventListener('DOMContentLoaded', function () {
    // Configuração da chave pública do Mercado Pago
    const PUBLIC_KEY = 'TEST-ca22cadb-6c68-4bae-8fef-cb3b309a4efe'; // Substitua pela sua chave pública do Mercado Pago
    const pontosSelect = document.getElementById('pontos');
    const dinheiroSpan = document.getElementById('dinheiro');
    const buttonContainer = document.getElementById('button-container');

    // Configura o Mercado Pago
    mercadopago.configure({
        public_key: PUBLIC_KEY
    });

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
        // Requisita a criação da preferência de pagamento
        fetch('/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valor: valor.replace(',', '.') })
        })
        .then(response => response.json())
        .then(data => {
            // Configura o botão de pagamento com a preferência criada
            mercadopago.checkout({
                preference: {
                    id: data.id
                },
                render: {
                    container: '#button-container',
                    label: 'Pagar com Mercado Pago'
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao iniciar o checkout. Tente novamente.');
        });
    }

    pontosSelect.addEventListener('change', converterPontos);
});
