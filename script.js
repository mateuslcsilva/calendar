const calendar = document.querySelector('.calendar') // O LOCAL DA PÁGINA ONDE FICARÃO OS DIAS DO MÊS
const daysInTheMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // QUANTOS DIAS TEM CADA MÊS NO ANO
const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
let changingMarkUpsIndex = 0 // VARIÁVEL QUE MOSTRA QUAL MARCADOR SERÁ ALTERADO PELA CAIXA DE ALTERAÇÃO
const date = new Date(); // DATE?
let currentMonth = date.getMonth() // MÊS CORRENTE
let sectionActive = 0 // VARIÁVEL QUE MOSTRA QUAL PASSO DEVE SER MOSTRADO NA CRIAÇÃO DE TAREFAS
let selectedMonth = 999 // VARIÁVEL QUE DEFINE EM QUAL MÊS ESTÁ SENDO INCLUÍDO O COMPROMISSO. É GLOBAL POIS É USADA EM VÁRIAS FUNÇÕES
let selectedDay = 999 // VARIÁVEL QUE DEFINE EM QUAL DIA SERÁ INCLUÍDO O COMPROMISSO. NÃO SEI SE PRECISA ESTAR AQUI, MAS O MÊS ESTÁ, SO ...,


//ACHA O DIA DA SEMANA DO PRIMEIRO DIA DO MêS
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}


//A FUNÇÃO ABAIXO FAZ "ESPAÇOS EM BRANCO", PARA QUE O PRIMEIRO DIA DO MÊS FIQUE ADEQUADAMENTE POSICIONADO NO DIA DA SEMANA CORRETO.
const whiteSpace = () => {
    const firstDayCurrentMonth = getFirstDayOfMonth(
        date.getFullYear(),
        currentMonth,
    )
    for (let j = 0; j < firstDayCurrentMonth.getDay(); j++) {
        let whiteSpace = document.createElement('p')
        whiteSpace.setAttribute('class', 'whiteSpace')
        calendar.append(whiteSpace)
    }
}

//A FUNÇÃO ABAIXO FAZ O NÚMERO DE DIAS EXISTENTES NO MÊS ATUAL/SELECIONADO
const day = () => {
    for (let i = 1; i <= daysInTheMonth[currentMonth]; i++) {
        let day = document.createElement('p')
        day.setAttribute('class', 'day')
        day.innerText = i
        calendar.append(day)
    }
}


//A FUNÇÃO ABAIXO CONSTRÓI O NOSSO CALENDÁRIO
const calendarConstructor = () => {
    whiteSpace()
    day()
    document.querySelector('.currentMonthText').innerText = months[currentMonth]
    /*SERÁ TAMBÉM CHAMADO DENTRO DESSA FUNÇÃO:
    1 - A FUNÇÃO PARA BUSCAR AS INFORMAÇÕES DO LOCAL STORAGE QUE SEJAM RELACIONADAS A COMPROMISSOS
    2 - POSSIVELMENTE A FUNÇÃO QUE COLOCA OS COMPROMISSOS NOS DIAS, MAS POSSIVELMENTE ESSA FUNÇÃO SERÁ DO DIAS.
     */
}


calendarConstructor() // PARA CONSTRUIR O CALENDÁRIO DO MÊS CORRENTE MOSTRADO AO ABRIR O SITE

// ABAIXO, A FUNÇÃO PARA MOSTRAR NOSSA CAIXA DE ALTERAR MARCADORES

const changable = (index) =>  {
    changingMarkUpsIndex = index
    document.querySelector('.floaterDiv').classList.add('active')
    switch (index) {
        case 0:
            document.querySelector('.btnChangingMarkUps').style.backgroundColor = 'rgb(230, 109, 109)'
            break
        case 1:
            document.querySelector('.btnChangingMarkUps').style.backgroundColor = 'rgb(106, 106, 243)'
            break
        case 2:
            document.querySelector('.btnChangingMarkUps').style.backgroundColor = 'pink'
            break
        case 3:
            document.querySelector('.btnChangingMarkUps').style.backgroundColor = 'rgb(66, 180, 66)'
        default:
    }
}

//ABAIXO, MUDAMOS O TEXTO DOS MARCADORES

const changing = () => {
    let newMarkUpText = document.querySelector('#ChangingMarkUps').value
    if (newMarkUpText) {
        document.querySelector('.markUps').children[changingMarkUpsIndex].children[1].innerText = newMarkUpText
        document.querySelector('.noWrapMarkUps').children[changingMarkUpsIndex].innerText = newMarkUpText
        document.querySelector('.floaterDiv').classList.remove('active')
        document.querySelector('#ChangingMarkUps').style.border = 'none'
        document.querySelector('#ChangingMarkUps').value = ''
    } else {
        document.querySelector('#ChangingMarkUps').style.border = '.5px solid red'
    }
}

document.addEventListener('keydown', function (e) {
    e.key === 'Enter' ? changing() : {}
}
)

const floaterVanisher = () => {
    document.querySelector('.floaterDiv').classList.remove('active')
}

const noBorder = (element) => {
    element.style.border = 'none'
}


//////// ABAIXO, FUNÇÕES PARA MUDAR O MÊS EXIBIDO DO CALENDÁRIO

const clearCalendar = () => {
    document.querySelector('.calendar').innerHTML = ''
}

const nextMonth = () => {
    if (currentMonth < 11) {
        currentMonth++
        clearCalendar()
        calendarConstructor()
    } else {
        alert('sorry, só temos esse ano, por enquanto')
    }
}

const previousMonth = () => {
    if (currentMonth > 0) {
        currentMonth--
        clearCalendar()
        calendarConstructor()
    } else {
        alert('sorry, só temos esse ano, por enquanto')
    }
}


///////////ABAIXO, FUNÇÕES PARA ABRIR A CAIXA DE NOVAS TAREFAS PELO BOTÃO DE NOVA TAREFA
const newApointmentBox = () => {
    document.querySelector('.fadeOutContainer').classList.add('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.add('newApointmentDivActive')
}


const closeApointmentBox = () => {
    document.querySelector('.fadeOutContainer').classList.remove('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.remove('newApointmentDivActive')
    document.querySelector('.setaPreviousStep').style.display = 'none'
    document.querySelector('.setaNextStep').style.display = 'none'
    resetApointmentSection()
    monthReset()
    dayReset()
}

const resetApointmentSection = () => {
    document.querySelector('.sectionThree').classList.remove('sectionActive')
    document.querySelector('.sectionTwo').classList.remove('sectionActive')
    document.querySelector('.sectionOne').classList.add('sectionActive')
    sectionActive = 0
}









// ABAIXO DEFINIMOS AS FUNÇÕES DA CAIXA DE INCLUIR COMPROMISSO
const nextStepButton = () => {
    switch (sectionActive) {
        case 0: {
            if (selectedDay > 40 || selectedMonth > 11) return
            document.querySelector('.sectionTwo').classList.add('sectionActive')
            document.querySelector('.sectionOne').classList.remove('sectionActive')
            document.querySelector('.setaPreviousStep').style.display = 'block'
            sectionActive++
            break
        }
        case 1: {
            document.querySelector('.sectionThree').classList.add('sectionActive')
            document.querySelector('.sectionTwo').classList.remove('sectionActive')
            document.querySelector('.setaNextStep').style.display = 'none'
            sectionActive++
            break
        }
    }
}


const previousStepButton = () => {
    switch (sectionActive) {
        case 1: {
            document.querySelector('.sectionTwo').classList.remove('sectionActive')
            document.querySelector('.sectionOne').classList.add('sectionActive')
            document.querySelector('.setaPreviousStep').style.display = 'none'
            sectionActive--
            break
        }
        case 2: {
            document.querySelector('.sectionThree').classList.remove('sectionActive')
            document.querySelector('.sectionTwo').classList.add('sectionActive')
            document.querySelector('.setaNextStep').style.display = 'block'
            sectionActive--
            break
        }
    }
}


//ABAIXO, AS FUNÇÕES PARA O PRIMEIRO PASSO DE CRIAÇÃO DE TAREFA

const shownMonthSelector = (element) => {
    if (element.checked) {
        document.querySelector('.mesesNewApointmentSelect').classList.add('mesesNewApointmentSelectAtive')
        closeDaySelector()
        //adicionar aqui comando para tirar o active do dia quando o mês for ativado
    } else {
        document.querySelector('.mesesNewApointmentSelect').classList.remove('mesesNewApointmentSelectAtive')
    }
}

const closeMonthSelector = () => {
    document.querySelector('.mesesNewApointmentSelect').classList.remove('mesesNewApointmentSelectAtive')
    document.querySelector('#mesesNewApointment').checked = false
}

const monthSelected = (element, month) => {
    document.querySelector('.labelMesesNewApointment').innerText = element.innerText
    selectedMonth = month
    closeMonthSelector()
}

const monthReset = () => {
    document.querySelector('.labelMesesNewApointment').innerText = 'MÊS'
    selectedMonth = 999
    closeMonthSelector()
}




const shownDaysSelector = (element) => {
    if (selectedMonth > 11){
        document.querySelector('#daysNewApointment').checked = false
        alert('Por favor, selecione um mês!')
        return
    }
    if (element.checked) {
        document.querySelector('.daysNewApointmentSelect').classList.add('daysNewApointmentSelectAtive')
        calendarGridConstructor()
        closeMonthSelector()
    } else {
        document.querySelector('.daysNewApointmentSelect').classList.remove('daysNewApointmentSelectAtive')
        closeDaySelector()
    }
}

const closeDaySelector = () => {
    document.querySelector('.daysNewApointmentSelect').classList.remove('daysNewApointmentSelectAtive')
    document.querySelector('#daysNewApointment').checked = false
    document.querySelector('.daySelectorContainer').innerHTML = ''
}

const daySelected = (element) => {
    document.querySelector('.labelDaysNewApointment').innerText = element.innerText
    document.querySelector('.setaNextStep').style.display = 'block'
    selectedDay = element.innerText
    closeDaySelector()
}

const dayReset = () => {
    document.querySelector('.labelDaysNewApointment').innerText = 'DIA'
    selectedDay = 999
    closeDaySelector()
}


///// ABAIXO, CRIAMOS DINAMICAMENTE O GRID PARA SELECIONAR O DIA DA TAREFA
const gridsWhiteSpace = () => {
    const firstDayCurrentMonth = getFirstDayOfMonth(
        date.getFullYear(),
        selectedMonth,
    )
    for (let j = 0; j < firstDayCurrentMonth.getDay(); j++) {
        let gridsWhiteSpace = document.createElement('p')
        gridsWhiteSpace.setAttribute('class', 'gridsWhiteSpace')
        document.querySelector('.daySelectorContainer').append(gridsWhiteSpace)
    }
}


const selectorsDay = () => {
    for (let i = 1; i <= daysInTheMonth[selectedMonth]; i++) {
        let selectorsDay = document.createElement('p')
        selectorsDay.setAttribute('class', 'selectorsDay')
        selectorsDay.innerText = i
        selectorsDay.setAttribute("onclick", 'daySelected(this)')
        document.querySelector('.daySelectorContainer').append(selectorsDay)
    }
}



const calendarGridConstructor = () => {
    gridsWhiteSpace()
    selectorsDay()
}

/*
******SOBRE O LOCAL STORAGE************

1 - GUARDAREMOS OS DADOS DOS COMPRIMISSOS EM OBJETOS
2 - OS OBJETOS TERÃO MÊS, DIA, HORA, MARCADOR E TEXTO
3 - GUARDAREMOS TODOS ESSES OBJETOS EM UM ARRAY
4 - USAREMOS ESSE ARRAY PARA TRABALHAR COM OS COMPROMISSOS DENTRO DO NOSSO SITE
5 - GUARDAREMOS NO LOCAL STORAGE COM JSON.stringify()
6 - PEGAREMOS DO LOCAL STORAGE COM JSON.parse()
7 - CONTINUAREMOS USANDO O MESMO ARRAY PARA COLOCAR OS COMPROMISSOS EM SEUS LUGARES
*/