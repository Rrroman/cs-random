let addPlayerBtn = document.querySelector('#addPlayerBtn'),
  delAllPlayers = document.querySelector('#delAllPlayers'),
  randomizeTeam = document.querySelector('#randomizeTeam'),
  joinInput = document.querySelector('#joinInput'),
  userInput = document.querySelector('#userInput'),
  myList = document.querySelector('#myList'),
  createPartyBtn = document.querySelector('#createPartyBtn'),
  joinPartyBtn = document.querySelector('#joinPartyBtn'),
  firstTeam = document.querySelector('.first-team'),
  secondTeam = document.querySelector('.second-team'),
  pasteName = document.querySelector('.paste-name'),
  partyId = document.querySelector('.party-id'),
  partyLink = document.querySelector('.party__link'),
  usersJsonPath = "http://192.168.0.101:5000/users",
  teamsJsonPath = "http://192.168.0.101:5000/teams",
  partyJsonPath = "http://192.168.0.101:5000/party",
  socket = io.connect("http://192.168.0.101:5000"),
  folderNumber,
  firstArr = [],
  secondArr = [],
  allNamesArr = [],
  firstTeamArr = [],
  secondTeamArr = [],
  request = new XMLHttpRequest();



createPartyBtn.addEventListener('click', function (event) {
  event.preventDefault();
  addPlayerBtn.disabled = false;
  delAllPlayers.disabled = false;
  randomizeTeam.disabled = false;
  removeName();
  loadJSON(function (json) {
    partyId = json.partyId;
    partyLink.innerHTML = `Party ID: ${partyId}`;
  }, partyJsonPath);
})

joinPartyBtn.addEventListener('click', function (event) {
  event.preventDefault();
  removeName();
  addPlayerBtn.disabled = false;
  delAllPlayers.disabled = false;
  randomizeTeam.disabled = false;
  partyId = joinInput.value;

  if (partyId == undefined || partyId == "" || partyId == null) {
    partyId.innerHTML = "Please enter party id";
    return false;
  } 

  loadJSON(function (json) {
    allNamesArr = json.users;
    for (let i = 0; i < allNamesArr.length; i++) {
      let div = document.createElement("div");
      div.className = 'player-name';
      let str = "X";
      document.styleSheets[0].addRule('div.player-name:before', 'content: "' + str + '";');
      let printName = document.createTextNode(allNamesArr[i]);
      div.appendChild(printName);
      document.getElementById("myList").appendChild(div);
    }
    let playerName = document.querySelectorAll('.player-name');
    playerName.forEach(element => {
      removeOnePlayer(element);
    });
  }, usersJsonPath + '/' + partyId);

  loadJSON(function (json) {
    firstTeamArr = json.firstTeam;
    secondTeamArr = json.secondTeam;

    if (Array.isArray(firstTeamArr) && firstTeamArr.length || Array.isArray(secondTeamArr) && secondTeamArr.length) {
      createTeam(firstTeamArr, secondTeamArr);
    }
    else {
      console.log("Error in script.js - array firstTeamArr or secondTeamArr is empty");
    }
  }, teamsJsonPath + '/' + partyId);

})

addPlayerBtn.addEventListener('click', function (event) {
  event.preventDefault();
  validateForm();
})

delAllPlayers.addEventListener('click', function (event) {
  event.preventDefault();
  socket.emit('delAllPlayers');
})
socket.on('delAllPlayers', function () {
  removeName();
  deleteTeams();
})

randomizeTeam.addEventListener('click', function (event) {
  event.preventDefault();
  random(allNamesArr);
})


function deletePlayers() {
  request.open("DELETE", usersJsonPath);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send();
  request.onload = () => {
    if (request.status === 200) {
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    };
    loadJSON(function (json) {
      return allNamesArr = json.users;
    }, usersJsonPath);
  };
}

function deleteTeams() {
  request.open("DELETE", teamsJsonPath);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send();
  request.onload = () => {
    if (request.status === 200) {
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
    deletePlayers();
  };
}

function removeName() {
  myList.innerHTML = "";
  firstTeam.innerHTML = `<span>Team 1:</span>`;
  secondTeam.innerHTML = `<span> Team 2:</span>`;
}

function removeTeams() {
  firstTeam.innerHTML = `<span>Team 1:</span>`;
  secondTeam.innerHTML = `<span> Team 2:</span>`;
}

function remove(el) {
  let element = el;
  element.remove();
}

function addPlayer() {
  let textNode = document.createTextNode(userInput.value);  



  userInput.value = "";

  let jsonData = {
    "partyId": partyId,
    "newUser": textNode.data
  }

  request.open("POST", usersJsonPath);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(jsonData));
  request.onload = () => {
    if (request.status === 200) {
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
    loadJSON(function (json) {
      let playerName = document.querySelectorAll('.player-name');
      playerName.forEach(element => {
        removeOnePlayer(element);
      });
      return allNamesArr = json.users;
    }, usersJsonPath);
  };
  socket.emit('addPlayerData', jsonData);
}

socket.on('addPlayerData', function (data) {
  data = JSON.parse(data);
  let textNode = document.createTextNode(data.newUser);
  let div = document.createElement("div");
  div.className = 'player-name';
  let str = "X";
  document.styleSheets[0].addRule('div.player-name:before', 'content: "' + str + '";');
  div.appendChild(textNode);
  document.getElementById("myList").appendChild(div);
})

function validateForm() {
  let x = userInput.value;
  if (x == "" || x == null) {
    pasteName.innerHTML = "Name must be filled out";
    return false;
  } else {
    addPlayer();
  }
}

function random() {
  request.open("POST", teamsJsonPath);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send();
  request.onload = () => {
    if (request.status === 200) {
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
    loadJSON(function (json) {
      firstTeamArr = json.firstTeam;
      secondTeamArr = json.secondTeam;
      createTeam(firstTeamArr, secondTeamArr);
      socket.emit('randomizeTeam', json);
    }, teamsJsonPath);
  };
  socket.on('randomizeTeam', function (data) {
    data = JSON.parse(data);
    firstTeamArr = data.firstTeam;
    secondTeamArr = data.secondTeam;
    createTeam(firstTeamArr, secondTeamArr);
  })
}


function createTeam(firstTeamArr, secondTeamArr) {
  let firstStr = firstTeamArr.join(', ');
  let secondStr = secondTeamArr.join(', ');

  firstTeam.innerHTML = `<span>Team 1: </span> <span class="first-team__text">${firstStr}</span>`;
  secondTeam.innerHTML = `<span>Team 2: </span> <span class="second-team__text">${secondStr}</span>`;

}


function loadJSON(callback, path) {
  var xObj = new XMLHttpRequest();
  xObj.overrideMimeType("application/json");
  xObj.open('GET', path, true);
  xObj.onreadystatechange = function () {
    if (xObj.readyState == 4 && xObj.status == "200") {
      callback(JSON.parse(xObj.responseText));
    }
  };
  xObj.send(null);
}

function removeOnePlayer(element) {
    element.addEventListener('click', function () {
      let delElem = this.innerHTML;
      let delElemObj = {
        "delElem": delElem,
      }
      socket.emit('removeOnePlayer', delElemObj);
      let playerDelFromArr = {
        "partyId": partyId,
        "delUser": this.innerHTML
      }

      request.open("POST", usersJsonPath);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.send(JSON.stringify(playerDelFromArr));
      request.onload = () => {
        if (request.status === 200) {
        } else {
          console.log(`error ${request.status} ${request.statusText}`);
        };
      };
    })
}
socket.on('removeOnePlayer', function (data) {
  data = JSON.parse(data);
  let elementToDel = data.delElem;
  let playerName = document.querySelectorAll(".player-name");
  playerName.forEach(function (el) {
    if (el.innerHTML.indexOf(elementToDel) !== -1) {
      console.log(el);
      remove(el);
    }
  });
  removeTeams();
})


