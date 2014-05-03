/**
 * @author Kris Occhipinti <A.K.A. Metalx1000>/ http://filmsbykris.com/
 * @code https://github.com/metalx1000/metal_bullets
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 */


////////////////Controls///////////////////////////
function activate_controls(){
    set_keys();
    set_mouse();
}

//KeyBoard Controls
function set_keys(){
    //Camera Controls
    Camera.keysRight.push(68);//Set Key 'D'
    Camera.keysLeft.push(65);//Set Key 'A'
    Camera.keysUp.push(87);//Set Key 'W'
    Camera.keysDown.push(83);//Set Key 'S'

    window.addEventListener("keydown", function (event) {
        //console.log(event); //uncomment to test key value
        if (event.keyCode === 32) {
            //"Space as activate key"
            Open_Door();
        }else if (event.keyCode === 61) {
            //music volume up on '+'
            Music.vol_up();
        }else if (event.keyCode === 173) {
            //music volume down on '-'
            Music.vol_down();
        }else if (event.keyCode === 80) {
            //music pause on 'p'
            Music.pause();
        }else if (event.keyCode === 76) {
            //lists all mesh when 'l' is pressed
            list_mesh();
        }



    }, false);

}


//Mouse Controls
function set_mouse(){
    window.addEventListener("mousemove", function(event) {
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                //make sure camera is loaded before trying to move it.
                if(!Camera){
                    console.log("Waiting for Camera to load...");
                }else{
                    Camera.rotation.y += movementX * 0.002;
                    Camera.rotation.x += movementY * 0.002;
                }
    });
}

window.addEventListener("mousedown", function(event) {
    //console.log(event.which);//uncomment to test buttons
    if(event.which == 1){
        var gun_sound = new Sound( [ "../../sounds/weapons/gun1.wav" ], 275, 1 );
        gun_sound.play();
    }else if(event.which == 3){
        player_jump();
    }
}, false);

/////////////////////////////////Window Controls///////////////
//Prevents Menu From popping up on right click
window.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

//resize Render Window on window resize
window.addEventListener("resize", function () {
  engine.resize();
});

/////////////////Audio/////////////////////////////

//music
var Load_Music = function ( sources, volume ) {
    this.source = document.createElement( 'source' );
    this.vol = volume;

    this.audio = document.createElement( 'audio' );

        console.log("Loading Music...");
        for ( var i = 0; i < sources.length; i ++ ) {

                    this.source.src = sources[ i ];
                    this.audio.volume=this.vol;

                    this.audio.appendChild( this.source );
                    this.audio.play();
                    this.pause_val = 0;
        }

    this.play = function () {
       this.audio.play();
       this.pause_val = 0;
    }

    this.pause = function(){
        if (this.pause_val == 0){
           this.audio.pause();
           this.pause_val = 1;
            console.log("Music Paused");
        }else{
           this.audio.play();
           this.pause_val = 0;
            console.log("Music unPaused");
        }
    }

    this.set_vol = function(vol){
        if(vol > 1 || vol < 0){
            console.log("volume must be between 0 and 1");
        }else{
            this.vol = vol;
            this.audio.volume=this.vol;
            console.log("Volume is set to " + this.vol * 100 + "%")
        }
    }

    this.vol_up = function(){
        this.vol += .1;
        if(this.vol > 1){
            this.vol = 1;
        }else if (this.vol < 0){
            this.vol = 0;
        }
        this.audio.volume=this.vol;
        console.log("Volume is set to " + this.vol * 100 + "%")
    }

    this.vol_down = function(){
        this.vol -= .1;
        if(this.vol > 1){
            this.vol = 1;
        }else if(this.vol < 0){
            this.vol = 0;
        }
        this.audio.volume=this.vol;
        console.log("Volume is set to " + this.vol * 100 + "%")
    }


    this.load = function(sources){
                    console.log("Loading Music...");
        for ( var i = 0; i < sources.length; i ++ ) {
                    this.source.src = sources[ i ];

                    this. audio.appendChild( this.source );
                    this.audio.src = this.source.src;
                    this.audio.load(); 
                    this.audio.play();    
                    this.pause_val = 0;
        }
        console.log("Loading Music...");
    }
}


//sounds
var Sound = function ( sources, radius, volume ) {

                var audio = document.createElement( 'audio' );

                for ( var i = 0; i < sources.length; i ++ ) {

                    var source = document.createElement( 'source' );
                    source.src = sources[ i ];

                    audio.appendChild( source );

                }

//                this.position = new THREE.Vector3();

                this.play = function () {

                    audio.play();

                }

                this.update = function ( camera ) {

                    var distance = this.position.distanceTo( camera.position );

                    if ( distance <= radius ) {

                        audio.volume = volume * ( 1 - distance / radius );

                    } else {

                        audio.volume = 0;

                    }

                }

}

//////////////////////////World Settings/////////////////
//setup collision on wall, floors, etc
function set_collision(str){
            var obj;
            for(var x = 0;x < str.length;x++){
                for(var i = 0;i<Scene.meshes.length;i++){ 
                    obj = Scene.meshes[i];
                    if(obj.name.indexOf(str[x]) > -1){
                        obj.checkCollisions = true;
                    }
                }
            }
}

//lists all meshes in scene
function list_mesh(){
            var obj, name;
            for(var i = 0;i<Scene.meshes.length;i++){
                obj = Scene.meshes[i];
                name = obj.name;
                console.log("Mesh " + name + " is Scene.meshes[" + i + "]" );
            }
}

//checks the distance between two object
function check_distance(obj, obj1){
    var DIS = new Object();
    DIS['x'] = obj.position.x - obj1.position.x * -1;
    DIS['y'] = obj.position.y - obj1.position.y * -1;
    DIS['z'] = obj.position.z - obj1.position.z * -1;
    return DIS;
}

function Open_Door(){
            var obj, DIS;
                for(var i = 0;i<Scene.meshes.length;i++){
                    obj = Scene.meshes[i];
                    if(obj.name.indexOf("Door") > -1){
                        DIS = check_distance(Camera, obj);
                        DISx = DIS['x'];
                        DISy = DIS['y'];
                        DISz = DIS['z'];
                        console.log(DIS);
                        if(DISz < 5 && DISx < 5 && DISy < 10 && DISy > -10){
                            console.log("Opening " + obj.name);
                        }
                    }
                }

}

//Fullscreen and Mouse Cursor Grab
function go_fullscreen()
{
            var instructions = document;

            // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.body;
                instructions.addEventListener( 'click', function ( event ) {

// instructions.style.display = 'none';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if ( /Firefox/i.test( navigator.userAgent ) ) {

                        var fullscreenchange = function ( event ) {

                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                                element.requestPointerLock();
                            }

                        }

                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        element.requestPointerLock();

                    }

                }, false );

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }
}

/////////Player Configs/////////

//jump
function player_jump(){
            //you would think this would be set to 0
            //but this seems to work better
            //or there is a delay between jumps
            if(Camera.cameraDirection.y < 0.08){
                Camera.cameraDirection.y = 3;
            }

}
