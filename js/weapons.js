weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);

function load_glock(){
    glock = document.createElement('img');
    glock.src = "../../sprites/weapons/glock/gun.png"

    document.getElementById('weapon').appendChild(glock);

    //load audio
    gun_audio.src = "../../sounds/weapons/gun1.wav";
 
}

    function gun_bang(){
        gun_audio.play();   
    }
