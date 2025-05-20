document.getElementById("form-responsavel").addEventListener("submit", function (e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        aluno_id: document.getElementById("aluno_id").value
    };

    const mensagemBox = document.getElementById("mensagem");

    // Simulando sucesso (poderia haver validações reais)
    if (dados.nome && dados.cpf && dados.email && dados.aluno_id) {
        mensagemBox.className = "mensagem sucesso";
        mensagemBox.textContent = "Cadastro realizado com sucesso!";
        mensagemBox.style.display = "block";
        console.log("JSON enviado:", JSON.stringify(dados, null, 2));
    } else {
        mensagemBox.className = "mensagem erro";
        mensagemBox.textContent = "Erro no cadastro. Verifique os campos obrigatórios.";
        mensagemBox.style.display = "block";
    }

    // Oculta a mensagem após 5 segundos
    setTimeout(() => {
        mensagemBox.style.display = "none";
    }, 5000);
});
