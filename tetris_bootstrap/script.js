$(document).ready(function() {
	$('#startGameScreen').fadeIn(1000);
	$("#start").mousedown(function() {
		startGame();
	});
	
	$("#arrowL").mousedown(function() {
		$(document).trigger(jQuery.Event('keydown', {keyCode: 37, which: 37}));//triggers keydown programmatically
		flash($(this));//flashes clicked button
	});
	$("#arrowR").mousedown(function() {
		$(document).trigger(jQuery.Event('keydown', {keyCode: 39, which: 39}));
		flash($(this));
	});
	$("#arrowD").mousedown(function() {
		$(document).trigger(jQuery.Event('keydown', {keyCode: 40, which: 40}));
		flash($(this));
	});
	$("#rotate").mousedown(function() {
		$(document).trigger(jQuery.Event('keydown', {keyCode: 32, which: 32}));
		flash($(this));
	});
	$("#pause").mousedown(function() {
		$(document).trigger(jQuery.Event('keydown', {keyCode: 80, which: 80}));
	});
});

function startGame() {
	$('#startGameScreen').fadeOut(200);
	$('#gameScreen').fadeIn(600);
	
	points = 0;
	prevColor = Math.floor((Math.random() * 5) + 1);
	field = new Field(11, 20);
	figure = new Figure(Math.floor((Math.random() * 7) + 1), prevColor);
	newFigure = Math.floor((Math.random() * 7) + 1);
	do{
		newColor = Math.floor((Math.random() * 5) + 1);
	}while(newColor == prevColor);
	nextFigure = new NextFigure(newFigure, newColor);
	
	field.figureLowering(true);
	
	$(document).keydown(function(e) {
		if(e.keyCode == 80) {//p
			field.figureLowering(!field.figureIsBeingLowered);
		} else if(field.figureIsBeingLowered) {
			switch(e.keyCode) {
				case 37://left
					if(!figure.checkCollisions(-1, 0))
						figure.move(-1, 0);
					break;
				case 39://right
					if(!figure.checkCollisions(1, 0))
						figure.move(1, 0);
					break;
				case 40://down
					figure.lower();
					break;
				case 32://space
					figure.rotate();
					break;
			}
		}
	});
}

function flash(button) {
	button.addClass("clicked");
	setTimeout(function() {
		button.removeClass("clicked");
	}, 100);
}

var Field = function(width, height) {
	this.width = width;
	this.height = height;
	this.margin = 20;
	this.bricksLeft = [];
	this.figureIsBeingLowered = false;

	this.field = $(".field");
	$(this.field).css('width', 30*width).css('height', 30*height);
	//							.nextFigure width, distance between,  			buttons height	
	$("main").css('width', 30*width + 30*(width-7) + 20).css('height', 30*height + 30*width/5);
	$(".nextFigure").css('width', 30*(width-7)).css('height', 30*(height-17));//4x3 field
	$(".button").css('width', 30*width/5).css('height', 30*width/5);//5 buttons width = field width
};

Field.prototype.removeFullRows = function() {
	var bricksInRows = new Array(this.height).fill(0);//creating array containing amount of bricks in every row
	
	$.each(this.bricksLeft, function(){//for each brick in a field
		bricksInRows[this.y]++;//increment value of bricks in a row
	});
	
	for(var i in bricksInRows) {//for each row
		if(bricksInRows[i] == this.width) {//if it's full
			var toRemove = [];//array with bricks to remove
			$.each(this.bricksLeft, function(){//for each brick in a field
				if(this.y == i) {//delete brick
					toRemove.push(this);//bricks goes to an array with bricks to delete
					this.brick.remove();//removing "brick" div
				} else if(this.y < i) {//lower brick
					this.move(0, 1);
				}
			});
			
			this.bricksLeft = $.grep(this.bricksLeft, function(value){//removes bricks from array with bricks left
				return $.inArray(value, toRemove) < 0;
			});
			
			points++;
			$("h3").text(points);
		}
	}
};

Field.prototype.figureLowering = function(flag) {
	if(flag) {
		figureLoweringIntervalId = setInterval(function(){
			figure.lower();
		}, 500);
		this.figureIsBeingLowered = true;
		$(".button").removeClass("inactive");
		$("#pause").removeClass("clicked");
	} else {
		clearInterval(figureLoweringIntervalId);
		this.figureIsBeingLowered = false;
		$(".button").addClass("inactive");
		$("#pause").removeClass("inactive");
		$("#pause").addClass("clicked");
	}
};

Field.prototype.finishGame = function() {
	clearInterval(figureLoweringIntervalId);
	$(document).unbind("keydown");
	$('main').fadeOut(400);
	$('#endGameScreen').fadeIn(1000);
};

var Figure = function(type, color) {
	this.type = type;
	this.color = color;
	var figure = document.createElement('div');
	this.figure = figure;
	$(this.figure).addClass("figure").appendTo($(field.field));
	this.state = 1;
	if(this.type == 1 || this.type == 4 || this.type == 5)
		this.statesAmount = 4;
	else if(this.type == 2)
		this.statesAmount = 1;
	else if(this.type == 3 || this.type == 6 || this.type == 7)
		this.statesAmount = 2;

	this.bricks = [];
	if(type==1) {//platform
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 5, 1);
	} else if(type==2) {//square
		this.bricks[0] = new Brick(this, 5, 0);
		this.bricks[1] = new Brick(this, 6, 0);
		this.bricks[2] = new Brick(this, 5, 1);
		this.bricks[3] = new Brick(this, 6, 1);
	} else if(type==3) {//line
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 7, 0);
	} else if(type==4) {//L normal
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 4, 1);
	} else if(type==5) {//L turned
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 5, 0);
		this.bricks[2] = new Brick(this, 6, 0);
		this.bricks[3] = new Brick(this, 6, 1);
	} else if(type==6) {//stairs S normal
		this.bricks[0] = new Brick(this, 6, 0);
		this.bricks[1] = new Brick(this, 5, 1);
		this.bricks[2] = new Brick(this, 6, 1);
		this.bricks[3] = new Brick(this, 5, 2);
	} else if(type==7) {//stairs S turned
		this.bricks[0] = new Brick(this, 4, 0);
		this.bricks[1] = new Brick(this, 4, 1);
		this.bricks[2] = new Brick(this, 5, 1);
		this.bricks[3] = new Brick(this, 5, 2);
	}
	
	$.each(this.bricks, function(){//for each brick in a figure
		if(this.collisionOnCreate) {
			field.finishGame();
			return false;//end of loop
		}
	});
};

Figure.prototype.lower = function() {
	if(!figure.checkCollisions(0, 1))
		figure.move(0, 1);
	else {
		for(var i in figure.bricks) {
			$(figure.bricks[i].brick).appendTo($(field.field));//moving bricks from previous figure straight onto field
			field.bricksLeft.push(figure.bricks[i]);//bricks goes to an array with left bricks
		}
		
		figure.figure.remove();//removing "figure" div
		
		field.removeFullRows();
		
		figure = new Figure(newFigure, newColor);
		
		prevColor = newColor;
		
		newFigure = Math.floor((Math.random() * 7) + 1);
		do{
			newColor = Math.floor((Math.random() * 5) + 1);
		}while(newColor == prevColor);
		
		nextFigure.removeFigure();
		nextFigure = new NextFigure(newFigure, newColor);
	}
};

Figure.prototype.checkCollisions = function(x, y) {
	for(var i in this.bricks) {
        if(this.bricks[i].checkCollisions(x, y))
			return true;
    }
	
	return false;
};

Figure.prototype.move = function(x, y) {
	for(var i in this.bricks)
		this.bricks[i].move(x, y);
};

Figure.prototype.rotate = function() {
	var shifts = [];//making array for shifts of every brick in a figure
	for(var i in this.bricks) {//creating 2nd dimension of an array
		shifts[i] = [];
		shifts[i]["x"] = 0;
		shifts[i]["y"] = 0; 
	}
	
	if(this.type == 1) {//setting shifts of bricks in a figure
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = 1;
		} else if(this.state == 2) {
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 1;
			shifts[2]["x"] = -2;
			shifts[2]["y"] = 2;
		} else if(this.state == 3) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = -1;
		} else if(this.state == 4) {
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -1;
			shifts[2]["x"] = 2;
			shifts[2]["y"] = -2;
		}
	} else if(this.type == 3) {
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -1;
			shifts[3]["x"] = -1;
			shifts[3]["y"] = 1;
		} else if(this.state == 2) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 1;
			shifts[3]["x"] = 1;
			shifts[3]["y"] = -1;
		}
	} else if(this.type == 4) {
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = 1;
			shifts[3]["x"] = 2;
			shifts[3]["y"] = 1;
		} else if(this.state == 2) {
			shifts[1]["x"] = -1;
			shifts[1]["y"] = 2;
			shifts[2]["x"] = -1;
			shifts[2]["y"] = 2;
		} else if(this.state == 3) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = -1;
			shifts[3]["x"] = -2;
			shifts[3]["y"] = -1;
		} else if(this.state == 4) {
			shifts[1]["x"] = 1;
			shifts[1]["y"] = -2;
			shifts[2]["x"] = 1;
			shifts[2]["y"] = -2;
		}
	} else if(this.type == 5) {
		if(this.state == 1) {
			shifts[0]["x"] = 1;
			shifts[0]["y"] = 2;
			shifts[1]["x"] = 1;
			shifts[1]["y"] = 2;
		} else if(this.state == 2) {
			shifts[2]["x"] = -2;
			shifts[2]["y"] = 1;
			shifts[3]["x"] = -2;
			shifts[3]["y"] = 1;
		} else if(this.state == 3) {
			shifts[0]["x"] = -1;
			shifts[0]["y"] = -2;
			shifts[1]["x"] = -1;
			shifts[1]["y"] = -2;
		} else if(this.state == 4) {
			shifts[2]["x"] = 2;
			shifts[2]["y"] = -1;
			shifts[3]["x"] = 2;
			shifts[3]["y"] = -1;
		}
	} else if(this.type == 6) {
		if(this.state == 1) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = 1;
			shifts[2]["x"] = 0;
			shifts[2]["y"] = 1;
		} else if(this.state == 2) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = -1;
			shifts[2]["x"] = 0;
			shifts[2]["y"] = -1;
		}
	} else if(this.type == 7) {
		if(this.state == 1) {
			shifts[0]["x"] = 2;
			shifts[0]["y"] = 1;
			shifts[1]["x"] = 0;
			shifts[1]["y"] = 1;
		} else if(this.state == 2) {
			shifts[0]["x"] = -2;
			shifts[0]["y"] = -1;
			shifts[1]["x"] = 0;
			shifts[1]["y"] = -1;
		}
	}

	var collisionOccurs = false;
	for(var i in this.bricks) {//checking collisions
		if(this.bricks[i].checkCollisions(shifts[i]["x"], shifts[i]["y"]))
			collisionOccurs = true;
	}
	
	if(!collisionOccurs) {//rotating figure
		for(var i in this.bricks)
			this.bricks[i].move(shifts[i]["x"], shifts[i]["y"]);
		this.state++;
		if(this.state > this.statesAmount)
			this.state -= this.statesAmount;
	}
};

var Brick = function(figure, x, y) {
	for(var i in field.bricksLeft) {//for each brick in field
		if(field.bricksLeft[i].x == x && field.bricksLeft[i].y == y) {//if collision of new brick occurs
			this.collisionOnCreate = true;
		}
	}
	
	this.figure = figure;
	this.x = x;
	this.y = y;
	var brick = document.createElement('div');
	this.brick = brick;
	$(brick).css('left', 30*x).css('top', 30*y).css("background-image", "url(images/"+this.figure.color+".png)").addClass("brick").appendTo($(this.figure.figure));
};

Brick.prototype.checkCollisions = function(x, y) {
	var newX = this.x + x;
	var newY = this.y + y;
	
	var collisionOccurs = false;
	
	if(newX<0 || newX>field.width-1 || newY<0 || newY>field.height-1)//checking field boundaries
		collisionOccurs = true;

	$.each(field.bricksLeft, function(){//checking collisions with bricks in field
		if(this.x == newX && this.y == newY) {
			collisionOccurs = true;
		}
	});
	
	if(collisionOccurs)
		return true;
	else
		return false;
};

Brick.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	$(this.brick).css('left', 30*this.x).css('top', 30*this.y);
};

var NextFigure = function(type, color) {
	this.type = type;
	this.color = color;
	var figure = document.createElement('div');
	this.figure = figure;
	$(this.figure).addClass("figure").appendTo($(".nextFigure"));

	this.bricks = [];
	if(type==1) {//platform
		this.bricks[0] = new Brick(this, 0, 1);
		this.bricks[1] = new Brick(this, 1, 1);
		this.bricks[2] = new Brick(this, 2, 1);
		this.bricks[3] = new Brick(this, 1, 2);
	} else if(type==2) {//square
		this.bricks[0] = new Brick(this, 1, 1);
		this.bricks[1] = new Brick(this, 2, 1);
		this.bricks[2] = new Brick(this, 1, 2);
		this.bricks[3] = new Brick(this, 2, 2);
	} else if(type==3) {//line
		this.bricks[0] = new Brick(this, 0, 2);
		this.bricks[1] = new Brick(this, 1, 2);
		this.bricks[2] = new Brick(this, 2, 2);
		this.bricks[3] = new Brick(this, 3, 2);
	} else if(type==4) {//L normal
		this.bricks[0] = new Brick(this, 0, 1);
		this.bricks[1] = new Brick(this, 1, 1);
		this.bricks[2] = new Brick(this, 2, 1);
		this.bricks[3] = new Brick(this, 0, 2);
	} else if(type==5) {//L turned
		this.bricks[0] = new Brick(this, 0, 1);
		this.bricks[1] = new Brick(this, 1, 1);
		this.bricks[2] = new Brick(this, 2, 1);
		this.bricks[3] = new Brick(this, 2, 2);
	} else if(type==6) {//stairs S normal
		this.bricks[0] = new Brick(this, 2, 0);
		this.bricks[1] = new Brick(this, 1, 1);
		this.bricks[2] = new Brick(this, 2, 1);
		this.bricks[3] = new Brick(this, 1, 2);
	} else if(type==7) {//stairs S turned
		this.bricks[0] = new Brick(this, 1, 0);
		this.bricks[1] = new Brick(this, 1, 1);
		this.bricks[2] = new Brick(this, 2, 1);
		this.bricks[3] = new Brick(this, 2, 2);
	}
};

NextFigure.prototype.removeFigure = function() {
	$.each(this.bricks, function(){//for each brick in a figure
		this.brick.remove();//removing "brick" div
	});
};