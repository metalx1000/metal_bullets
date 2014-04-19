weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);

//create audio element
var audio = document.createElement("audio");

function load_glock(){
    glock = document.createElement('img');
    glock.src = "sprites/weapons/glock/gun.png"

    document.getElementById('weapon').appendChild(glock);

    //load audio
    audio.src = "sounds/weapons/gun1.wav";
 
}

    function gun_bang(){
        audio.play();   
    }
