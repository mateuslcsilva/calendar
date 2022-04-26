const calendar = document.querySelector('.calendar')
const daysInTheMonth = [31, 28, 31, 30, 31, 30, 30, 31, 30, 31, 30, 31]
const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
let changingMarkUpsIndex = 0
const date = new Date();
let currentMonth = date.getMonth()

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

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

const day = () => {
    for (let i = 1; i <= daysInTheMonth[currentMonth]; i++) {
        let day = document.createElement('p')
        day.setAttribute('class', 'day')
        day.innerText = i
        calendar.append(day)
    }
}

const calendarConstructor = () => {
    whiteSpace()
    day()
    document.querySelector('.currentMonthText').innerText = months[currentMonth]
}

calendarConstructor()

function changable(index) {
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

function changing() {
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

function floaterVanisher() {
    document.querySelector('.floaterDiv').classList.remove('active')
}

function newApointmentBox() {
    document.querySelector('.fadeOutContainer').classList.add('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.add('newApointmentDivActive')
}

function closeApointmentBox() {
    document.querySelector('.fadeOutContainer').classList.remove('fadeOutContainerActive')
    document.querySelector('.newApointmentDiv').classList.remove('newApointmentDivActive')
}

function clearCalendar() {
    document.querySelector('.calendar').innerHTML = ''
}

function nextMonth() {
    if (currentMonth < 11) {
        currentMonth++
        clearCalendar()
        calendarConstructor()
    } else {
        alert('sorry, só temos esse ano, por enquanto')
    }
}

function previousMonth() {
    if(currentMonth > 0){
    currentMonth--
    clearCalendar()
    calendarConstructor()
} else{
    alert('sorry, só temos esse ano, por enquanto')
}
}