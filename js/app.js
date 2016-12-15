$( function() {

	var baseColours = ['#EF5780', '#FFC95C', '#5578C7', '#93EB55'],
		activeColours = ['#E7003E', '#FFAA00', '#0F3FAC', '#5EE200'],
		audioURLs = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
					'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
					'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
					'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'],
		colourSequence = [],
		playerTurn = false,
		pressCount = 0,
		strict = false;

	colourSquares();
	createAudioElements();
	setTimeout(resetGame(), 2000);

	/* DISPLAY INITIALISATION */
	function colourSquares() {
		for (var i = 0; i < 4; ++i) {
			var squareClass = buildSquareClass(i);
			$(squareClass).css("background-color", baseColours[i]);
		}
	}

	function createAudioElements() {
		for (var i = 0; i < 4; ++i) {
			var audio = document.createElement("audio");
			audio.setAttribute("src", audioURLs[i]);
			audio.setAttribute("class", "audio-" + i.toString());

			document.body.appendChild(audio);

			audio.load();
		}

		var audio = document.createElement("audio");
		audio.setAttribute("src", "https://s3-us-west-2.amazonaws.com/guylemon/Buzzer.mp3");
		audio.setAttribute("class", "audio-wrong");

		document.body.appendChild(audio);

		audio.load();
	}

	function setDisplay() {
		$("#display-count").text(colourSequence.length);
	}

	/* GAMEPLAY */
	/* handle state */
	function resetGame() {
		colourSequence = [];
		setDisplay();
		endPlayerTurn();
		pressCount = 0;

		nextTurn();
	}

	function endGame() {
		alert("YOU WON!");
	}

	$("#button-strict").change( function() {
		if($(this).is(":checked")) {
			strict = true;
		} else {
			strict = false;
		}

		return;
	})

	/* handle square click */
	$(".square").mousedown( function() {
		if (playerTurn) {

			var squareNumber = getSquareNumber(getSquareClass(this));

			if (compareToSequence(squareNumber)) {
				squarePress(squareNumber, true);

			} else {
				squarePress(squareNumber, false);
			}
		}
	});

	$(".square").mouseup( function() {
		if (playerTurn) {
			var squareNumber = getSquareNumber(getSquareClass(this));

			squareRelease(squareNumber);

			if (!compareToSequence(squareNumber)) {

				if (strict) {
					resetGame();
				} else {
					pressCount = 0;
					playSequence();
				}

			} else {
				pressCount += 1;

				if (pressCount == colourSequence.length) {

					setTimeout(nextTurn(), 1000);
				}
			}
		}
	})

	/* square events */
	function squarePress(squareNumber, correct, autorelease) {
		if (correct) {
			correctSound(squareNumber);
		} else {
			wrongSound();
		}

		changeSquareColour(squareNumber, activeColours);

		if (autorelease) {
			setTimeout(squareRelease, 500, squareNumber);
		}
	}

	function squareRelease(squareNumber) {
		changeSquareColour(squareNumber, baseColours);
	}


	function changeSquareColour(squareNumber, colourArray) {
		var squareClass = buildSquareClass(squareNumber);

    	$(squareClass).css("background-color", colourArray[squareNumber]);
	}

	/* audio events */
	function correctSound(squareNumber) {
		$(buildAudioClass(squareNumber))[0].pause();
		$(buildAudioClass(squareNumber))[0].currentTime = 0;
		$(buildAudioClass(squareNumber))[0].play();
	}

	function wrongSound() {
		$(".audio-wrong")[0].pause();
		$(".audio-wrong")[0].currentTime = 0;
		$(".audio-wrong")[0].play();
	}


	/* game logic */
	function nextTurn() {
		if (colourSequence.length == 20) {
			endGame();

			resetGame();
		}

		endPlayerTurn();

		addToSequence();
		playSequence(startPlayerTurn);

	}

	function startPlayerTurn() {
		pressCount = 0;
		playerTurn = true;

		$(".square").css("cursor", "pointer");

	}

	function endPlayerTurn() {
		playerTurn = false;


		$(".square").css("cursor", "auto");


	}

	function compareToSequence(squareNumber) {
    	if (colourSequence[pressCount] != squareNumber) {
			return false;
		} else {
			return true;
		}
	}

	function addToSequence() {
		colourSequence.push(Math.floor(Math.random() * 4));

		setDisplay();
	}

	function playSequence(callback) {
		var i = 0;
		var interval = setInterval(function(){

			squarePress(colourSequence[i], true, true);
			i++;
		 
			if (i == colourSequence.length) {
				clearInterval(interval)

				if (typeof callback == 'function') callback();
			};

		}, 800);
	}		


	/* CLASS/STRING/NUMBER HELPERS */
	function buildAudioClass(audioNumber) {
		return ".audio-" + audioNumber.toString();
	}

	function buildSquareClass(squareNumber) {
		return ".square-" + squareNumber.toString();
	}

	function getSquareClass(element) {
		return "." + $(element).attr("class").match(/\bsquare-\d\b/)[0];
	}

	function getSquareNumber(squareClass) {
		return parseInt(squareClass.match(/\d\b/));
	}



});