/**
 * @author Kris Occhipinti <A.K.A. Metalx1000>/ http://filmsbykris.com/
 * @code https://github.com/metalx1000/metal_bullets
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 */

var width = window.innerWidth;
var height = window.innerHeight;
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
            Activate();
        }else if (event.keyCode === 27) {
            //"Menu on 'esc'"
            Menu_Open();
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
    this.audio.setAttribute("loop", "auto");
        console.log("Loading Music...");
        for ( var i = 0; i < sources.length; i ++ ) {

                    this.source.src = sources[ i ];
                    save_music(this.source.src);
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
                    save_music(this.source.src);

                    this. audio.appendChild( this.source );
                    this.audio.src = this.source.src;
                    this.audio.load(); 
                    this.audio.play();    
                    this.pause_val = 0;
        }
        Menu_Close(); 
    }
}

//Store url for loaded songs for future use
var metal_music = [];
function save_music(source){
        if (localStorage.getItem("metal_music") === null) {
            metal_music.push(source)
            localStorage.metal_music = JSON.stringify(metal_music);
        }else{
            metal_music = JSON.parse(localStorage.metal_music);
            metal_music.push(source);
            metal_music = metal_music.filter(function(elem, pos) {
                return metal_music.indexOf(elem) == pos;
            })
            localStorage.metal_music = JSON.stringify(metal_music);
            metal_music = JSON.parse(localStorage.metal_music);
        }
}

function create_music_history(){
    var music_history = document.getElementById('music_history');  
    for ( var i = 0; i < metal_music.length; i ++ ) {
        html = "<div onclick='Music.load([\"" +  metal_music[i] + "\"])'>" +  metal_music[i] + "</div>";
        music_history.innerHTML += html;
    }

}

function Menu_Open(){
    FullScreenGrab=false;
    var music_menu = document.getElementById('music_menu');
    music_menu.hidden = false;
}

function Menu_Close(){
    FullScreenGrab=true;
    var music_menu = document.getElementById('music_menu');
    music_menu.hidden = true;
}

function create_music_menu(){
                //music menu
                var body = document.body;
                var music_menu = document.createElement("div");
                music_menu.setAttribute("id", "music_menu");
                music_menu.setAttribute("class", "menu");
                body.appendChild(music_menu);

                music_menu.hidden =  true;

                var music_input = document.createElement("input");
                music_input.setAttribute("id", "music_input");
                music_input.setAttribute("type", "text");
                music_input.setAttribute("placeholder", "Paste URL to Music Here");
                music_input.setAttribute("onchange", "Music.load([this.value])");
                music_menu.appendChild(music_input);


                var music_history = document.createElement("div");
                music_history.setAttribute("id", "music_history");
                music_menu.appendChild(music_history);

                create_music_history();
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
function Activate(){
    var active = Scene.pick(width*0.5,height*0.5);
    if(active.pickedMesh != null){
        if(active.pickedMesh.name.indexOf('Door') > -1 && active.distance < 5){
            Open_Door(active.pickedMesh);
        }
    }
}

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

function Open_Door(obj){
    if(obj.lock != "1"){
        obj.lock = "1";
        obj.orgPosY = obj.position.y;

        //console.log("Door Open.");
            if (obj.name.indexOf("Down") != -1){
                    door_sound = new Sound( [ '../../sounds/doors/door.wav' ], 275, 1 );
                    //door_sound.position.copy( obj.scaling.y );
                    door_sound.play();
                    //console.log("Down");
                    Open = new TWEEN.Tween({y: obj.position.y})
                    .to({ y: obj.position.y - obj.scaling.y}, 1000)
                    .onUpdate( function(){
                        obj.position.y=this.y;
                    });
                    Open.start();
            }
            Close_Door(obj);
    }
}


function Close_Door(obj){
        setTimeout(function(){

            if (obj.name.indexOf("Down") != -1){
                door_sound = new Sound( [ '../../sounds/doors/door.wav' ], 275, 1 );
                //door_sound.position.copy( obj.position );
                door_sound.play();
                    Close = new TWEEN.Tween({y: obj.position.y})
                    .to({ y: obj.orgPosY}, 1000)
                    .onUpdate( function(){
                        obj.position.y=this.y;
                        if(obj.position.y.toFixed(4) == obj.orgPosY.toFixed(4)){
                            obj.lock = "0";
                        }
                    });
                    Close.start();
            }

        },5000);

}

//Fullscreen and Mouse Cursor Grab
var FullScreenGrab=false;
function go_fullscreen(){
    
            var instructions = document;

            // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.body;
                instructions.addEventListener( 'click', function ( event ) {

// instructions.style.display = 'none';
        if( FullScreenGrab == true ){
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
            if(Camera.cameraDirection.y < 0.25){
                Camera.cameraDirection.y = 2;
            }

}

function Teleport(obj){
    console.log("Teleporting Player.");
    if(obj.name.indexOf('pos') > -1){
        objarray = obj.name.split(".");
        for(var i = 0; i<objarray.length;i++){
            if(objarray[i].indexOf('pos') > -1){
                for(var x = 0; x<Scene.meshes.length;x++){
                    meshes = Scene.meshes[x];
                    if(meshes.name.indexOf('Teleporter') > -1 && meshes.name.indexOf(objarray[i]) > -1){
                        if(meshes != obj){
                            var sound = new Sound( [ "../../sounds/teleporter.wav" ], 275, 1 );
                            sound.play();

                            console.log("Teleporting to " + meshes.name)
                            Camera.position.x = meshes.position.x;
                            Camera.position.y = meshes.position.y;
                            Camera.position.z = meshes.position.z;
                            camSensor.position = Camera.position;
                        }
                    }
                }
            }
        }    
    }else{
        console.log("Teleporter Broken.")
    }
}

var Touch_Sensor = 0;
function check_camSensor(){
    if(Touch_Sensor == 0){
        for(var i=0;i<Scene.meshes.length;i++){
            obj = Scene.meshes[i];
            if(camSensor.intersectsMesh(obj) && obj != camSensor){
                Touch_Sensor = 1;
                setTimeout(function(){ Touch_Sensor = 0; },5000); //wait for touch_sensor to reactivate
                if(obj.name.indexOf('Teleporter') > -1){
                    Teleport(obj);
                }
            }
        }
    }
}

var camSensor;
function create_camSensor(){
    console.log("creating camSensor");
    // create sensor mesh  - parent to  camera
    camSensor = new BABYLON.Mesh.CreateBox("sensor", 1, Scene);
    camSensor.material = new BABYLON.StandardMaterial("camMat", Scene);
    camSensor.isVisible = false;
    camSensor.material.wireframe = true;
    camSensor.scaling = new BABYLON.Vector3(1, 2, 1);
    camSensor.position = Camera.position;
    //camSensor.parent = Camera;
}
