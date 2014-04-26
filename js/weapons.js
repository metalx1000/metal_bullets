weapon = document.createElement('div');
weapon.id = "weapon";
document.getElementsByTagName('body')[0].appendChild(weapon);
weapon.style.bottom="-150px"

function load_glock(){
    var mapA = THREE.ImageUtils.loadTexture( "../../sprites/weapons/glock/gun.png", undefined, createHUDSprites );
    //load audio
    gun_audio.src = "../../sounds/weapons/gun1.wav";
 
}

    function gun_bang(){
        gun_audio.play();   
    }

            function createHUDSprites ( texture ) {

                var material = new THREE.SpriteMaterial( { map: texture } );

                var width = material.map.image.width;
                var height = material.map.image.height;
                
                gun = new THREE.Sprite( material );
                gun.scale.set( width * .75, height * .75, 1 );
                hud.add( gun );

                updateHUDSprites();

            };

            function updateHUDSprites () {

                var width = window.innerWidth / 2;
                var height = window.innerHeight / 2;

                var material = gun.material;

                var imageWidth = material.map.image.width;
                var imageHeight = material.map.image.height;

                gun_height = height - imageHeight;
                bobx = gun_height;
                gun.position.set( 0, gun_height, 1 ); // center bottom
                //console.log(imageHeight);
                //console.log(- height + imageHeight); 

            };


