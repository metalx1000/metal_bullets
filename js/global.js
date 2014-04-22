//Global Variables

var speed = 5; //Walk Speed of Player
var fallSpeed = 10;
var jump_height = 3;

var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
var floor = 1;
var player_jump = "false";
var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var PI_2 = Math.PI / 2;


//create audio elements
var gun_audio = document.createElement("audio");

//player Jump 
var player_jump_audio = document.createElement("audio");
player_jump_audio.src = "../../sounds/player/jump.wav";

