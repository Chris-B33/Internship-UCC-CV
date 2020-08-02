const canvas 	= document.getElementById("game-window");
const ctx 	= canvas.getContext("2d");
canvas.width 	= 1200
canvas.height 	= 1018

//###################################################

//***VARIABLES***
const speed 		= 3;
var level 		= 0;
var collisionLeft 	= 0;
var collisionRight 	= 0;
var hasMoved 		= 0;

//###################################################

//***IMAGES***
// Background Image
bgImage 		= new Image();

// Hero Image
heroImage 		= new Image();
heroImage.src 		= "imgs/hero-1.png";

// Block Image
blockImage 		= new Image();

// Prompt Image
promptImage 		= new Image();
promptImage.src 	= "imgs/prompt.png";

// Completion Image
completedImage 		= new Image();
completedImage.src 	= "imgs/backgrounds/completed.png";

// Move Image
moveImage 		= new Image();
moveImage.src		= "imgs/objs/move.png"

// Main Image
mainImage 		= new Image();

// Codes Image
codesImage 		= new Image();
codesImage.src 		= "imgs/codes.png"

//###################################################

//***SOUNDS***
var main_theme 		= new Audio("sounds/main_theme.mp3");

var level_theme 	= new Audio("sounds/level_theme.mp3");

var enter 		= new Audio("sounds/enter_level.mp3");

var cv_audio 		= new Audio("sounds/cv.mp3");

var completed_audio 	= new Audio("sounds/completed.mp3");

//###################################################

//***OBJECTS***
//*Single objects*
var hero = {
	x: canvas.width/2-20,
	y: 760,
	width: 40,
	height: 40,
	x_velocity: 0,
	y_velocity: 0,
	isGrounded: 1
};

var lvl = {
	x: 0,
	width: 0,
	x_velocity: 0,
};

//*Constructors*
// Enemy for level 2+
function Enemy(x,y,width,height,direction,id){
	this.start_x 		= x;
	this.start_y 		= y;
	this.movement 		= x;
	this.x 			= x;
	this.y 			= y;
	this.y_velocity 	= 0;
	this.width 		= width;
	this.height 		= height;
	this.reverse 		= direction;
	this.id 		= id;
	
	// Set up image
	var imageFile 		= new Image();
	
	// Return to original position
	this.start = function(){
		this.y 		= y;
		this.movement 	= x;
		this.reverse 	= direction;
	};
	
	// Update position and image
	this.update = function(){
		// Add Gravity
		this.y_velocity += speed*0.3;
		
		// Change image to suit direction
		if (this.id==1){
			if (this.reverse==-1){
				imageFile.src = "imgs/objs/enemy1.png";
			}
			else {
				imageFile.src = "imgs/objs/enemy3.png";
			}
		}
		else if (this.id==2){
			if (this.reverse==-1){
				imageFile.src = "imgs/objs/enemy2.png";
			}
			else {
				imageFile.src = "imgs/objs/enemy4.png";
			}
		};
		
		// Check if enemy has collided with object
		if (level == 2){
			for (var i=0; i<level_two_collidable.length; i++){
				if (collisionDetectionTop(this, level_two_collidable[i])==true){
					this.y_velocity = 0;
					this.y = level_two_collidable[i].y-this.height;
					break;
				}
				if (collisionDetectionLeft(this, level_two_collidable[i])==true){
					this.reverse = -1;
					this.x = level_two_collidable[i].x-this.width;
					break;
				};
				if (collisionDetectionRight(this, level_two_collidable[i])==true){
					this.reverse = 1;
					this.x = level_two_collidable[i].x+level_two_collidable[i].width;
					break;
				};
			}
		}
		else if (level == 3){
			for (var i=0; i<level_three_collidable.length; i++){
				if (collisionDetectionTop(this, level_three_collidable[i])==true){
					this.y_velocity = 0;
					this.y = level_two_collidable[i].y-this.height;
					break;
				}
				if (collisionDetectionLeft(this, level_three_collidable[i])==true){
					this.reverse = -1;
					this.x = level_three_collidable[i].x-this.width;
					break;
				};
				if (collisionDetectionRight(this, level_three_collidable[i])==true){
					this.reverse = 1;
					this.x = level_three_collidable[i].x+level_three_collidable[i].width;
					break;
				};
			}
		}
		else if (level == 4){
			for (var i=0; i<level_four_collidable.length; i++){
				if (collisionDetectionTop(this, level_four_collidable[i])==true){
					this.y_velocity = 0;
					this.y = level_four_collidable[i].y-this.height;
					break;
				}
				if (collisionDetectionLeft(this, level_four_collidable[i])==true){
					this.reverse = -1;
					this.x = level_four_collidable[i].x-this.width;
					break;
				};
				if (collisionDetectionRight(this, level_four_collidable[i])==true){
					this.reverse = 1;
					this.x = level_four_collidable[i].x+level_four_collidable[i].width;
					break;
				};
			}
		};
		
		// Position
		if (this.id==1){
			this.movement+=speed/3*this.reverse;
		}
		else if (this.id==2){
			this.movement+=speed*2*this.reverse;
		};
		
		this.x 			= this.movement + lvl.x;
		this.y 			+= this.y_velocity;
		this.y_velocity *= 0.9;
		
		// Draw Image
		ctx.drawImage(imageFile, this.x, this.y);
	};
};

// Floor for every level
function Floor(x,y,width,height){
	this.start_x 		= x;
	this.x 			= x;
	this.y 			= y;
	this.width 		= width;
	this.height 		= height;
	
	// Set up image object
	var imageFile 		= new Image();
	imageFile.src 		= "imgs/objs/floor.png";
		
	// Function to update image and position
	this.update = function(){
		this.x = this.start_x + lvl.x; 	// Position
		
		ctx.drawImage(imageFile, this.x, this.y) // Draw Image
	}
};

// Blocks
function Block(x,y,width,height,id){
	this.start_x 		= x;
	this.x 			= x;
	this.y 			= y;
	this.width 		= width;
	this.height 		= height;
	
	// Set up image
	var imageFile 		= new Image();
	this.imageId 		= id;
	
	// Function to update image and position
	this.update = function(){
		// Position
		this.x 	= this.start_x + lvl.x;
		
		// Change image source based on ID
		if (this.imageId==1){imageFile.src="imgs/objs/block1.png"};
		if (this.imageId==2){imageFile.src="imgs/objs/block2.png"};
		if (this.imageId==3){imageFile.src="imgs/objs/block3.png"};
		
		// Draw Image
		ctx.drawImage(imageFile, this.x, this.y);
	}
};

// Background moving objects
function Background_Obj(x,y,width,height,id){
	this.start_x 		= x;
	this.x 			= x;
	this.y 			= y;
	this.movement 		= x;
	
	// Set up image object
	var imageFile = new Image();
	this.imageId = id;
	
	if (imageId==1){imageFile.src="imgs/backgrounds/clouds.png"};
	if (imageId==2){imageFile.src="imgs/backgrounds/mountains.png"};
	
	this.update = function(){
		// Position
		this.movement += speed*0.1;
		
		if (imageId==1){
			this.x 	= this.movement + lvl.x/2;
		}
		else if (imageId==2){
			this.x 	= this.start_x + lvl.x/4;
		};
		
		// Draw Image
		ctx.drawImage(imageFile, this.x, this.y)
	}
}

// Other Objects
function Obj(x,y,width,height,id){
	this.start_x 	= x;
	this.x 		= x;
	this.y 		= y;
	this.width 	= width;
	this.height 	= height;
	
	// Set up image object
	var imageFile 	= new Image();
	// ID for Image File Source
	this.imageId 	= id;
	
	// Function to update image and position
	this.update = function(){
		// Position
		this.x 	= this.start_x + lvl.x;
		
		// Change image source based on ID
		if (this.imageId==0){imageFile.src="imgs/objs/main.png"};
		if (this.imageId==1){imageFile.src="imgs/objs/start.png"};
		if (this.imageId==2){imageFile.src="imgs/objs/end.png"};
		if (this.imageId==3){imageFile.src="imgs/objs/title.png"};
		if (this.imageId==4){imageFile.src="imgs/objs/cv_check.png"};
		if (this.imageId==6){imageFile.src="imgs/objs/jump.png"};
		if (this.imageId==7){imageFile.src="imgs/objs/avoid.png"};
		if (this.imageId==8){imageFile.src="imgs/objs/is-fast.png"};
		
		// Draw Image
		ctx.drawImage(imageFile, this.x, this.y)
	}
};

function Main(){
	this.update = function(){
		if (completed==0){mainImage.src = "imgs/objs/main/main-1.png"};
		if (completed==1){mainImage.src = "imgs/objs/main/main-2.png"};
		if (completed==2){mainImage.src = "imgs/objs/main/main-3.png"};
		if (completed==3){mainImage.src = "imgs/objs/main/main-4.png"};
		if (completed==4){mainImage.src = "imgs/objs/main/main-4.png"};
		
		ctx.drawImage(mainImage, 0, 452);
	};
};

//###################################################

//***FUNCTIONS***
// Draws background and creates objects in level
function createLevel(){
	bgImage.src = "imgs/backgrounds/level_background.png";
	if (level == 0){
		lvl.x 		= 0;
		lvl.width 	= 1200;
	}
	else if (level==4){
		lvl.width 	= 9000;
	}
	else {
		lvl.width 	= 5000;
	}
	// Draw Background (Sky)
	ctx.drawImage(bgImage,0,0);
	
	// Draw moving background elements (Mts, Clouds)
	for (var i=0; i<level_background.length; i++){
		level_background[i].update();
	};
	
	// Draw foreground (Enemies, Paths)
	updateObjects();
};

// COLLISION DETECTION
function collisionDetectionTop(obj1, obj2){ // TESTS IF YOU ARE ON TOP OF AN OBJECT
	if (	obj1.y < obj2.y &&
		obj1.y + obj1.height > obj2.y &&
		obj1.x + obj1.width > obj2.x &&
		obj1.x < obj2.x + obj2.width)  
	{ // If standing on something
		return true
	}
	
	else { // If not
		return false
	}
}

function collisionDetectionBottom(obj1, obj2){ // TESTS IF YOU HITTING AN OBJECT FROM BELOW
	if (	obj1.y > obj2.y &&
		obj1.y < obj2.y + obj2.height &&
		obj1.x > obj2.x &&
		obj1.x + obj1.width < obj2.x + obj2.width)  
	{ // If hitting something from below
		return true
	}
	
	else { // If not
		return false
	}
}

function collisionDetectionLeft(obj1, obj2){ // TESTS IF YOU ARE HITTING FROM THE LEFT SIDE
	if (	obj1.x < obj2.x &&
		obj1.x + obj1.width > obj2.x &&
		obj1.y < obj2.y + obj2.height&&
		obj1.y > obj2.y)
	{
		return true
	}
	
	else {
		return false
	}
}

function collisionDetectionRight(obj1, obj2){ // TESTS IF YOU ARE HITTING FROM THE RIGHT SIDE SIDE
	if (	obj1.x < obj2.x + obj2.width &&
		obj1.x + obj1.width > obj2.x + obj2.width &&
		obj1.y < obj2.y + obj2.height &&
		obj1.y > obj2.y)
	{
		return true
	}
	
	else { 
		return false
	}
}

// Update each object's position and image
function updateObjects(){
	for (var i=0; i<level_background.length; i++){
		level_background[i].update();
	};
	if (level==0){for (var i=0; i<main_collidable.length; i++){main_collidable[i].update()}
				for (var i=0; i<main_uncollidable.length; i++){main_uncollidable[i].update()}}
	if (level==1){for (var i=0; i<level_one_collidable.length; i++){level_one_collidable[i].update()}
				for (var i=0; i<level_one_uncollidable.length; i++){level_one_uncollidable[i].update()}}
	if (level==2){for (var i=0; i<level_two_collidable.length; i++){level_two_collidable[i].update()}
				for (var i=0; i<level_two_uncollidable.length; i++){level_two_uncollidable[i].update()}
				for (var i=0; i<level_two_enemies.length; i++){level_two_enemies[i].update()}}
	if (level==3){for (var i=0; i<level_three_collidable.length; i++){level_three_collidable[i].update()}
				for (var i=0; i<level_three_uncollidable.length; i++){level_three_uncollidable[i].update()}
				for (var i=0; i<level_three_enemies.length; i++){level_three_enemies[i].update()}}
	if (level==4){for (var i=0; i<level_four_uncollidable.length; i++){level_four_uncollidable[i].update()}
				for (var i=0; i<level_four_collidable.length; i++){level_four_collidable[i].update()}
				for (var i=0; i<level_four_enemies.length; i++){level_four_enemies[i].update()}}
}

// Finish Level
function finish(){
	if (completed < level) {
		completed = level;
		cv_audio.play();
	};
	level_theme.pause();
	level_theme.currentTime = 0;
	if (level==4){
		clearInterval(loop);
		completed_audio.play()
		ctx.drawImage(completedImage,0,0);
	}
	else {
		level = 0;
		main_theme.play();
	}
};

function died(){
	level 	= 0;
	hero.x 	= canvas.width/2;
	hero.y 	= floor_main.y-hero.height;
	lvl.x 	= 0;
};

//###################################################

//***READ INPUTS***
// Current keys pressed list
keysDown = {};

// Adding keys to list
addEventListener("keydown", function(e){
	keysDown[e.keyCode] = true;
}, false);

// Deleting keys from list
addEventListener("keyup", function(e){ 
	delete keysDown[e.keyCode];
}, false);

//###################################################

var level_background = [];
var main_collidable = [];
var main_uncollidable = [];

// \ Main Menu /
let floor_main 		= new Floor(0, 798, 1200);
let main_object 	= new Main(0, floor_main.y-350, 1200, 350, 0);
let cv_check 		= new Obj(90, canvas.height/2-300, 375, 300, 200, 4)

main_collidable.push(floor_main);
main_uncollidable.push(main_object);
main_uncollidable.push(cv_check);


// \ Level One /
var level_one_collidable = [];
var level_one_uncollidable = [];

let floor_one 		= new Floor(0, 798, 6000, 100);
let jump 		= new Obj(1000, 300, 300, 200, 6);

// First Obstacle
let stairs1 		= new Block(1200, floor_one.y-50, 150, 100, 1);
let stairs2 		= new Block(1350, floor_one.y-100, 150, 200, 1);
let stairs3 		= new Block(1500, floor_one.y-150, 150, 200, 1);
let stairs4 		= new Block(1650, floor_one.y-50, 150, 100, 1);

// Second Obstacle
let ceiling1 		= new Block(2400, 0, 150, floor_one.-200, 1);
let ceiling2 		= new Block(2550, 0, 150, floor_one.-250, 1);
let ceiling3 		= new Block(2700, 0, 150, floor_one.-250, 1);
let ceiling4 		= new Block(2850, 0, 150, floor_one.-250, 1);
let ceiling5 		= new Block(3000, 0, 150, floor_one.-200, 1);

let stairs5 		= new Block(2400, floor_one.y-50, 150, 100, 1);
let tunnel_floor_1 	= new Block(2550, floor_one.y-100, 150, 100, 1);
let tunnel_floor_2 	= new Block(2700, floor_one.y-100, 150, 100, 1);
let tunnel_floor_3 	= new Block(2850, floor_one.y-100, 150, 100, 1);
let stairs6 		= new Block(3000, floor_one.y-50, 150, 100, 1);

let tunnel_wall_1 	= new Block(2400, floor_one.y-200, 150, 150, 2);
let tunnel_wall_2 	= new Block(2550, floor_one.y-250, 150, 150, 2);
let tunnel_wall_3 	= new Block(2700, floor_one.y-250, 150, 150, 2);
let tunnel_wall_4 	= new Block(2850, floor_one.y-250, 150, 150, 2);
let tunnel_wall_5 	= new Block(3000, floor_one.y-200, 150, 150, 2);

// Start and End
let start1		= new Obj(0, 578, 500, 400, 1);
let end1 		= new Obj(5000-600-300, floor_one.y-150, 600, 150, 2);

level_one_collidable.push(floor_one);
level_one_collidable.push(jump);
level_one_collidable.push(stairs1);
level_one_collidable.push(stairs2);
level_one_collidable.push(stairs3);
level_one_collidable.push(stairs4);
level_one_collidable.push(ceiling1);
level_one_collidable.push(ceiling2);
level_one_collidable.push(ceiling3);
level_one_collidable.push(ceiling4);
level_one_collidable.push(ceiling5);
level_one_collidable.push(stairs5);
level_one_collidable.push(tunnel_floor_1);
level_one_collidable.push(tunnel_floor_2);
level_one_collidable.push(tunnel_floor_3);
level_one_collidable.push(stairs6);
level_one_uncollidable.push(tunnel_wall_1);
level_one_uncollidable.push(tunnel_wall_2);
level_one_uncollidable.push(tunnel_wall_3);
level_one_uncollidable.push(tunnel_wall_4);
level_one_uncollidable.push(tunnel_wall_5);
level_one_uncollidable.push(start1)
level_one_uncollidable.push(end1);


// \ Level Two /
var level_two_collidable = [];
var level_two_uncollidable = [];
var level_two_enemies 	= [];

let floor_two 		= new Floor(0, 798, 6000);
let avoid 		= new Obj(1000, 300, 200, 200, 7);

// First Obstacle
let pit_wall_1 		= new Block(1200, floor_two.y-100, 150, 100, 1);
let pit_wall_2 		= new Block(2250, floor_two.y-100, 150, 100, 1);

let pit_pillar_1 	= new Block(1450, floor_two.y-170, 150, 300, 1);
let pit_pillar_2 	= new Block(2000, floor_two.y-170, 150, 300, 1);
let pit_pillar_3 	= new Block(1725, floor_two.y-200, 150, 300, 1);

let enemy_two_1 	= new Enemy(1375, floor_two.y-50, 48, 33, -1, 1);
let enemy_two_2 	= new Enemy(1675, floor_two.y-50, 48, 33, -1, 1);
let enemy_two_3 	= new Enemy(1975, floor_two.y-50, 48, 33, -1, 1);
let enemy_two_4 	= new Enemy(2250, floor_two.y-50, 48, 33, -1, 1);

// Second Obstacle
let pillar1 		= new Block(2400, floor_two.y-100, 150, 100, 1);
let pillar2 		= new Block(3500, floor_two.y-100, 150, 100, 1);
let pillar3 		= new Block(3650, floor_two.y-50, 150, 100, 1);

let enemy_two_5 	= new Enemy(2450, floor_two.y-50, 48, 33, 1, 1);
let enemy_two_6 	= new Enemy(2650, floor_two.y-50, 48, 33, 1, 1);
let enemy_two_7 	= new Enemy(2850, floor_two.y-50, 48, 33, 1, 1);

// Start and End
let start2 		= new Obj(0, 578, 500, 400, 1);
let end2 		= new Obj(5000-600-300, floor_two.y-150, 600, 150, 2);

level_two_collidable.push(floor_two);
level_two_collidable.push(pit_wall_1);
level_two_collidable.push(pit_wall_2);
level_two_collidable.push(pit_pillar_1);
level_two_collidable.push(pit_pillar_2);
level_two_collidable.push(pit_pillar_3);
level_two_collidable.push(pillar1);
level_two_collidable.push(pillar2);
level_two_collidable.push(pillar3);
level_two_uncollidable.push(avoid);
level_two_uncollidable.push(start2);
level_two_uncollidable.push(end2);
level_two_enemies.push(enemy_two_1);
level_two_enemies.push(enemy_two_2);
level_two_enemies.push(enemy_two_3);
level_two_enemies.push(enemy_two_4);
level_two_enemies.push(enemy_two_5);
level_two_enemies.push(enemy_two_6);
level_two_enemies.push(enemy_two_7);


// \ Level Three /
var level_three_collidable = [];
var level_three_uncollidable = [];
var level_three_enemies = [];

let floor_three 		= new Floor(0, 798, 6000, 100);
let is_fast 			= new Obj(1000, 300, 200, 200, 8);

// First Obstacle
let small_wall_1 		= new Block(1000, floor_three.y-50, 150, 50,1);
let small_wall_2 		= new Block(1850, floor_three.y-50, 150, 50,1);

let enemy_three_1 		= new Enemy(1950, floor_three.y-50, 48, 32, -1, 2);

// Second Obstacle
let small_wall_3 		= new Block(2000, floor_three.y-100, 150, 100, 1);

let tunnel_ceiling_three_1 	= new Block(2150, floor_three.y-200, 150, 50, 1);

let tunnel_ceiling_three_2 	= new Block(2300, floor_three.y-250, 150, 100, 1);
let tunnel_ceiling_three_3 	= new Block(2600, floor_three.y-300, 150, 150, 1);
let tunnel_ceiling_three_4 	= new Block(2900, floor_three.y-300, 150, 150, 1);
let tunnel_ceiling_three_5 	= new Block(3200, floor_three.y-250, 150, 100, 1);
let tunnel_ceiling_three_6 	= new Block(3350, floor_three.y-200, 150, 50, 1);

let tunnel_three_wall_1 	= new Block(2150, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_2 	= new Block(2300, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_3 	= new Block(2450, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_4 	= new Block(2600, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_5 	= new Block(2750, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_6 	= new Block(2900, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_7 	= new Block(3050, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_8 	= new Block(3200, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_9 	= new Block(3350, floor_three.y-150, 150, 150, 2);
let tunnel_three_wall_10 	= new Block(2750, floor_three.y-225, 150, 150, 2);
let tunnel_three_wall_11 	= new Block(2750, floor_three.y-250, 150, 150, 2);
let tunnel_three_wall_12 	= new Block(2450, floor_three.y-225, 150, 150, 2);
let tunnel_three_wall_13 	= new Block(3050, floor_three.y-225, 150, 150, 2);

let tunnel_floor_three_1 	= new Block(2150, floor_three.y, 150, 150, 1);
let tunnel_floor_three_2 	= new Block(2300, floor_three.y, 150, 150, 1);
let tunnel_floor_three_3 	= new Block(2450, floor_three.y, 150, 150, 1);
let tunnel_floor_three_4 	= new Block(2600, floor_three.y, 150, 150, 1);
let tunnel_floor_three_5 	= new Block(2750, floor_three.y, 150, 150, 1);
let tunnel_floor_three_6 	= new Block(2900, floor_three.y, 150, 150, 1);
let tunnel_floor_three_7 	= new Block(3050, floor_three.y, 150, 150, 1);
let tunnel_floor_three_8 	= new Block(3200, floor_three.y, 150, 150, 1);
let tunnel_floor_three_9 	= new Block(3350, floor_three.y, 150, 150, 1);

let small_wall_4 		= new Block(3500, floor_three.y-100, 150, 100, 1);
let small_wall_5 		= new Block(3650, floor_three.y-50, 150, 50, 1);

let enemy_three_2 		= new Enemy(2300, floor_three.y-50, 48, 32, 1, 2);
let enemy_three_3 		= new Enemy(3200, floor_three.y-50, 48, 32, -1, 2);
let enemy_three_4 		= new Enemy(2500, floor_three.y-250, 48, 32, 1, 1);
let enemy_three_5 		= new Enemy(3000, floor_three.y-250, 48, 32, -1, 1);

// Start and End
let start3 			= new Obj(0, 578, 50, 400, 1);
let end3 			= new Obj(5000-600-300, floor_three.y-150, 600, 150, 2);

level_three_collidable.push(floor_three);
level_three_collidable.push(small_wall_1);
level_three_collidable.push(small_wall_2);
level_three_collidable.push(small_wall_3);
level_three_collidable.push(tunnel_ceiling_three_1);
level_three_collidable.push(tunnel_ceiling_three_2);
level_three_collidable.push(tunnel_ceiling_three_3);
level_three_collidable.push(tunnel_ceiling_three_4);
level_three_collidable.push(tunnel_ceiling_three_5);
level_three_collidable.push(tunnel_ceiling_three_6);
level_three_collidable.push(small_wall_4);
level_three_collidable.push(small_wall_5);
level_three_uncollidable.push(is_fast);
level_three_uncollidable.push(tunnel_three_wall_1);
level_three_uncollidable.push(tunnel_three_wall_2);
level_three_uncollidable.push(tunnel_three_wall_3);
level_three_uncollidable.push(tunnel_three_wall_4);
level_three_uncollidable.push(tunnel_three_wall_5);
level_three_uncollidable.push(tunnel_three_wall_6);
level_three_uncollidable.push(tunnel_three_wall_7);
level_three_uncollidable.push(tunnel_three_wall_8);
level_three_uncollidable.push(tunnel_three_wall_9);
level_three_uncollidable.push(tunnel_three_wall_10);
level_three_uncollidable.push(tunnel_three_wall_11);
level_three_uncollidable.push(tunnel_three_wall_12);
level_three_uncollidable.push(tunnel_three_wall_13);
level_three_uncollidable.push(tunnel_floor_three_1);
level_three_uncollidable.push(tunnel_floor_three_2);
level_three_uncollidable.push(tunnel_floor_three_3);
level_three_uncollidable.push(tunnel_floor_three_4);
level_three_uncollidable.push(tunnel_floor_three_5);
level_three_uncollidable.push(tunnel_floor_three_6);
level_three_uncollidable.push(tunnel_floor_three_7);
level_three_uncollidable.push(tunnel_floor_three_8);
level_three_uncollidable.push(tunnel_floor_three_9);
level_three_uncollidable.push(start3);
level_three_uncollidable.push(end3);
level_three_enemies.push(enemy_three_1);
level_three_enemies.push(enemy_three_2);
level_three_enemies.push(enemy_three_3);
level_three_enemies.push(enemy_three_4);
level_three_enemies.push(enemy_three_5);


// \ Level Four /
var level_four_collidable = [];
var level_four_uncollidable = [];
var level_four_enemies = [];

let floor_four_1 = new Floor(0,798,9000,100);
let floor_four_2 = new Floor(1300,800-100,8000,318);

let stairs_four_1 = new Block(1150, floor_four_1.y-50, 150,100,1);
let enemy_four_1 = new Enemy(1400,floor_four_2.y-50,48,32,-1,2);

// First Obstacle
let pillar_four_1 = new Block(1500,floor_four_2.y-50,150,100,1);
let pillar_four_2 = new Block(3200,floor_four_2.y-50,150,100,1);


let ceiling_four_1 = new Block(1850,0,150,1018-floor_four_2.height-100,1);
let ceiling_four_2 = new Block(2100,0,150,1018-floor_four_2.height-100,1);
let ceiling_four_3 = new Block(2350,0,150,1018-floor_four_2.height-100,1);
let ceiling_four_4 = new Block(2600,0,150,1018-floor_four_2.height-100,1);
let ceiling_four_5 = new Block(2850,0,150,1018-floor_four_2.height-100,1);

let wall_four_1 = new Block(1850,600,150,150,2);
let wall_four_2 = new Block(2100,600,150,150,2);
let wall_four_3 = new Block(2350,600,150,150,2);
let wall_four_4 = new Block(2600,600,150,150,2);
let wall_four_5 = new Block(2850,600,150,150,2);

let enemy_four_2 = new Enemy(2100,floor_four_2.y-50,48,32,1,1);
let enemy_four_3 = new Enemy(2100,floor_four_2.y-50,48,32,1,2);

// Second Obstacle
let pillar_four_3 = new Block(3350,floor_four_2.y-100,150,100,1);
let pillar_four_4 = new Block(5350,floor_four_2.y-100,150,100,1);

let enemy_four_4 = new Enemy(3500, floor_four_2.y-50,48,32,1,2);
let enemy_four_5 = new Enemy(3800, floor_four_2.y-50,48,32,1,2);
let enemy_four_6 = new Enemy(4200, floor_four_2.y-50,48,32,1,2);
let enemy_four_7 = new Enemy(4500, floor_four_2.y-50,48,32,1,2);
let enemy_four_8 = new Enemy(4800, floor_four_2.y-50,48,32,1,2);

// Third Obstacle
let pillar_four_5 = new Block(5500,floor_four_2.y-150,150,150,1);
let pillar_four_6 = new Block(5650,floor_four_2.y-200,150,200,1);
let pillar_four_7 = new Block(5800,floor_four_2.y-250,150,250,1);
let pillar_four_8 = new Block(7300,floor_four_2.y-250,150,250,1);
let pillar_four_9 = new Block(7450,floor_four_2.y-200,150,200,1);
let pillar_four_10 = new Block(7600,floor_four_2.y-150,150,150,1);
let pillar_four_11 = new Block(7750,floor_four_2.y-100,150,100,1);
let pillar_four_12 = new Block(7900,floor_four_2.y-50,150,100,1);

let wall_four_6 = new Block(5950,floor_four_2.y-125,150,150,2);
let wall_four_7 = new Block(6100,floor_four_2.y-125,150,150,2);
let wall_four_8 = new Block(6250,floor_four_2.y-125,150,150,2);
let wall_four_9 = new Block(6400,floor_four_2.y-125,150,150,2);
let wall_four_10 = new Block(6550,floor_four_2.y-125,150,150,2);
let wall_four_11 = new Block(6700,floor_four_2.y-125,150,150,2);
let wall_four_12 = new Block(6850,floor_four_2.y-125,150,150,2);
let wall_four_13 = new Block(7000,floor_four_2.y-125,150,150,2);
let wall_four_14 = new Block(7150,floor_four_2.y-125,150,150,2);

let wall_four_15 = new Block(5950,floor_four_2.y-250,150,150,2);
let wall_four_16 = new Block(6100,floor_four_2.y-200,150,150,2);
let wall_four_17 = new Block(6250,floor_four_2.y-250,150,150,2);
let wall_four_18 = new Block(6400,floor_four_2.y-250,150,150,2);
let wall_four_19 = new Block(6550,floor_four_2.y-250,150,150,2);
let wall_four_20 = new Block(6700,floor_four_2.y-250,150,150,2);
let wall_four_21 = new Block(6850,floor_four_2.y-250,150,150,2);
let wall_four_22 = new Block(7000,floor_four_2.y-200,150,150,2);
let wall_four_23 = new Block(7150,floor_four_2.y-250,150,150,2);
let wall_four_24 = new Block(6550,floor_four_2.y-300,150,150,2);

let block_four_1 = new Block(wall_four_16.x, wall_four_16.y-100,150,100,3);
let block_four_2 = new Block(wall_four_18.x, wall_four_18.y-100,150,100,3);
let block_four_3 = new Block(wall_four_20.x, wall_four_20.y-100,150,100,3);
let block_four_4 = new Block(wall_four_22.x, wall_four_22.y-100,150,100,3);

let enemy_four_9 = new Enemy(6000,floor_four_2.y-50,48,32,1,1);
let enemy_four_10 = new Enemy(6150,floor_four_2.y-50,48,32,1,1);
let enemy_four_11 = new Enemy(6300,floor_four_2.y-50,48,32,1,1);
let enemy_four_12 = new Enemy(6450,floor_four_2.y-50,48,32,1,1);
let enemy_four_13 = new Enemy(6600,floor_four_2.y-50,48,32,1,1);
let enemy_four_14 = new Enemy(6750,floor_four_2.y-50,48,32,1,2);
let enemy_four_15 = new Enemy(6900,floor_four_2.y-50,48,32,1,2);
let enemy_four_16 = new Enemy(7050,floor_four_2.y-50,48,32,1,2);

// Start and End
let start4 = new Obj(0,578,50,400,1);
let end4 = new Obj(9000-600-300,floor_four_2.y-150,600,150,2);

level_four_collidable.push(floor_four_1);
level_four_collidable.push(floor_four_2);
level_four_collidable.push(stairs_four_1);
level_four_collidable.push(block_four_1);
level_four_collidable.push(block_four_2);
level_four_collidable.push(block_four_3);
level_four_collidable.push(block_four_4);
level_four_collidable.push(pillar_four_1);
level_four_collidable.push(pillar_four_2);
level_four_collidable.push(ceiling_four_1);
level_four_collidable.push(ceiling_four_2);
level_four_collidable.push(ceiling_four_3);
level_four_collidable.push(ceiling_four_4);
level_four_collidable.push(ceiling_four_5);
level_four_collidable.push(pillar_four_3);
level_four_collidable.push(pillar_four_4);
level_four_collidable.push(pillar_four_5);
level_four_collidable.push(pillar_four_6);
level_four_collidable.push(pillar_four_7);
level_four_collidable.push(pillar_four_8);
level_four_collidable.push(pillar_four_9);
level_four_collidable.push(pillar_four_10);
level_four_collidable.push(pillar_four_11);
level_four_collidable.push(pillar_four_12);
level_four_uncollidable.push(wall_four_1);
level_four_uncollidable.push(wall_four_2);
level_four_uncollidable.push(wall_four_3);
level_four_uncollidable.push(wall_four_4);
level_four_uncollidable.push(wall_four_5);
level_four_uncollidable.push(wall_four_6);
level_four_uncollidable.push(wall_four_7);
level_four_uncollidable.push(wall_four_8);
level_four_uncollidable.push(wall_four_9);
level_four_uncollidable.push(wall_four_10);
level_four_uncollidable.push(wall_four_11);
level_four_uncollidable.push(wall_four_12);
level_four_uncollidable.push(wall_four_13);
level_four_uncollidable.push(wall_four_14);
level_four_uncollidable.push(wall_four_15);
level_four_uncollidable.push(wall_four_16);
level_four_uncollidable.push(wall_four_17);
level_four_uncollidable.push(wall_four_18);
level_four_uncollidable.push(wall_four_19);
level_four_uncollidable.push(wall_four_20);
level_four_uncollidable.push(wall_four_21);
level_four_uncollidable.push(wall_four_22);
level_four_uncollidable.push(wall_four_23);
level_four_uncollidable.push(wall_four_24);
level_four_uncollidable.push(start4);
level_four_uncollidable.push(end4);
level_four_enemies.push(enemy_four_1);
level_four_enemies.push(enemy_four_2);
level_four_enemies.push(enemy_four_3);
level_four_enemies.push(enemy_four_4);
level_four_enemies.push(enemy_four_5);
level_four_enemies.push(enemy_four_6);
level_four_enemies.push(enemy_four_7);
level_four_enemies.push(enemy_four_8);
level_four_enemies.push(enemy_four_9);
level_four_enemies.push(enemy_four_10);
level_four_enemies.push(enemy_four_11);
level_four_enemies.push(enemy_four_12);
level_four_enemies.push(enemy_four_13);
level_four_enemies.push(enemy_four_14);
level_four_enemies.push(enemy_four_15);
level_four_enemies.push(enemy_four_16);

//###################################################

//*** MAIN GAME LOOP ***
var game = function() {
	// Draw hero and background
	createLevel();
	ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
	
	if (hasMoved==0){
		ctx.drawImage(moveImage, canvas.width/2-100,canvas.height/2-300);
		if (65 in keysDown || 37 in keysDown || 68 in keysDown || 39 in keysDown){
			hasMoved=1;
		}
	}
	
	// Forces affecting Hero
	hero.y_velocity += speed*0.3;
	if (level==0){
		hero.x 	+= hero.x_velocity;
	}
	else {
		lvl.x 	+= lvl.x_velocity;
	};
	hero.y  		+= hero.y_velocity;
	hero.x_velocity 	*= 0.9;
	hero.y_velocity 	*= 0.9;
	lvl.x_velocity 		*= 0.9;
	
	// Play main audio
	if (level==0){
		level_theme.pause();
		level_theme.currentTime = 0;
		main_theme.play();
	}
	else {
		main_theme.pause();
		main_theme.currentTime 	= 0;
		level_theme.play();
	};
	
	// Check collisions
	if (level==0){
		ctx.drawImage(codesImage,10,10);
		for (var i = 0; i<main_collidable.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, main_collidable[i])==true){
				hero.y 			= main_collidable[i].y-hero.height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 1;
				break
			}
		}
	}
	else if (level==1){
		collisionLeft 	= 0;
		collisionRight 	= 0;
		
		// TOUCHING OBJECTS
		for (var i = 0; i<level_one_collidable.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_one_collidable[i])==true){
				hero.y 			= level_one_collidable[i].y-hero.height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 1;
				break
			}
			if (collisionDetectionBottom(hero, level_one_collidable[i])==true){
				hero.y 			= level_one_collidable[i].y+level_one_collidable[i].height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 0;
				break
			}
		};
		for (var i = 0; i<level_one_collidable.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_one_collidable[i])==true){
				hero.x 			= level_one_collidable[i].x-hero.width+1;
				lvl.x 			= lvl.x+1;
				collisionLeft 		= 1;
				hero.x_velocity 	= 0;
				break
			}
			if (collisionDetectionRight(hero, level_one_collidable[i])==true){
				hero.x 			= level_one_collidable[i].x+level_one_collidable[i].width-1;
				lvl.x 			= lvl.x-1;
				collisionRight 		= 1;
				hero.x_velocity 	= 0;
				break
			}
		};
	}
	else if (level==2){
		collisionLeft 	= 0;
		collisionRight 	= 0;
		
		// TOUCHING OBJECTS
		for (var i = 0; i<level_two_collidable.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_two_collidable[i])==true){
				hero.y 			= level_two_collidable[i].y-hero.height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 1;
				break
			}
			if (collisionDetectionBottom(hero, level_two_collidable[i])==true){
				hero.y 			= level_two_collidable[i].y+level_two_collidable[i].height;
				hero.y_velocity		= 0;
				hero.isGrounded 	= 0;
				break
			}
		};
		for (var i = 0; i<level_two_collidable.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_two_collidable[i])==true){
				hero.x 			= level_two_collidable[i].x-hero.width+1;
				lvl.x 			= lvl.x+1;
				collisionLeft 		= 1;
				hero.x_velocity 	= 0;
				break
			}
			if (collisionDetectionRight(hero, level_two_collidable[i])==true){
				hero.x 			= level_two_collidable[i].x+level_two_collidable[i].width-1;
				lvl.x 			= lvl.x-1;
				collisionRight 		= 1;
				hero.x_velocity 	= 0;
				break
			}
		};
		
		// TOUCHING ENEMIES
		for (var i = 0; i<level_two_enemies.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_two_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionBottom(hero, level_two_enemies[i])==true){
				died();
				break
			}
		};
		
		for (var i = 0; i<level_two_enemies.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_two_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionRight(hero, level_two_enemies[i])==true){
				died();
				break
			}
		};
	}
	else if (level==3){
		collisionLeft 	= 0;
		collisionRight 	= 0;
		
		// TOUCHING OBJECTS
		for (var i = 0; i<level_three_collidable.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_three_collidable[i])==true){
				hero.y 			= level_three_collidable[i].y-hero.height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 1;
				break
			}
			if (collisionDetectionBottom(hero, level_three_collidable[i])==true){
				hero.y 			= level_three_collidable[i].y+level_three_collidable[i].height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 0;
				break
			}
		};
		for (var i = 0; i<level_three_collidable.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_three_collidable[i])==true){
				hero.x 			= level_three_collidable[i].x-hero.width+1;
				lvl.x 			= lvl.x+1;
				collisionLeft 		= 1;
				hero.x_velocity 	= 0;
				break
			}
			if (collisionDetectionRight(hero, level_three_collidable[i])==true){
				hero.x 			= level_three_collidable[i].x+level_three_collidable[i].width-1;
				lvl.x 			= lvl.x-1;
				collisionRight 		= 1;
				hero.x_velocity 	= 0;
				break
			}
		};
		
		// TOUCHING ENEMIES
		for (var i = 0; i<level_three_enemies.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_three_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionBottom(hero, level_three_enemies[i])==true){
				died();
				break
			}
		};
		
		for (var i = 0; i<level_three_enemies.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_three_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionRight(hero, level_three_enemies[i])==true){
				died();
				break
			}
		};
	}
	else if (level==4){
		collisionLeft 	= 0;
		collisionRight 	= 0;
		
		// TOUCHING OBJECTS
		for (var i = 0; i<level_four_collidable.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_four_collidable[i])==true){
				hero.y 			= level_four_collidable[i].y-hero.height;
				hero.y_velocity 	= 0;
				hero.isGrounded = 1;
				break
			}
			if (collisionDetectionBottom(hero, level_four_collidable[i])==true){
				hero.y 			= level_four_collidable[i].y+level_four_collidable[i].height;
				hero.y_velocity 	= 0;
				hero.isGrounded 	= 0;
				break
			}
		};
		for (var i = 0; i<level_four_collidable.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_four_collidable[i])==true){
				hero.x 			= level_four_collidable[i].x-hero.width+1;
				lvl.x 			= lvl.x+1;
				collisionLeft		= 1;
				hero.x_velocity 	= 0;
				break
			}
			if (collisionDetectionRight(hero, level_four_collidable[i])==true){
				hero.x 			= level_four_collidable[i].x+level_four_collidable[i].width-1;
				lvl.x 			= lvl.x-1;
				collisionRight 		= 1;
				hero.x_velocity 	= 0;
				break
			}
		};
		
		//TOUCHING ENEMIES
		for (var i = 0; i<level_four_enemies.length; i++){ // STANDING ON OR HITTING FROM BELOW
			if (collisionDetectionTop(hero, level_four_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionBottom(hero, level_four_enemies[i])==true){
				died();
				break
			}
		};
		
		for (var i = 0; i<level_four_enemies.length; i++){ // HITTING FROM LEFT OR RIGHT
			if (collisionDetectionLeft(hero, level_four_enemies[i])==true){
				died();
				break
			}
			if (collisionDetectionRight(hero, level_four_enemies[i])==true){
				died();
				break
			}
		};
	};
	
	// Check borders
	if (hero.x < 0) {
		hero.x 			= 0;
		hero.x_velocity 	= 0;
	}
	else if (hero.x > canvas.width-hero.width) {
		hero.x 			= canvas.width-hero.width;
		hero.x_velocity 	= 0;
	};
	if (hero.y+hero.height>canvas.height){
		died();
	};
	if (level != 0) {
		if (lvl.x > 0) {
			lvl.x 		= 0;
			lvl.x_velocity 	= 0;
		}
		// End of Level
		else if (lvl.x < (lvl.width-canvas.width)*-1) {
			lvl.x 		= -(lvl.width-canvas.width)
			lvl.x_velocity 	= 0;
			finish();
		};
	};
	
	// Input for moving hero
	if (hero.isGrounded == 1 &&
		collisionLeft == 0 &&
		collisionRight == 0 &&
		(87 in keysDown || 38 in keysDown)){ // Jump
			hero.y_velocity 	-= 25;
			hero.isGrounded 	= 0;
	};
	
	if (level == 0) {
		if (65 in keysDown || 37 in keysDown) { // Move Left
			heroImage.src 		= "imgs/hero-2.png";
			hero.x_velocity 	-= speed/4;
		};
		if (68 in keysDown || 39 in keysDown) { // Move Right
			heroImage.src 		= "imgs/hero-1.png";
			hero.x_velocity 	+= speed/4;
		};
	}
	else {
		if (65 in keysDown  || 37 in keysDown) { // Move Left
			heroImage.src 		= "imgs/hero-2.png";
			lvl.x_velocity 		+= speed/4;
		}
		else if (68 in keysDown  || 39 in keysDown) { // Move Right
			heroImage.src 		= "imgs/hero-1.png";
			lvl.x_velocity 		-= speed/4;
		};
		if (collisionLeft == 1 || collisionRight == 1){
			lvl.x_velocity 		= 0;
		}
	};
	
	//***Level Entry***
	if (level == 0 && !(67 in keysDown)) {
		// Level 1
		if (180 < hero.x && hero.x < 300) {
			ctx.drawImage(promptImage, canvas.width/2-225, canvas.height/2-300);
			// If interacted with
			if (32 in keysDown) {
				enter.play();
				hero.x 		= canvas.width/2 - hero.width/2;
				lvl.x 		= 0;
				level 		= 1;
			}
		}
		// Level 2
		else if (400 < hero.x && hero.x < 520) {
			if (completed >= 1) {
				ctx.drawImage(promptImage, canvas.width/2-225, canvas.height/2-300);
				// If interacted with
				if (32 in keysDown) {
					enter.play();
					hero.x 	= canvas.width/2 - hero.width/2;
					lvl.x 	= 0;
					level 	= 2;
					for (var i=0; i<level_two_enemies.length; i++){
						level_two_enemies[i].start();
					}
				}
			}
		}
		// Level 3
		else if (630 < hero.x && hero.x < 750) {
			if (completed >= 2) {
				ctx.drawImage(promptImage, canvas.width/2-225, canvas.height/2-300);
				// If interacted with
				if (32 in keysDown) {
					enter.play();
					hero.x 	= canvas.width/2 - hero.width/2;
					lvl.x 	= 0;
					level 	= 3;
					for (var i=0; i<level_three_enemies.length; i++){
						level_three_enemies[i].start();
					}
				}
			}
		}
		// Level 4
		else if (860 < hero.x && hero.x < 980) {
			if (completed >= 3) {
				ctx.drawImage(promptImage, canvas.width/2-225, canvas.height/2-300);
				// If interacted with
				if (32 in keysDown) {
					enter.play();
					hero.x 	= canvas.width/2 - hero.width/2;
					lvl.x 	= 0;
					level 	= 4;
					for (var i=0; i<level_four_enemies.length; i++){
						level_four_enemies[i].start();
					}
				}
			}
		}
	};
	
	// Skip Levels
	if (16 in keysDown && 49 in keysDown){
		level = 1;
		finish();
	}
	else if (16 in keysDown && 50 in keysDown){
		level = 2;
		finish();
	}
	else if (16 in keysDown && 51 in keysDown){
		level = 3;
		finish();
	}
	else if (16 in keysDown && 52 in keysDown){
		level = 4;
		finish();
	}
};
var loop = setInterval(game, 16);
