const express = require('express');
const app = express();
const fs = require('fs');
let cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuid4 } = require('uuid');
const usersFile = 'users.json';
const teamsFile = 'teams.json';
let folderNumber;



let usersObj = {
  "users": []
};

let teamsObj = {
  "firstTeam": [],
  "secondTeam": []
};


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To do party request
app.route('/party').get(function (req, res) {
  folderNumber = uuid4();
  let partyObj = {
    "partyId": folderNumber
  };
  let dir = ('./party/' + folderNumber);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  initJson(('./party/' + folderNumber + '/' + usersFile), usersObj);
  initJson(('./party/' + folderNumber + '/' + teamsFile), teamsObj);

  res.send(partyObj);
});

app.get('/users/:partyId', function (req, res) {
  folderNumber = req.params.partyId;
  if (fs.existsSync('./party/' + folderNumber + '/' + usersFile)) {
      fs.readFile('./party/' + folderNumber + '/' + usersFile, 'utf8', (err, jsonContent) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(jsonContent));
  });
  }
})
app.get('/teams/:partyId', function (req, res) {
  folderNumber = req.params.partyId;
  if (fs.existsSync('./party/' + folderNumber + '/' + usersFile)) {
      fs.readFile('./party/' + folderNumber + '/' + teamsFile, 'utf8', (err, jsonContent) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(jsonContent));
  });
  }
})


app.route('/users').get(function (req, res) {
  initJson('./party/' + folderNumber + '/' + usersFile, usersObj);
  fs.readFile('./party/' + folderNumber + '/' + usersFile, 'utf8', (err, jsonContent) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(jsonContent));
  });
});

app.post('/users', function (req, res) {
  if (typeof req.body.partyId == 'undefined') {
    res.send('Error party id undefined');
  } else {
    if (fs.existsSync('./party/' + folderNumber + '/' + usersFile)) {
          fs.readFile('./party/' + folderNumber + '/' + usersFile, (err, jsonContent) => {
      if (err) throw err;
      let jsonObj = JSON.parse(jsonContent);
      if (typeof req.body.newUser !== 'undefined') {
        jsonObj.users.push(req.body.newUser)
        fs.writeFile('./party/' + folderNumber + '/' + usersFile, JSON.stringify(jsonObj), function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      }
      if (typeof req.body.delUser !== 'undefined') {
        let jsonObj = JSON.parse(jsonContent);
        let arrFromUsers = jsonObj.users;
        let playerDelFromArr = req.body.delUser;
        let filtered = arrFromUsers.filter(function (value) { return value !== playerDelFromArr; })
        usersUpdate = {
          "users": filtered,
        }
        fs.writeFile('./party/' + folderNumber + '/' + usersFile, JSON.stringify(usersUpdate), function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
        fs.writeFile('./party/' + folderNumber + '/' + teamsFile, JSON.stringify(teamsObj), function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      }
      res.send('Got a POST request');
    })
    };
  }
})

app.route('/teams').get(function (req, res) {
  initJson('./party/' + folderNumber + '/' + teamsFile, teamsObj);
  fs.readFile('./party/' + folderNumber + '/' + teamsFile, 'utf8', (err, jsonContent) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(jsonContent));
  });
});

app.post('/teams', function (req, res) {
  initJson('./party/' + folderNumber + '/' + teamsFile, teamsObj);

  fs.readFile('./party/' + folderNumber + '/' + usersFile, 'utf8', (err, jsonContent) => {
    let usersArr = JSON.parse(jsonContent);
    usersArr = usersArr.users;
    shuffle(usersArr);
    let halfwayThrough = Math.floor(usersArr.length / 2)
    firstArr = usersArr.slice(0, halfwayThrough);
    secondArr = usersArr.slice(halfwayThrough, usersArr.length);
    let jsonObj = {
      "firstTeam": firstArr,
      "secondTeam": secondArr,
    }
    fs.writeFile('./party/' + folderNumber + '/' + teamsFile, JSON.stringify(jsonObj), function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
    if (err) {
      throw err;
    }
    res.send(JSON.parse(jsonContent));
  });
})

function initJson(path, paramObj) {
  try {
    if (!fs.existsSync(path)) {
      fs.writeFile(path, JSON.stringify(paramObj), (err) => {
        if (err) throw err;
        console.log('File created from zero');
      });
    }
  } catch (err) {
    console.error(err);
  }
}

app.delete('/users', function (req, res) {
  fs.writeFile('./party/' + folderNumber + '/' + usersFile, JSON.stringify(usersObj), (err) => {
    if (err) throw err;
    console.log('Users deleted');
  });
  res.send('Got a DELETE request at /users')
})

app.delete('/teams', function (req, res) {
  fs.writeFile('./party/' + folderNumber + '/' + teamsFile, JSON.stringify(teamsObj), (err) => {
    if (err) throw err;
    console.log('Teams deleted');
  });
  res.send('Got a DELETE request at /teams')
})

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = app;
