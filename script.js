const patch = 1.102;
const calendar = document.querySelector(".calendar"); // O LOCAL DA PÁGINA ONDE FICARÃO OS DIAS DO MÊS
const months = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];
let changingMarkUpsIndex = 0; // VARIÁVEL QUE MOSTRA QUAL MARCADOR SERÁ ALTERADO PELA CAIXA DE ALTERAÇÃO
const date = new Date(); // DATE?
let currentYear = date.getFullYear();
let currentMonth = date.getMonth(); // MÊS CORRENTE
let sectionActive = 0; // VARIÁVEL QUE MOSTRA QUAL PASSO DEVE SER MOSTRADO NA CRIAÇÃO DE TAREFAS
let selectedYear = currentYear;
let selectedMonth = 999; // VARIÁVEL QUE DEFINE EM QUAL MÊS ESTÁ SENDO INCLUÍDO O COMPROMISSO. É GLOBAL POIS É USADA EM VÁRIAS FUNÇÕES
let selectedDay = 999; // VARIÁVEL QUE DEFINE EM QUAL DIA SERÁ INCLUÍDO O COMPROMISSO. NÃO SEI SE PRECISA ESTAR AQUI, MAS O MÊS ESTÁ, SO ...,
let selectedMarkUp = 999;
let selectedTime = "";
let currentMarkUpText = "";
let markUpColors = ["red", "blue", "pink", "green"];
let appointments = [];
let markUpsPreference = [];

function dynamicsort(property, order) {
  var sort_order = 1;
  if (order === "desc") {
    sort_order = -1;
  }
  return function (a, b) {
    if (a[property] < b[property]) {
      return -1 * sort_order;
    } else if (a[property] > b[property]) {
      return 1 * sort_order;
    } else {
      return 0 * sort_order;
    }
  };
}
//ACHA O DIA DA SEMANA DO PRIMEIRO DIA DO MêS
let getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1);
};

//ACHA O ÚLTIMO DIA DO MêS
let getLastDayOfMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

//A FUNÇÃO ABAIXO FAZ "ESPAÇOS EM BRANCO", PARA QUE O PRIMEIRO DIA DO MÊS FIQUE ADEQUADAMENTE POSICIONADO NO DIA DA SEMANA CORRETO.
const whiteSpace = () => {
  const firstDayCurrentMonth = getFirstDayOfMonth(currentYear, currentMonth);
  for (let j = 0; j < firstDayCurrentMonth.getDay(); j++) {
    let whiteSpace = document.createElement("p");
    whiteSpace.setAttribute("class", "whiteSpace");
    calendar.append(whiteSpace);
  }
};

//A FUNÇÃO ABAIXO FAZ O NÚMERO DE DIAS EXISTENTES NO MÊS ATUAL/SELECIONADO
const day = () => {
  let daysInTheMonth = getLastDayOfMonth(currentYear, currentMonth);

  for (let i = 1; i <= daysInTheMonth; i++) {
    let day = document.createElement("div");
    day.setAttribute("class", "day");
    let dayText = document.createElement("p");
    dayText.innerText = i;
    day.append(dayText);

    let appointmentsOfTheDay = [];

    appointments.forEach((appointments, index) => {
      if (
        appointments.year == currentYear &&
        appointments.month == currentMonth &&
        appointments.day == i
      ) {
        appointmentsOfTheDay.push(appointments);
      }
    });

    appointmentsOfTheDay.sort(dynamicsort("time", "asc"));

    appointmentsOfTheDay.forEach((element) => {
      appointment(day, element.time, element.text, element.markUp);
    });

    calendar.append(day);
  }
};

////A FUNÇÃO ABAIXO CRIA O COMPROMISSO, DE ACORDO COM AS INFORMAÇÕES DO OBJETO
const appointment = (day, time, text, markUp) => {
  let appointmentBox = document.createElement("div");
  appointmentBox.setAttribute("class", "appointmentBox");
  let appointment = document.createElement("div");
  appointment.setAttribute("class", "appointment ");
  appointment.classList.add(markUpColors[markUp]);
  let textContent = document.createElement("p");
  textContent.innerText = time + " - " + text;
  appointment.append(textContent);

  appointments.forEach((element, index) => {
    if (
      element.time == time &&
      element.text == text &&
      element.markUp == markUp &&
      element.day == day.firstChild.innerText &&
      element.month == currentMonth
    ) {
      appointmentBox.setAttribute("id", index);
    }
  });

  appointmentBox.setAttribute("onclick", "changingAppointment(this)");
  appointmentBox.setAttribute("focusout", "focusout()");
  appointmentBox.append(appointment);
  day.append(appointmentBox);
};

//A FUNÇÃO ABAIXO CONSTRÓI O NOSSO CALENDÁRIO
const calendarConstructor = () => {
  whiteSpace();
  day();
  document.querySelector(".currentMonthText").innerText = months[currentMonth];
  /*SERÁ TAMBÉM CHAMADO DENTRO DESSA FUNÇÃO:
    1 - A FUNÇÃO PARA BUSCAR AS INFORMAÇÕES DO LOCAL STORAGE QUE SEJAM RELACIONADAS A COMPROMISSOS
    2 - POSSIVELMENTE A FUNÇÃO QUE COLOCA OS COMPROMISSOS NOS DIAS, MAS POSSIVELMENTE ESSA FUNÇÃO SERÁ DO DIAS.
     */
};

// ABAIXO, A FUNÇÃO PARA MOSTRAR NOSSA CAIXA DE ALTERAR MARCADORES

const changable = (index) => {
  changingMarkUpsIndex = index;
  document.querySelector(".floaterDiv").classList.add("active");
  switch (index) {
    case 0:
      document.querySelector(".btnChangingMarkUps").style.backgroundColor =
        "rgb(230, 109, 109)";
      break;
    case 1:
      document.querySelector(".btnChangingMarkUps").style.backgroundColor =
        "rgb(106, 106, 243)";
      break;
    case 2:
      document.querySelector(".btnChangingMarkUps").style.backgroundColor =
        "pink";
      break;
    case 3:
      document.querySelector(".btnChangingMarkUps").style.backgroundColor =
        "rgb(66, 180, 66)";
    default:
  }
};

//ABAIXO, MUDAMOS O TEXTO DOS MARCADORES

const changing = () => {
  let newMarkUpText = document.querySelector("#ChangingMarkUps").value;
  if (newMarkUpText) {
    document.querySelector(".markUps").children[
      changingMarkUpsIndex
    ].children[1].innerText = newMarkUpText;
    document.querySelector(".noWrapMarkUps").children[
      changingMarkUpsIndex
    ].innerText = newMarkUpText;
    markUpsPreference.splice(changingMarkUpsIndex, 1, newMarkUpText);
    localStorage.setItem(
      "markUpsPreference",
      JSON.stringify(markUpsPreference)
    );
    floaterVanisher(0);
    document.querySelector("#ChangingMarkUps").style.border = "none";
    document.querySelector("#ChangingMarkUps").value = "";
  } else {
    document.querySelector("#ChangingMarkUps").style.border = ".5px solid red";
  }
};

document.addEventListener("keydown", function (e) {
  e.key === "Enter" ? changing() : {};
});

const floaterVanisher = (index) => {
  let floaters = [];
  floaters = document.querySelectorAll(".floaterDiv");
  floaters[index].classList.remove("active");
};

const noBorder = (element) => {
  element.style.border = "none";
};

//////// ABAIXO, FUNÇÕES PARA MUDAR O MÊS EXIBIDO DO CALENDÁRIO

const clearCalendar = () => {
  document.querySelector(".calendar").innerHTML = "";
};

const nextMonth = () => {
  if (currentMonth < 11) {
    currentMonth++;
    clearCalendar();
    calendarConstructor();
  } else {
    currentMonth = 0;
    currentYear++;
    clearCalendar();
    calendarConstructor();
  }
};

const previousMonth = () => {
  if (currentMonth > 0) {
    currentMonth--;
    clearCalendar();
    calendarConstructor();
  } else {
    currentMonth = 11;
    currentYear--;
    clearCalendar();
    calendarConstructor();
  }
};

///////////ABAIXO, FUNÇÕES PARA ABRIR A CAIXA DE NOVAS TAREFAS PELO BOTÃO DE NOVA TAREFA
const newApointmentBox = () => {
  document
    .querySelector(".fadeOutContainer")
    .classList.add("fadeOutContainerActive");
  document
    .querySelector(".newApointmentDiv")
    .classList.add("newApointmentDivActive");

  selectedYear = currentYear;
  const select = document.querySelector("#anoNewAppointment");

  for (let i = currentYear; i <= currentYear + 2; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    select.append(opt);
  }
};

const closeApointmentBox = () => {
  timeReset();
  yearReset();
  monthReset();
  dayReset();
  textReset();
  circleReset();
  selectedTime = "";
  document
    .querySelector(".fadeOutContainer")
    .classList.remove("fadeOutContainerActive");
  document
    .querySelector(".newApointmentDiv")
    .classList.remove("newApointmentDivActive");
  document.querySelector(".setaPreviousStep").style.display = "none";
  document.querySelector(".setaNextStep").style.display = "none";
  resetApointmentSection();
};

const resetApointmentSection = () => {
  document.querySelector(".sectionThree").classList.remove("sectionActive");
  document.querySelector(".sectionTwo").classList.remove("sectionActive");
  document.querySelector(".sectionOne").classList.add("sectionActive");
  sectionActive = 0;
};

// ABAIXO DEFINIMOS AS FUNÇÕES DA CAIXA DE INCLUIR COMPROMISSO
const nextStepButton = () => {
  switch (sectionActive) {
    case 0: {
      if (selectedDay > 40 || selectedMonth > 11) return;
      document.querySelector(".sectionTwo").classList.add("sectionActive");
      document.querySelector(".sectionOne").classList.remove("sectionActive");
      document.querySelector(".setaPreviousStep").style.display = "block";
      createTimeElementSelector();
      sectionActive++;
      break;
    }
    case 1: {
      if (selectedTime.length < 1) return;
      document.querySelector(".sectionThree").classList.add("sectionActive");
      document.querySelector(".sectionTwo").classList.remove("sectionActive");
      document.querySelector(".setaNextStep").style.display = "none";
      sectionActive++;
      break;
    }
  }
};

const previousStepButton = () => {
  switch (sectionActive) {
    case 1: {
      document.querySelector(".sectionTwo").classList.remove("sectionActive");
      document.querySelector(".sectionOne").classList.add("sectionActive");
      document.querySelector(".setaPreviousStep").style.display = "none";
      timeReset();
      sectionActive--;
      break;
    }
    case 2: {
      document.querySelector(".sectionThree").classList.remove("sectionActive");
      document.querySelector(".sectionTwo").classList.add("sectionActive");
      document.querySelector(".setaNextStep").style.display = "block";
      sectionActive--;
      break;
    }
  }
};

//ABAIXO, AS FUNÇÕES PARA O PRIMEIRO PASSO DE CRIAÇÃO DE TAREFA

const yearSelected = (element) => {
  selectedYear = Number(element.value);
};

const yearReset = () => {
  selectedYear = currentYear;
  document.querySelector("#anoNewAppointment").innerHTML = "";
};

const shownMonthSelector = (element) => {
  if (element.checked) {
    document
      .querySelector(".mesesNewApointmentSelect")
      .classList.add("mesesNewApointmentSelectAtive");
    closeDaySelector();
    //adicionar aqui comando para tirar o active do dia quando o mês for ativado
  } else {
    document
      .querySelector(".mesesNewApointmentSelect")
      .classList.remove("mesesNewApointmentSelectAtive");
  }
};

const closeMonthSelector = () => {
  document
    .querySelector(".mesesNewApointmentSelect")
    .classList.remove("mesesNewApointmentSelectAtive");
  document.querySelector("#mesesNewApointment").checked = false;
};

const monthSelected = (element, month) => {
  document.querySelector(".labelMesesNewApointment").innerText =
    element.innerText;
  selectedMonth = month;
  closeMonthSelector();
};

const monthReset = () => {
  document.querySelector(".labelMesesNewApointment").innerText = "MÊS";
  selectedMonth = 999;
  closeMonthSelector();
};

const shownDaysSelector = (element) => {
  if (selectedMonth > 11) {
    document.querySelector("#daysNewApointment").checked = false;
    alert("Por favor, selecione um mês!");
    return;
  }
  if (element.checked) {
    document
      .querySelector(".daysNewApointmentSelect")
      .classList.add("daysNewApointmentSelectAtive");
    calendarGridConstructor();
    closeMonthSelector();
  } else {
    document
      .querySelector(".daysNewApointmentSelect")
      .classList.remove("daysNewApointmentSelectAtive");
    closeDaySelector();
  }
};

const closeDaySelector = () => {
  document
    .querySelector(".daysNewApointmentSelect")
    .classList.remove("daysNewApointmentSelectAtive");
  document.querySelector("#daysNewApointment").checked = false;
  document.querySelector(".daySelectorContainer").innerHTML = "";
};

const daySelected = (element) => {
  document.querySelector(".labelDaysNewApointment").innerText =
    element.innerText;
  document.querySelector(".setaNextStep").style.display = "block";
  selectedDay = element.innerText;
  closeDaySelector();
};

const dayReset = () => {
  document.querySelector(".labelDaysNewApointment").innerText = "DIA";
  selectedDay = 999;
  closeDaySelector();
};

///// ABAIXO, CRIAMOS DINAMICAMENTE O GRID PARA SELECIONAR O DIA DA TAREFA
const gridsWhiteSpace = () => {
  const firstDayCurrentMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
  for (let j = 0; j < firstDayCurrentMonth.getDay(); j++) {
    let gridsWhiteSpace = document.createElement("p");
    gridsWhiteSpace.setAttribute("class", "gridsWhiteSpace");
    document.querySelector(".daySelectorContainer").append(gridsWhiteSpace);
  }
};

const selectorsDay = () => {
  let daysInTheMonth = getLastDayOfMonth(selectedYear, selectedMonth);

  for (let i = 1; i <= daysInTheMonth; i++) {
    let selectorsDay = document.createElement("p");
    selectorsDay.setAttribute("class", "selectorsDay");
    selectorsDay.innerText = i;
    selectorsDay.setAttribute("onclick", "daySelected(this)");
    document.querySelector(".daySelectorContainer").append(selectorsDay);
  }
};

const calendarGridConstructor = () => {
  gridsWhiteSpace();
  selectorsDay();
};

//////ABAIXO, DEFINIMOS A CLASSE PARA CRIAR OS OBJETOS NO QUAL SERÃO ARMAZENADOS NOSSOS COMPROMISSOS

class appointmentObject {
  constructor(year, month, day, time, markUp, text) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.time = time;
    this.markUp = markUp;
    this.text = text;
  }
}

const createNewAppointment = () => {
  if (selectedMarkUp > 3) {
    alert("Ops, você esqueceu o marcador!");
    return;
  }
  if (currentMarkUpText.length < 1) {
    alert("Ops, você esqueceu o texto!");
    return;
  }
  let newAppointment = new appointmentObject(
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedTime,
    selectedMarkUp,
    currentMarkUpText
  );
  appointments.push(newAppointment);

  clearCalendar();
  calendarConstructor();
  closeApointmentBox();
  localStorage.setItem("appointments", JSON.stringify(appointments));
};

// ABAIXO DEFINIMOS A FUNÇÃO QUE CRIA OS HORÁRIOS QUANDO FAZEMOS UM NOVO COMPROMISSO

const createTimeElementSelector = () => {
  for (var i = 8; i <= 19; i++) {
    var textTime;
    i < 10 ? (textTime = "0" + i + ":00") : (textTime = "" + i + ":00");

    let timeElement = document.createElement("button");
    timeElement.setAttribute("class", "timeSelectorElement");
    timeElement.setAttribute("onclick", "timeSelected(this)");
    timeElement.innerText = textTime;
    document.querySelector(".timeSelectorGrid").append(timeElement);
  }

  let timeElements = document.querySelectorAll(".timeSelectorElement");

  appointments.forEach((appointments, index) => {
    if (
      appointments.year == selectedYear &&
      appointments.month == selectedMonth &&
      appointments.day == selectedDay
    ) {
      timeElements.forEach((element) => {
        element.innerText == appointments.time
          ? element.setAttribute("disabled", "")
          : {};
      });
    }
  });
};

const timeSelected = (element) => {
  selectedTime = element.innerText;
  let timeElements = [];
  timeElements = document.querySelectorAll(".timeSelectorElement");
  timeElements.forEach((otherTimeElement) => {
    otherTimeElement.classList.remove("timeSelectorElementActive");
  });
  element.classList.add("timeSelectorElementActive");
};

const timeReset = () => {
  document.querySelector(".timeSelectorGrid").innerHTML = "";
  selectedTime = "";
};

// // ABAIXO, É DEFINIDO O TERCEIRO PASSO DA CRIAÇÃO DE COMPROMISSO, COM TEXTO, MARCADOR E BOTÃO DE CONCLUSÃO

const selectedCircle = (element, index) => {
  selectedMarkUp = index;

  let circles = document.querySelectorAll(".circleSelectMarkUp");
  circles.forEach((circle) => {
    circle.innerHTML = "";
  });

  let checkedCircle = document.createElement("img");
  checkedCircle.setAttribute("src", "images/checkedicon.png");
  checkedCircle.setAttribute("class", "checkedIcon");
  element.append(checkedCircle);
};

const circleReset = () => {
  let circles = document.querySelectorAll(".circleSelectMarkUp");
  circles.forEach((circle) => {
    circle.innerHTML = "";
  });
  selectedMarkUp = 999;
};

const selectedText = (element) => {
  currentMarkUpText = element.value;
};

const textReset = () => {
  document.querySelector(".inputSelectedText").value = "";
  currentMarkUpText = "";
};

const eraseAll = () => {
  let aviso = confirm(
    "Tem certeza de que quer apagar todos o compromissos indeterminadamente??"
  );
  if (aviso == false) return;
  appointments = [];
  localStorage.removeItem("appointments");
  clearCalendar();
  calendarConstructor();
};

const markUpStorage = () => {
  let markUpsPreferenceStorage = localStorage.getItem("markUpsPreference");
  if (markUpsPreferenceStorage) {
    markUpsPreference = JSON.parse(markUpsPreferenceStorage);

    let markUpElements = document.querySelectorAll(".changable");
    markUpElements.forEach((element, index) => {
      element.innerText = markUpsPreference[index];
    });

    let markUpElementsSubtitleElements =
      document.querySelectorAll(".markUpSubtitle");
    markUpElementsSubtitleElements.forEach((element, index) => {
      element.innerText = markUpsPreference[index];
    });
  } else {
    let markUpElements = document.querySelectorAll(".changable");
    markUpElements.forEach((element) => {
      markUpsPreference.push(element.innerText);
    });
    localStorage.setItem(
      "markUpsPreference",
      JSON.stringify(markUpsPreference)
    );
  }
};

const resetMarkUps = () => {
  //RESETA O TEXTO DOS MARCADORES
  let aviso = confirm(
    "Tem certeza de que quer apagar todos o compromissos indeterminadamente??"
  );
  if (aviso == false) return;
  markUpsPreference = [
    "MARCADOR VERMELHO",
    "MARCADOR AZUL",
    "MARCADOR ROSA",
    "MARCADOR VERDE",
  ];
  localStorage.removeItem("markUpsPreference");

  let markUpElements = document.querySelectorAll(".changable");
  markUpElements.forEach((element, index) => {
    element.innerText = markUpsPreference[index];
  });

  let markUpElementsSubtitleElements =
    document.querySelectorAll(".markUpSubtitle");
  markUpElementsSubtitleElements.forEach((element, index) => {
    element.innerText = markUpsPreference[index];
  });
};

const backupFile = () => {
  let convertedMonth =
    currentMonth < 9 ? `0${currentMonth + 1}` : currentMonth + 1;
  let filename = `Backup Calendário ${date.getDate()}.${convertedMonth}.${currentYear}.txt`;

  const element = document.createElement("a");

  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + JSON.stringify(appointments)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const showingBackupUploadBox = () => {
  document.querySelector("#uploadingBackup").classList.add("active");
};

const getBackupData = (event) => {
    fetch(event.target.files[0])
    .then(response => response.text())
    .then(text => {
      console.log(text);
    })
    floaterVanisher(1)
};

// ABAIXO, DEFINIMOS AS FUNÇÕES PARA ALTERAÇÃO DO COMPROMISSO

const changingAppointment = (element) => {
  let appointmentElements = document.querySelector(".changeAppointmentBox");
  if (appointmentElements) {
    appointmentElements.remove();
  }

  let changeAppointmentBox = document.createElement("div");
  changeAppointmentBox.setAttribute("class", "changeAppointmentBox");

  for (let i = 0; i < 3; i++) {
    let changeAppointmentOption = document.createElement("p");
    changeAppointmentOption.setAttribute("class", "changeAppointmentOption");
    changeAppointmentBox.append(changeAppointmentOption);
  }

  changeAppointmentBox.children[0].innerHTML = "📋";
  changeAppointmentBox.children[0].setAttribute(
    "onclick",
    "copyToClipboard(this)"
  );
  changeAppointmentBox.children[1].innerHTML = "❌";
  changeAppointmentBox.children[1].setAttribute(
    "onclick",
    "eraseAppointment(this)"
  );
  changeAppointmentBox.children[2].innerHTML = "✔";
  changeAppointmentBox.children[2].setAttribute("onclick", "done(this)");

  element.append(changeAppointmentBox);
};

const eraseAppointment = (element) => {
  let confirmação = confirm("Deseja mesmo excluir essa tarefa?");
  if (confirmação == false) return;
  let elementParent = element.parentNode;
  appointments.splice(elementParent.parentNode.id, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  clearCalendar();
  calendarConstructor();
};

const copyToClipboard = (element) => {
  let elementParent = element.parentNode;
  var copyText = elementParent.parentNode.firstChild.innerText;

  navigator.clipboard.writeText(copyText);
  element.innerHTML = "";
  element.innerHTML = "✔";
  clearCalendar();
  calendarConstructor();
};

const done = (element) => {
  let elementParent = element.parentNode;
  let doneElement = appointments[elementParent.parentNode.id].time;
  if (doneElement.substring(0, 1) == "✔") {
    clearCalendar();
    calendarConstructor();
    return;
  }

  let confirmação = confirm(
    "Isso irá marcar a tarefa como concluída. Prosseguir?"
  );
  if (confirmação == false) {
    clearCalendar();
    calendarConstructor();
    return;
  }

  appointments[elementParent.parentNode.id].time = "✔✔ " + doneElement;
  localStorage.setItem("appointments", JSON.stringify(appointments));
  clearCalendar();
  calendarConstructor();
};

/*ABAIXO BUSCAMOS NO LOCALSTORAGE OS DADOS DE COMPROMISSOS */

let localStorageData = localStorage.getItem("appointments");

if (localStorageData) {
  appointments = JSON.parse(localStorageData);

  appointments.forEach((element, index, array) => {
    let monthDiference = date.getMonth() - element.month;
    if (monthDiference > 2 && element.year <= currentYear) {
      array.splice(index, 1);
    }
  });
}

/* ABAIXO, CONFERIMOS SE A VERSÃO QUE ERA USADA ERA A É A ATUALZIDA, E CASO NÃO, CORRIGIMOS O QUE PRECISA SER CORRIGIDO
NO CASO, A VERSÃO ANTERIOR AINDA NÃO SUPORTAVA SELECIONAR O ANO DO COMPROMISSO, E, AO SER IMPLEMENTADO ESSA FUNCIONALIDADE, PRECISAMOS SETAR O ANO PARA TODOS OS COMPROMISSOS */

let costumerPatch = localStorage.getItem("patch");

if (!costumerPatch || costumerPatch != patch) {
  appointments.map((element) => {
    if (element.year) return;
    element.year = currentYear;
  });

  localStorage.setItem("patch", patch);
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

markUpStorage(); //FUNÇÃO PARA BUSCAR NO LOCALSTORAGE OS NOMES DOS MARCADORES
calendarConstructor(); // PARA CONSTRUIR O CALENDÁRIO DO MÊS CORRENTE MOSTRADO AO ABRIR O SITE
