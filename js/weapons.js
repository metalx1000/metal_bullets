weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);

//create audio element
var audio = document.createElement("audio");
/*
document.addEventListener( 'click', function ( event ) {
                gun_bang();
});
*/

$(document).mousedown(function(event) {
    switch (event.which) {
        case 1:
            gun_bang();
            break;
        case 2:
            //'Middle Mouse button
            break;
        case 3:
            //Right Click        
            break;
    }
});

function load_glock(){
    glock = document.createElement('img');
    glock.src = "../../sprites/weapons/glock/gun.png"

    document.getElementById('weapon').appendChild(glock);

    //load audio
    audio.src = "../../sounds/weapons/gun1.wav";
 
}

    function gun_bang(){
        audio.play();   
    }
