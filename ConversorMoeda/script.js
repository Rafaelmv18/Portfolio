async function converter() {
    const valor = parseFloat(document.getElementById('valor').value);
    const de = document.getElementById('deMoeda').value;
    const para = document.getElementById('paraMoeda').value;
    const resultado = document.getElementById('result');

    if (isNaN(valor) || valor <= 0) {
        resultado.textContent = 'Valor inválido!';
        resultado.style.display = "flex";
        return;
    }

    if (de === para) {
        resultado.textContent = 'Selecione moedas diferentes!';
        resultado.style.display = "flex";
        return;
    }

    try {
        const url = `https://economia.awesomeapi.com.br/last/${de}-${para}`;
        const res = await fetch(url);
        const data = await res.json();

        const chave = `${de}${para}`;
        if (data[chave]) {
            const cotacao = parseFloat(data[chave].bid);
            const convertido = valor * cotacao;
            resultado.textContent = `${valor} ${de} = ${convertido.toFixed(2)} ${para}`;
        } else {
            resultado.textContent = 'Erro ao converter';
        }

        resultado.style.display = "flex";
    } catch (erro) {
        resultado.textContent = 'Erro ao acessar API';
        resultado.style.display = "flex";
        console.error(erro);
    }
}
