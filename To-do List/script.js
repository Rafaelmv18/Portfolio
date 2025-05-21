const form = document.getElementById('form-tarefa');
const input = document.getElementById('nova-tarefa');
const lista = document.getElementById('lista-tarefas');

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function renderTarefas(){
    lista.innerHTML = '';

    if (tarefas.length === 0) {
        lista.innerHTML = '<li style="text-align:center;">Nenhuma tarefa adicionada ainda.</li>';
    return;
    }


     tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');

        li.innerHTML = `
            ${tarefa}
            <button onClick='removerTarefa(${index})'>X</button>
        `
        lista.appendChild(li);
    });
}

function addTarefa(t){
    if(t.trim() === ''){
        return;
    }
    tarefas.push(t);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas();
}

function removerTarefa(index){
    tarefas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas();
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    addTarefa(input.value);
    input.value = '';
});

renderTarefas();

function toggleMode() {
  const html = document.documentElement

  html.classList.toggle("dark")
}
