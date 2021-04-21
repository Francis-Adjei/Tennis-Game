var canvas;
var canvasContext;


var ballX = 50;
var ballY = 50;
var ballSpeedX = 12;
var ballSpeedY = 4;


var player1Score = 0;
var player2Score = 0;
const constWinningScore = 11;


var showingMenuScreen = true;
var showingWinScreen = false;


var paddle1Y = 250;
var paddle2Y = 250;
const constPaddleWidth = 10;
const constPaddleHeight = 100;


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}


function handleMouseClick(evt) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}


window.onload = function() {
	
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	
	var framesPerSecond = 45;
	
	setInterval(function() {
			moveEverything();
			drawEverything();	
        }, 1000/framesPerSecond);

	
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (constPaddleHeight/2);
		});
	
	canvas.addEventListener('mousedown',handleMouseClick);
}


function ballReset() {

    if (player1Score == constWinningScore) {

        showingWinScreen = true;

    } else if (player2Score == constWinningScore) {

        showingWinScreen = true;
    } 

	
    ballSpeedX = -ballSpeedX;
	
	
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}


function computerMovement() {

	var paddle2YCenter = paddle2Y + (constPaddleHeight/2);
	var paddleMovementSpeed = 8

	if(paddle2YCenter < ballY - 30) {
		paddle2Y = paddle2Y + paddleMovementSpeed;
	} else if(paddle2YCenter > ballY + 30) {
		paddle2Y = paddle2Y - paddleMovementSpeed;
	}
}

function moveEverything() {
    
    if (showingWinScreen) {
        return;
    }
    computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < 0) {
	
		if(ballY > paddle1Y &&
			ballY < paddle1Y+constPaddleHeight) {
			ballSpeedX = -ballSpeedX;
			
			
			var deltaY = ballY
					-(paddle1Y+constPaddleHeight/2);
			ballSpeedY = deltaY * 0.35;

		} else {
            player2Score++;
			ballReset();
		}
	}
	if(ballX > canvas.width) {
		
		if(ballY > paddle2Y &&
			ballY < paddle2Y+constPaddleHeight) {
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY
					-(paddle2Y+constPaddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else {
            player1Score++;
			ballReset();
		}
	}
	
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}


function drawCourt() {

    var lineColors = 'rgb(74,117,79)'
    colorRect(0,100,canvas.width,4,lineColors);
    colorRect(0,canvas.height - 100,canvas.width,4,lineColors);
    colorRect(canvas.width/4, canvas.height/2-2, canvas.width/2, 4, lineColors);
    colorRect(canvas.width/4, 100, 4, canvas.height-200, lineColors);
    colorRect(canvas.width-(canvas.width/4), 100, 4, canvas.height-200, lineColors);

    colorRect(0,0,canvas.width,4,lineColors);
    colorRect(canvas.width-4,0,4,canvas.height,lineColors);
    colorRect(0,canvas.height-4,canvas.width,4,lineColors);
    colorRect(0,0,4,canvas.height,lineColors);

    for (var i = 10; i<canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 2,i,4,20,'white');
    };
}


function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}


function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}


function drawEverything() {

	
    colorRect(0,0,canvas.width,canvas.height,'rgb(16,63,22)');
    
    if (showingWinScreen) {

		canvasContext.fillStyle = 'white';
		canvasContext.textAlign = 'center';

        if (player1Score == constWinningScore) {

			canvasContext.font = "60px Georgia";
            canvasContext.fillText("Player 1 Wins!", canvas.width/2, 250);
            showingWinScreen = true;
    
        } else if (player2Score == constWinningScore) {
            
            canvasContext.font = "60px Georgia";
            canvasContext.fillText("Player 2 Wins!", canvas.width/2, 250);
            showingWinScreen = true;
        } 

		canvasContext.font = "25px Georgia";
        canvasContext.fillText("Click to Play Again", canvas.width/2, 300);
        return;
    }

    drawCourt();

	
	colorRect(0,paddle1Y,constPaddleWidth,constPaddleHeight,'white');

	
	colorRect(canvas.width-constPaddleWidth,paddle2Y,constPaddleWidth,constPaddleHeight,'white');

	
	colorCircle(ballX, ballY, 10, 'white');

	
	canvasContext.font = "30px Georgia";
	canvasContext.fillText(player1Score, canvas.width/2 - 45, 40);
	canvasContext.fillText(player2Score, canvas.width/2 + 45, 40);
}