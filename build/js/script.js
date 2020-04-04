let myBtn = document.querySelector('#myBtn'),
  myInput = document.querySelector('#myInput'),
  myList = document.querySelector('#myList'),
  firstTeam = document.querySelector('.first-team'),
  secondTeam = document.querySelector('.second-team'),
  mapResult = document.querySelector('.map-result'),
  firstArr = [],
  secondArr = [],
  randomizePlayerBtn = document.querySelector('#randomizePlayerBtn');

myBtn.addEventListener('click', function (event) {
  event.preventDefault();
  validateForm();
})

randomizePlayerBtn.addEventListener('click', function (event) {
  event.preventDefault();
  random()
})

function addPlayer() {
  let div = document.createElement("div");
  div.className = 'player-name';
  let textNode = document.createTextNode(myInput.value);
  div.appendChild(textNode);
  document.getElementById("myList").appendChild(div);
  myInput.value = "";
}

function validateForm() {
  let x = myInput.value;
  if (x == "" || x == null) {
    alert("Name must be filled out");
    return false;
  } else {
    addPlayer();
  }
}

function random() {
  let allNamesArr = [];
  let allNames = document.querySelectorAll('.player-name');
  
  allNames.forEach(function (elem) {
    allNamesArr.push(elem.innerText);
  })

  // // without forEach version
  // for (let i = 0; i < allNames.length; i++) {
  //   allNamesArr.push(allNames[i].innerText);
  // }

  shuffle(allNamesArr);

  firstArr = allNamesArr.slice(0, 5);
  secondArr = allNamesArr.slice(5, 10);
  console.log(firstArr);
  console.log(secondArr);
  
  createTeam(firstArr, secondArr);
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createTeam(firstArr, secondArr) {
  let firstStr = firstArr.join(', ');
  let secondStr = secondArr.join(', ');

  console.log(firstStr);
  console.log(secondStr);
  firstTeam.innerHTML = `<span>Team 1:</span> ${firstStr}`;
  secondTeam.innerHTML = `<span>Team 2:</span> ${secondStr}`;
}


function getSelectedCheckboxValues(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  let values = [];
  checkboxes.forEach((checkbox) => {
    // this validate don't works
    if (checkbox.checked == false ){
      mapResult.innerHTML = `Check maps for random`;
      return false;
    } else {      
      values.push(checkbox.value);
    }
  });
  return values;
}

const btn = document.querySelector('#randomizeMapBtn');
btn.addEventListener('click', (event) => {
  let checkedMaps = [];
  checkedMaps = getSelectedCheckboxValues('map');
  shuffle(checkedMaps);
  checkedMaps = checkedMaps.slice(0, 1)
  mapResult.innerHTML = checkedMaps;
});

