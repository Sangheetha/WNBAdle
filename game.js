$(document).ready(function() {
  fetch('playerData.json')
    .then((res) => res.json())
    .then((playersData) => {
      const playerNames = Object.keys(playersData);

      const FULLNAME = "fullName";
      const TEAM = "team";
      const POSITION = "position";
      const NUMBER = "number";
      const HEIGHT = "height";
      const PLAYER_FIELD_NAMES = [FULLNAME, TEAM, POSITION, HEIGHT, NUMBER];
      const DIRECTIONAL_FIELD_NAMES = [NUMBER, HEIGHT];

      // CSS class names
      const CORRECT_FIELD = "correct";
      const NEAR_FIELD = "near";
      const WRONG_FIELD = "wrong";

      // Modals
      var currentModal = null;

      var numPlayers = playerNames.length;
      let todayPlayer = playerNames[getRandomInt(numPlayers)];
      let todayPlayerData = playersData[todayPlayer];

      console.log(todayPlayer);
      console.log(todayPlayerData);

      // Show dropdown list of players
      var playersDropdownList = document.getElementById('players');

      playerNames.forEach(function(item){
        var option = document.createElement('option');
        option.value = item;
        playersDropdownList.appendChild(option);
      });

      var guesses = 0;
      var form = document.getElementById('guessInput');
      var input = document.getElementById('guess');
      var isGameWon = false;


      // On each guess a user makes...
      form.addEventListener("submit", (event) => {
        // Prevents the default form submission behaviour.
        event.preventDefault()

        // Retrieve the guess and clear the input
        var playerGuess = form.guess.value;
        input.value = '';

        if (!playerNames.includes(playerGuess)) {
            return;
        }

        // Increment the guess count
        guesses += 1;
        var guessCount = document.getElementById("guess-count");
        guessCount.innerHTML = `${guesses} of 6 guesses`;
        
        // Add a new row to the table
        playerGuessData = playersData[playerGuess]; 
        createTableRow(playerGuess, playerGuessData);

        if (guesses == 6 && !isGameWon) {
            showFailureDialog();
        }
      });

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (currentModal != null && event.target == currentModal) {
         currentModal.style.display = "none";
         currentModal = null;
      }
      }

      function createTableRow(playerGuess, playerGuessData) {
        var table = document.getElementById('tableBoard'); 
        var row = table.insertRow(-1);

        for (const field of PLAYER_FIELD_NAMES) {
            createFormattedCell(row, field, playerGuessData[field]);        
        }

        if (playerGuess == todayPlayer) {
            isGameWon = true;
            showSuccessDialog();
        }
      }

      function createFormattedCell(row, fieldName, fieldValue) {
        var cell = row.insertCell(-1);
        var div = document.createElement("div");
        if (fieldName == HEIGHT) {
          div.innerHTML = printHeight(fieldValue);
        } else {
          div.innerHTML = fieldValue;
        }
        cell.appendChild(div);

        todayPlayerFieldValue = todayPlayerData[fieldName]

        // If the field value is the same as the correct player's, color the cell green.
        if (todayPlayerFieldValue == fieldValue) {
          cell.classList.add(CORRECT_FIELD);
        } else {
          if (DIRECTIONAL_FIELD_NAMES.includes(fieldName)) {
            addArrowToCell(cell, fieldName, todayPlayerFieldValue, fieldValue);
          }
          // If the field value [for numbers/height] is within a magnitude of 2, color the cell yellow. Else, color it grey.
          if (DIRECTIONAL_FIELD_NAMES.includes(fieldName) && Math.abs(todayPlayerFieldValue - fieldValue) <= 2) {
            cell.classList.add(NEAR_FIELD);
          } else {
            cell.classList.add(WRONG_FIELD);
          }
        }
      }

      function showSuccessDialog() {
        disableInput();

        // TODO
        currentModal = document.getElementById("successModal");

        var p = document.createElement("p");
        p.innerHTML = `Today's player was ${todayPlayer}`;
        currentModalContent = currentModal.querySelector('.modal-content');
        currentModalContent.appendChild(p);

        currentModal.style.display = "block";
      }

      function showFailureDialog() {
        // TODO
        disableInput();
      }

      // Give that the correct answer and the guess have different values for this field, add the appropriate arrow to the cell. 
      function addArrowToCell(cell, fieldName, todayPlayerFieldValue, guessFieldValue) {
        switch (fieldName) {
            case NUMBER:
            case HEIGHT:
                var div = document.createElement("div");
                if (todayPlayerFieldValue < guessFieldValue) {
                    div.innerHTML = "↓";
                } else {
                    div.innerHTML = "↑";
                }
                cell.appendChild(div);
                break;
            default:
                return;
        }
      }

      function disableInput() {
        input.setAttribute('disabled','');
      }

      function printHeight(heightInInches) {
        var inches = heightInInches % 12;
        var feet = (heightInInches-inches)/12;

        return `${feet}'${inches}"`;
      }

      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
  })
});

