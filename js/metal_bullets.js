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
        if (event.keyCode === 32) {
            //"Space"
            for(var i = 0;i<Scene.meshes.length;i++){ console.log("Mesh " + i + " is  " + Scene.meshes[i].name) }
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
                }
    });
}

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
        }

    this.play = function () {
       this.audio.play();
    }

    this.pause = function(){
        this.audio.pause();
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



//Fullscreen and Mouse Cursor Grab
function go_fullscreen()
{
            var instructions = document;

            // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.body;
                instructions.addEventListener( 'click', function ( event ) {

//                    instructions.style.display = 'none';

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