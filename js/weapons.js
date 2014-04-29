weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);
weapon.style.bottom="-150px"

var gun_height, gun;

function load_glock(){
    var mapA = THREE.ImageUtils.loadTexture( "../../sprites/weapons/glock/gun.png", undefined, createHUDSprites );
    //load audio
 
}

    function gun_bang(){
        gun_sound = new Sound( [ gun_shoot ], 275, 1 );
        gun_sound.play();
    }

            function createHUDSprites ( texture ) {

                var material = new THREE.SpriteMaterial( { map: texture } );

                var imageWidth = material.map.image.width;
                var imageHeight = material.map.image.height;

                gun = new THREE.Sprite( material );
                gun.scale.set( imageWidth * .75 , imageHeight * .75, 1 );
                hud.add( gun );

                var material = gun.material;

                console.log(imageHeight);
                console.log(height);
                gun_height = height * .5 - imageHeight;
                bobx = gun_height;
                gun.position.set( 0, gun_height, 1 ); // center bottom

                gun_setpos();
//                updateHUDSprites();

            };

            function updateHUDSprites () {

                var width = window.innerWidth / 2;
                var height = window.innerHeight / 2;

                var material = gun.material;

                var imageWidth = material.map.image.width;
                var imageHeight = material.map.image.height;

                console.log(imageHeight);
                console.log(height);
                gun_height = height - imageHeight;
                bobx = gun_height;
                gun.position.set( 0, gun_height, 1 ); // center bottom
                //console.log(imageHeight);
                //console.log(- height + imageHeight); 

            };

function gun_setpos(){
    if(typeof gun != "undefined"){
        gun.position.set( 0, gun_height, 1 );
    }
}
