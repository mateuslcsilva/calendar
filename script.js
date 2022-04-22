const calendar = document.querySelector('.calendar')
const daysInTheMonth = [31, 28, 31, 30, 31, 30, 30, 31, 30, 31, 30, 31]
let changingMarkUpsIndex = 0

const calendarConstructor = () => {
    const date = new Date();
    const firstDayCurrentMonth = getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
      );
      for (let j = 0; j <= firstDayCurrentMonth.getDay(); j++){
        let whiteSpace = document.createElement('p')
        whiteSpace.setAttribute('class', 'whiteSpace')
        calendar.append(whiteSpace)
      }
    let month = new Date()
    for (let i = 1; i <= daysInTheMonth[month.getMonth()]; i++){
        let day = document.createElement('p')
        day.setAttribute('class', 'day')
        day.innerText = i
        calendar.append(day)
    }
}
calendarConstructor()

function changable(index){
    changingMarkUpsIndex = index
    document.querySelector('.floaterDiv').classList.add('active')
    switch (index){
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

function changing(){
    let newMarkUpText = document.querySelector('#ChangingMarkUps').value
    document.querySelector('.markUps').children[changingMarkUpsIndex].children[1].innerText = newMarkUpText
    document.querySelector('.noWrapMarkUps').children[changingMarkUpsIndex].innerText = newMarkUpText
    document.querySelector('.floaterDiv').classList.remove('active')
    document.querySelector('#ChangingMarkUps').value = ''
}

document.addEventListener('keydown', function (e) {
    e.key === 'Enter' ? changing() : {}
}
)

function floaterVanisher(){
    document.querySelector('.floaterDiv').classList.remove('active')
}





function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
  }
  