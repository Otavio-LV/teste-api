document.addEventListener('DOMContentLoaded', function () {
    const PUBLIC_KEY = 'TEST-ca22cadb-6c68-4bae-8fef-cb3b309a4efe'; // Substitua pela sua chave pública do Mercado Pago
    const pontosSelect = document.getElementById('pontos');
    const dinheiroSpan = document.getElementById('dinheiro');
    const buttonContainer = document.getElementById('button-container');

    mercadopago.configure({
        public_key: PUBLIC_KEY
    });

    function converterPontos() {
        const pontos = pontosSelect.value;
        const taxa = 70; // 1000 pontos = 70 dinheiros
        const dinheiro = (pontos / 1000) * taxa;

        const dinheiroFormatado = dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        dinheiroSpan.innerText = dinheiroFormatado;
        iniciarCheckout(dinheiro);
    }

    function iniciarCheckout(valor) {
        fetch('/create_preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valor: valor.replace(',', '.') })
        })
        .then(response => response.json())
        .then(data => {
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
