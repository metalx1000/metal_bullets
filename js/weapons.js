weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);

function load_glock(){
    glock = document.createElement('img');
    glock.src = "sprites/weapons/glock/gun.png"

    document.getElementById('weapon').appendChild(glock);
}
