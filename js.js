///função para abrir o modal 
const openModal = () => document.getElementById('modal')//add - adicionar o modal
    .classList.add('active')
    
//função para fechar o modal
const closeModal = () => {
    clearFields() //função para os campos do modal
    document.getElementById('modal').classList.remove('active')
}

//puxar os itens 
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
//guardar os itens 
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", 
JSON.stringify(dbClient)) 

// CRUD - delete
const deleteClient = (index) => {
    const dbClient = readClient()//chamada do método 
    dbClient.splice(index, 1)//método que altera o conteúdo de um array
    setLocalStorage(dbClient)//grava o valor atualizado
}

// CRUD - update
const updateClient = (index, client) => { //cliente selecionado 
    const dbClient = readClient()//chamada do método 
    dbClient[index] = client//chave e valor
    setLocalStorage(dbClient)//grava o valor atualizado
}

// CRUD - read
const readClient = () => getLocalStorage() //listar os clientes

// CRUD - create
const createClient = (client) => { //cliente selecionado 
    const dbClient = getLocalStorage() 
    dbClient.push (client) //adiciona 
    setLocalStorage(dbClient) //grava o valor
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()//método que faz a validação
}

//Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')//inputs do modal
    fields.forEach(field => field.value = "")//percorrer os valores informados 
    //propriedade de acesso ao dado do elemento
    document.getElementById('nome').dataset.index = 'new'
    //mostrar no título do modal 
    document.querySelector(".modal-header>h2").textContent  = 'Cadastrar Nova Atividade'
}

const saveClient = () => {//método para verificar se deseja salvar ou editar
    if (isValidFields()) {//chamada do método de validação
        const client = { //objeto cliente
            nome: document.getElementById('nome').value,
            atividade: document.getElementById('atv').value,
            obs: document.getElementById('obs').value
        }
        const index = document.getElementById('nome').dataset.index //se for NEW cadastra
        if (index == 'new') {//se for NEW cadastra
            createClient(client)//chamada do método cadastrar
            updateTable()//após cadastrar deve atualizar a tabela 
            closeModal()//fechar o modal 
        } else {//senão edita o cliente
            updateClient(index, client)//deve-se passar a acão e o objeto cliente
            updateTable()//após cadastrar deve atualizar a tabela 
            closeModal()//fechar o modal
        }
    }
}

const createRow = (client, index) => {//método para criar uma linha na tabela 
    const newRow = document.createElement('tr')//criar o elemento TR
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.atividade}</td>
        <td>${client.obs}</td>
        <td>
            <button type="button" class="btnEditar" id="edit-${index}">Editar</button>
            <button type="button" class="btnExcluir" id="delete-${index}" >Excluir</button>
        </td>
    `
    //acrescenta a linha a tabela 
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}



const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {//método para atualizar a tabela
    const dbClient = readClient()//mostrar os clientes
    clearTable()//fechar a tabela 
    dbClient.forEach(createRow)//
}

const fillFields = (client) => { //mostrar as propriedades do objeto no modal 
    document.getElementById('nome').value = client.nome
    document.getElementById('atv').value = client.atividade
    document.getElementById('obs').value = client.obs
    
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {//método para edição
    const client = readClient()[index] //listar os clientes
    client.index = index //verificar o índice
    fillFields(client)//chamada do método para mostrar as propriedades
    //mostra no título do modal de qual cliente estamos tratando
    document.querySelector(".modal-header>h2").textContent  = `Deseja editar a atividade: ${client.nome} ?` 
    openModal()//fecha o modal
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')//mostrar no console a ação

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir a atividade: ${ client.nome} ?`)
            if (response) {
                deleteClient(index)//método para apagar o cliente pelo índice
                updateTable()//atualiza a tabela
            }
        }
    }
}

updateTable()//atualiza a tabela

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)