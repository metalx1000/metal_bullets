//Global Variables

var hud, hudcamera;

var speed = 5; //Walk Speed of Player
var fallSpeed = 10;
var jump_height = 3;

var width = window.innerWidth;
var height = window.innerHeight;
var mouseX = width / 2, mouseY = height / 2;

var floor = 1;
var player_jump = "false";
var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var PI_2 = Math.PI / 2;

var gun_height, bobx, gun;
//create audio elements
var music;
var gun_shoot = "../../sounds/weapons/gun1.wav";

//player Jump 
var player_jump_audio = document.createElement("audio");
player_jump_audio.src = "../../sounds/player/jump.wav";

