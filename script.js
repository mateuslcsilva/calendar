const calendar = document.querySelector('.calendar') // O LOCAL DA PÁGINA ONDE FICARÃO OS DIAS DO MÊS
const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
let changingMarkUpsIndex = 0 // VARIÁVEL QUE MOSTRA QUAL MARCADOR SERÁ ALTERADO PELA CAIXA DE ALTERAÇÃO
const date = new Date(); // DATE?
let currentYear = date.getFullYear()
let currentMonth = date.getMonth() // MÊS CORRENTE
let sectionActive = 0 // VARIÁVEL QUE MOSTRA QUAL PASSO DEVE SER MOSTRADO NA CRIAÇÃO DE TAREFAS
let selectedMonth = 999 // VARIÁVEL QUE DEFINE EM QUAL MÊS ESTÁ SENDO INCLUÍDO O COMPROMISSO. É GLOBAL POIS É USADA EM VÁRIAS FUNÇÕES
let selectedDay = 999 // VARIÁVEL QUE DEFINE EM QUAL DIA SERÁ INCLUÍDO O COMPROMISSO. NÃO SEI SE PRECISA ESTAR AQUI, MAS O MÊS ESTÁ, SO ...,
let selectedMarkUp = 999
let selectedTime = ''
let currentMarkUpText = ''
let markUpColors = ['red', 'blue', 'pink', 'green']
let appointments = []
let markUpsPreference = []



//ACHA O DIA DA SEMANA DO PRIMEIRO DIA DO MêS
let getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1);
}

//ACHA O ÚLTIMO DIA DO MêS
let getLastDayOfMonth = (year,month) => {
    return  new Date(year, month +1, 0).getDate();
    }

/*ABAIXO BUSCAMOS NO LOCALSTORAGE OS DADOS DE COMPROMISSOS */

let localStorageData = localStorage.getItem('appointments')

if (localStorageData) {
    appointments = JSON.parse(localStorageData)

    appointments.forEach((element,index, array) => {
        let monthDiference = date.getMonth() - element.month
        if(monthDiference > 2){
            array.splice(index, 1)
        }
    })
}

//A FUNÇÃO ABAIXO FAZ "ESPAÇOS EM BRANCO", PARA QUE O PRIMEIRO DIA DO MÊS FIQUE ADEQUADAMENTE POSICIONADO NO DIA DA SEMANA CORRETO.
const whiteSpace = () => {
    const firstDayCurrentMonth = getFirstDayOfMonth(
        currentYear,
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
    let daysInTheMonth = getLastDayOfMonth(currentYear, currentMonth)

    for (let i = 1; i <= daysInTheMonth; i++) {
        let day = document.createElement('div')
        day.setAttribute('class', 'day')
        let dayText = document.createElement('p')
        dayText.innerText = i
        day.append(dayText)

        appointments.forEach((appointments, index) => {
            if (appointments.month == currentMonth && appointments.day == i) {
                appointment(day, appointments.time, appointments.text, appointments.markUp)
            }
        })

        calendar.append(day)
    }
}


////A FUNÇÃO ABAIXO CRIA O COMPROMISSO, DE ACORDO COM AS INFORMAÇÕES DO OBJETO
const appointment = (day, time, text, markUp) => {

    let appointment = document.createElement('p')
    appointment.setAttribute("class", 'appointment ')
    appointment.classList.add(markUpColors[markUp])
    let textContent = document.createElement('span')
    textContent.innerText = time + ' - ' + text
    appointment.append(textContent)
    day.append(appointment)

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

const changable = (index) => {
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
        markUpsPreference.splice(changingMarkUpsIndex, 1, newMarkUpText)
        localStorage.setItem('markUpsPreference', JSON.stringify(markUpsPreference))
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
        currentMonth = 0
        currentYear++
        clearCalendar()
        calendarConstructor()
    }
}

const previousMonth = () => {
    if (currentMonth > 0) {
        currentMonth--
        clearCalendar()
        calendarConstructor()
    } else {
        currentMonth = 11
        currentYear--
        clearCalendar()
        calendarConstructor()
    }
}


///////////ABAIXO, FUNÇÕES PARA ABRIR A CAIXA DE NOVAS TAREFAS PELO BOTÃO DE NOVA TAREFA
const newApointmentBox = () => {
    document.querySelector('.fadeOutContainer').classList.add('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.add('newApointmentDivActive')
}


const closeApointmentBox = () => {
    timeReset()
    monthReset()
    dayReset()
    textReset()
    circleReset()
    selectedTime = ''
    document.querySelector('.fadeOutContainer').classList.remove('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.remove('newApointmentDivActive')
    document.querySelector('.setaPreviousStep').style.display = 'none'
    document.querySelector('.setaNextStep').style.display = 'none'
    resetApointmentSection()
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
            createTimeElementSelector()
            sectionActive++
            break
        }
        case 1: {
            if (selectedTime.length<1) return
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
            timeReset()
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
    if (selectedMonth > 11) {
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
    let daysInTheMonth = getLastDayOfMonth(currentYear, currentMonth)

    for (let i = 1; i <= daysInTheMonth; i++) {
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


//////ABAIXO, DEFINIMOS A CLASSE PARA CRIAR OS OBJETOS NO QUAL SERÃO ARMAZENADOS NOSSOS COMPROMISSOS

class appointmentObject {
    constructor(month, day, time, markUp, text) {
        this.month = month
        this.day = day
        this.time = time
        this.markUp = markUp
        this.text = text
    }
}

const createNewAppointment = () => {
    if (selectedMarkUp > 3) {
        alert('Ops, você esqueceu o marcador!')
        return
    }
    if (currentMarkUpText.length < 1) {
        alert("Ops, você esqueceu o texto!")
        return
    }
    let newAppointment = new appointmentObject(selectedMonth, selectedDay, selectedTime, selectedMarkUp, currentMarkUpText)
    appointments.push(newAppointment)

    if (selectedMonth == currentMonth) {
        let days = []
        days = document.querySelectorAll('.day')
        let day = days[newAppointment.day - 1]
        appointment(day, newAppointment.time, newAppointment.text, newAppointment.markUp)
    }
    closeApointmentBox()
    localStorage.setItem('appointments', JSON.stringify(appointments))

}

// ABAIXO DEFINIMOS A FUNÇÃO QUE CRIA OS HORÁRIOS QUANDO FAZEMOS UM NOVO COMPROMISSO

const createTimeElementSelector = () => {
    for (var i = 8; i <= 19; i++) {
        var textTime
        i < 10 ? textTime = '0' + i + ':00' : textTime = '' + i + ':00'



        let timeElement = document.createElement('button')
        timeElement.setAttribute('class', 'timeSelectorElement')
        timeElement.setAttribute("onclick", "timeSelected(this)")
        timeElement.innerText = textTime
        document.querySelector('.timeSelectorGrid').append(timeElement)
    }

    let timeElements = document.querySelectorAll(".timeSelectorElement")

    appointments.forEach((appointments, index) => {
        if (appointments.month == selectedMonth && appointments.day == selectedDay) {
            timeElements.forEach((element) => {
                element.innerText == appointments.time ? element.setAttribute('disabled', '') : {}
            })
        }
    })
}

const timeSelected = (element) => {
    selectedTime = element.innerText
    let timeElements = []
    timeElements = document.querySelectorAll('.timeSelectorElement')
    timeElements.forEach((otherTimeElement) => {
        otherTimeElement.classList.remove('timeSelectorElementActive')
    })
    element.classList.add('timeSelectorElementActive')
}

const timeReset = () => {
    document.querySelector('.timeSelectorGrid').innerHTML = ''
    selectedTime = ''
}

// // ABAIXO, É DEFINIDO O TERCEIRO PASSO DA CRIAÇÃO DE COMPROMISSO, COM TEXTO, MARCADOR E BOTÃO DE CONCLUSÃO

const selectedCircle = (element, index) => {
    selectedMarkUp = index

    let circles = document.querySelectorAll('.circleSelectMarkUp')
    circles.forEach((circle) => {
        circle.classList.remove('markUpSelectedCircle')
    })

    element.classList.add('markUpSelectedCircle')
}

const circleReset = () => {
    let circles = document.querySelectorAll('.circleSelectMarkUp')
    circles.forEach((circle) => {
        circle.classList.remove('markUpSelectedCircle')
    })
    selectedMarkUp = 999
}

const selectedText = (element) => {
    currentMarkUpText = element.value
}

const textReset = () => {
    document.querySelector('.inputSelectedText').value = ''
    currentMarkUpText = ''
}


const eraseAll = () => {
    let aviso = confirm('Tem certeza de que quer apagar todos o compromissos indeterminadamente??')
    if (aviso == false) return
    appointments = []
    localStorage.removeItem('appointments')
    clearCalendar()
    calendarConstructor()
}

const markUpStorage = () => {
    let markUpsPreferenceStorage = localStorage.getItem('markUpsPreference')
    if (markUpsPreferenceStorage){
        markUpsPreference = JSON.parse(markUpsPreferenceStorage)

        let markUpElements = document.querySelectorAll('.changable')
        markUpElements.forEach((element, index) => {
        element.innerText = markUpsPreference[index]
        })

        let markUpElementsSubtitleElements = document.querySelectorAll('.markUpSubtitle')
        markUpElementsSubtitleElements.forEach((element, index) => {
        element.innerText = markUpsPreference[index]
        })


    } else{
        let markUpElements = document.querySelectorAll('.changable')
        markUpElements.forEach((element) => {
            markUpsPreference.push(element.innerText)
        })
        localStorage.setItem("markUpsPreference", JSON.stringify(markUpsPreference))
    }
    
}

const resetMarkUps = () => { //RESETA O TEXTO DOS MARCADORES
    let aviso = confirm('Tem certeza de que quer apagar todos o compromissos indeterminadamente??')
    if (aviso == false) return
    markUpsPreference = ['MARCADOR VERMELHO', 'MARCADOR AZUL', 'MARCADOR ROSA', 'MARCADOR VERDE']
    localStorage.removeItem('markUpsPreference')

    let markUpElements = document.querySelectorAll('.changable')
    markUpElements.forEach((element, index) => {
    element.innerText = markUpsPreference[index]
    })

    let markUpElementsSubtitleElements = document.querySelectorAll('.markUpSubtitle')
    markUpElementsSubtitleElements.forEach((element, index) => {
    element.innerText = markUpsPreference[index]
    })
}

markUpStorage() //FUNÇÃO PARA BUSCAR NO LOCALSTORAGE OS NOMES DOS MARCADORES


/*

*/