/**
 * @author Kris Occhipinti <A.K.A. Metalx1000>/ http://filmsbykris.com/
 * @code https://github.com/metalx1000/metal_bullets
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 */

//var width = window.innerWidth;
//var height = window.innerHeight;

////////////////////////////Load Scene/////////////////////////////
var Scene, Camera, canvas, engine, Player, CrossHair;

function Load_Scene(MAP, MUSIC){
    Player = new Load_Player();
    if (BABYLON.Engine.isSupported()) {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);

        var width = engine.getRenderWidth();
        var height = engine.getRenderHeight();

        BABYLON.SceneLoader.Load("", MAP, engine, function (newScene) {
            Scene = newScene;
            // Wait for textures and shaders to be ready
            Scene.executeWhenReady(function () {
                Camera = Scene.activeCamera;
                // Attach camera to canvas inputs
                Scene.activeCamera.attachControl(canvas);

                Scene.enablePhysics();
//                Scene.setGravity(new BABYLON.Vector3(0, -0.1, 10));
                Scene.gravity = new BABYLON.Vector3(0, -1, 0);
                Scene.collisionsEnabled = true;

                preload_sounds();
                Object_Setup(["Floor","Wall", "Door", "Enemy", "Explosion"]);

                Camera.minZ = 1;
                Camera.checkCollisions = true;
                Camera.applyGravity = true;
                Camera.ellipsoid = new BABYLON.Vector3(1, 2, 1);
                Camera.speed = 1;


                create_camSensor();
 
                activate_controls();
                FullScreenGrab=true;

                //music menu
                create_music_menu();

                go_fullscreen();//fullscreen on click and mouse Grab
                var music = [];
                music.push("../../music/Level_1.ogg");
                if (MUSIC != null){
                    music.push(MUSIC);
                }
                console.log(music);
                Music = new Load_Music(music, 1, true);
                create_music_menu();
                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function() {
                    Scene.render();
                    TWEEN.update();
                    check_camSensor();
                    Enemy_Update();
                    Player.update();
                });
            });
        }, function (progress) {
            // To do: give progress feedback to user
            if (progress.lengthComputable) {
                p = (progress.loaded * 100 / progress.total).toFixed();
                if(p = 100){
                    document.title ="Metal Bullets";
                }else{
                    document.title = "Loading, please wait..." + p + "%";
                }
            }
        });
    }

}
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
        }else if (event.keyCode === 73) {
            //lists all mesh when 'l' is pressed
            CrossHair = new Load_Crosshair();
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
        Shot();
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
  width = engine.getRenderWidth();
  height = engine.getRenderHeight();

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
var Sound = function ( sources, obj, volume, radius ) {

                var audio = document.createElement( 'audio' );

                if(volume == null){
                    volume = 1;
                }

                if(radius == null){
                    radius = 100;
                }

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

                    var distance = check_distance( obj, camera );

                    if ( distance <= radius ) {

                        audio.volume = volume * ( 1 - distance / radius );
                        console.log("volume: " + audio.volume);
                    } else {

                        audio.volume = 0;

                    }

                }

}

//////////////////////////World Settings/////////////////
var postProcess;
function Activate(){
    var active = Scene.pick(width*0.5,height*0.5);
    if(active.pickedMesh != null && active.pickedMesh.door == true){
            var obj = active.pickedMesh;
            var door = active.pickedMesh.actor;
            door.Open(obj);
    }

}

function preload_sounds(){
    Sound( [ '../../sounds/weapons/gun1.wav' ], 275, 1 );
    Sound( [ '../../sounds/teleporter.wav' ], 275, 1 );
    Sound( [ '../../sounds/doors/door.wav' ], 275, 1 );
}
//setup collision on wall, floors, etc
var Teleporters = [];
var Walls = [];
var Doors = [];
var Floors = [];
var Enemies = [];
var Sounds = [];
var Items = [];
function Object_Setup(str){
            var obj;
            for(var x = 0;x < str.length;x++){
                for(var i = 0;i<Scene.meshes.length;i++){ 
                    obj = Scene.meshes[i];
                    if(obj.name.indexOf(str[x]) > -1){
                        if(str[x] == "Wall"){
                            obj.Wall = true;
                            Walls.push(obj);
//                            obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0 });
                        }else if(str[x] == "Door"){
                            obj.Door = true;
                            Doors.push(new Load_Door(obj));
                            //obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
                        }else if(str[x] == "Floor"){
                            obj.Floor = true;
                            obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.7, restitution: 0.7 });
                            Floors.push(obj);
                        }else if(str[x] == "Enemy"){
                            Enemies.push(new Load_Enemy(obj));
                        }else if(str[x] == "Explosion"){
                           Explode = new Explosion(obj, 20, Math.floor(Math.random() * 6) + 1); 
                        }
                        obj.checkCollisions = true;

                    }else if (obj.name.indexOf("Teleporter") > -1){
                        obj = Scene.meshes[i];
                        Teleporters.push(obj);
                        obj.Teleporter = true;
                        objarray = obj.name.split(".");
                        obj.pos = objarray[1];
                    }else if(obj.name.indexOf("Item") > -1){
                            if(obj.name.indexOf("HealthPack") > -1){
                            console.log("test"); 
                                Items.push(new Load_Item(obj));
                            }
                        }


                }
            }
}

//Enemy settings
var Load_Enemy = function(obj){
    Enemies.push(this);
    this.index = Enemies.length - 1;
    this.active = false;
    this.mesh = obj;
    obj.shootable = true;
    obj.enemy = this;
    this.dead = false;

    //get enemy health
    this.health = 10;
    HL = obj.name.split(".");
    for(i =0; i < HL.length;i++){
        if(HL[i].indexOf("HL-") > -1){
            H = HL[i].split("-");
            this.health = H[1];
            break; 
        }
    }

    if(obj.name.indexOf("Turret") > -1){
        Turret(this);
    }else if(obj.name.indexOf("Barrel") > -1){
        Barrel(this);
    }else if(obj.name.indexOf("ProxyDeath") > -1){
        //Wait for player to get close then explode
        ProxyDeath(this);
    }

    this.damage = function(damage){
        this.health -= damage;
//        console.log(this.mesh.name + " has been hit!!!");
//        console.log(this.mesh.name + " health is " + this.health);
        
        if(this.health < 1){
            this.death();
        }

        if(this.physics == false){
            this.physics_activate(true);
        }

    }

    this.death = function(){
        this.dead = true;
        console.log(this.mesh.name + " is dead!!!");
        if(this.death_type=="explosion"){
            Explode = new Explosion(obj, this.death_size, this.death_delay)
        }
    }

    this.physics_activate = function(on){
        if(on == true){
                this.mesh.setPhysicsState({
                    impostor: BABYLON.PhysicsEngine.BoxImpostor,
                    mass: this.mass,
                    friction: this.friction,
                    restitution: this.restitution });
            var _this = this;
            setTimeout(function(){
                //console.log(_this.mesh.name + " Physics disabled!");
                _this.mesh.setPhysicsState({});
            },10000)
        }
    }

    this.update = function(){
        if(this.follow == true){
            obj.lookAt(Camera.position);
        }

        var dis = check_distance(obj, Camera);
        if(dis < 50 && this.active == false){
            this.active = true;
            //console.log("You have been spotted!");
            if(this.ProxyDeath == true){
                this.death();
                this.ProxyDeath = false;
            }

            if(this.physics == false){
                //this.physics_activate(true);
            }
        }else if(dis > 100 && this.active == true){
            this.active = false;
            //console.log("You have escaped!");
        }
    }
}

function Turret(_this){
    _this.type = "Turret";
    _this.follow = true;
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    
}

function ProxyDeath(_this){
    _this.type = "ProxyDeath";
    _this.follow = true;
    _this.death_type = "explosion";
    _this.death_size = 30;
    _this.death_delay = Math.floor(Math.random() * 3) + 1;
    _this.ProxyDeath = true;
    _this.death_type = "explosion";
}

function Barrel(_this){
    _this.type = "Barrel";
    _this.active = false;
    _this.follow = false;
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    _this.mass = 5;
    _this.friction = 1;
    _this.restitution = 0;
    _this.physics = false;
}



var Explosion = function(obj, size, delay){
    this.mesh = obj;
    Sounds.push(new Sound( [ "../../sounds/weapons/explode_1.wav" ], 275, 1 ));
    var s = Sounds.length - 1;
//    this.sound = new Sound( [ "../../sounds/weapons/explode_1.wav" ], 275, 1 );
    var explosion = new BABYLON.SpriteManager("Explosion", "../../sprites/explosions/Exp_type_B.png", 2, 192, Scene);
    this.position = obj.position;
    var pos = obj.position;
    var _this = this;

        if(size == null){
            var size = 10;
        }        

    if(delay == null){
        delay = 0;
    }else{
        delay *= 1000;
    }

    
    this.active = function(){
        var pdis = check_distance(this, Camera);
        if(pdis < 25){
            var pdamage = 100 - pdis;
            pdamage = Math.round(pdamage);
            pdamage = pdamage * 0.2 * (size * .1);
            pdamage = Math.round(pdamage);
            Player.damage(pdamage);
        }

        for(var i = 0;i<Enemies.length;i++){
            var dis = check_distance(this, Enemies[i].mesh);
            dis = Math.round( dis );
            if(Enemies[i].mesh != this.mesh && Enemies[i].dead == false && dis < 5){ 
            
            //console.log("Distance is " + dis);
                    var damage = 100 - dis;
                    damage = damage * 0.5 * (size * .1);
                    damage = Math.round( damage );
                    //console.log(Enemies[i].mesh.name + " hit with damage of " + damage);
                    Enemies[i].death_delay = Math.floor(Math.random() * 6) * 0.5 ; 
                    Enemies[i].damage(damage);//if this line is uncommented the whole level explodes and games crashes
            }

        }
        obj.dispose();
        var Explode = new BABYLON.Sprite("explode", explosion);
        Sounds[s].play();
        //this.sound.play();
        Explode.playAnimation(0, 64, false, 5);
        Explode.position = pos;
        if(size == null){
            Explode.size = 10;
        }else{
            Explode.size = size;
        }

        setTimeout(function(){
            Explode.dispose();
        },5000);  
    }

    setTimeout(function(){ 
        //console.log(delay);
        _this.active();
    },delay);

}

function Enemy_Update(){
    for(var i = 0;i < Enemies.length;i++){
        Enemies[i].update();
    }
}

//check if shot
function Shot(){
    var x = Math.round(engine.getRenderWidth() * 0.5);
    var y = Math.round(engine.getRenderHeight() * 0.5);
    
    var active = Scene.pick(x,y);
//    console.log("Height/Width : " + height + "/" + width);
    //console.log("y/x : " + y + "/" + x);
//    console.log(active.pickedMesh.name);
    if(active.pickedMesh != null && active.pickedMesh.shootable == true){
            var enemy = active.pickedMesh.enemy;
            enemy.damage(10);
    }
}

//Crosshair
function Load_Crosshair(){
    console.log("Loading Crosshair");
    var Crosshair = BABYLON.Mesh.CreateBox("Cross", 0.05, Scene);
//    var crosshair = new BABYLON.SpriteManager("Crosshair", "../../sprites/crosshairs/crosshair_1.png", 1, 16, Scene);
//    var Crosshair = new BABYLON.Sprite("crosshair", crosshair);
    Crosshair.parent = Camera;
    Crosshair.position.x = 0;
    Crosshair.position.y = 0;
    Crosshair.position.z = 2;

//    Crosshair.position = Camera.position.add(new BABYLON.Vector3(0, 0, 5));
//    Crosshair.size = 5;

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
    if(obj.position.x > obj1.position.x){
        DIS['x'] = obj.position.x - obj1.position.x;
    }else{
        DIS['x'] = obj1.position.x - obj.position.x;
    }

    if(obj.position.y > obj1.position.y){
        DIS['y'] = obj.position.y - obj1.position.y;
    }else{
        DIS['y'] = obj1.position.y - obj.position.y;
    }

    if(obj.position.z > obj1.position.z){
        DIS['z'] = obj.position.z - obj1.position.z;
    }else{
        DIS['z'] = obj1.position.z - obj.position.z;
    }

    x = Math.max(DIS['x'],DIS['y'],DIS['z']);
    return x;
}


//Doors
var Load_Door = function(obj){
    this.sound = new Sound( [ '../../sounds/doors/door.wav' ], 275, 1 );
    obj.door = true;
    obj.actor = this;


    this.type = function(obj){
        if (obj.name.indexOf("Down") != -1){
            obj.Type = "Down";
            for(var i=0;i<Scene.meshes.length;i++){
                var floor = Scene.meshes[i];
                if(obj.intersectsMesh(floor) && floor.Floor == true){
                    obj.Floor = floor.position.y;
                 //   break;
                }
            }
    
        }
        return obj.Type;    
    }


    this.type(obj);
    this.Open = function(obj){

        if(obj.Type == null){
            obj.Type = this.Type;
        }
        if(obj.lock != "1"){
            obj.lock = "1";
            obj.orgPosY = obj.position.y;
        
            //console.log("Door Open.");
            //door_sound.position.copy( obj.scaling.y );
            this.sound.play();
            Open = new TWEEN.Tween({y: obj.position.y})
            .to({ y: obj.Floor }, 1000)
            .onUpdate( function(){
                //obj.translate(BABYLON.Axis.Y, -0.2, BABYLON.Space.WORLD);
                obj.position.y=this.y;
            });
    
            Open.start();
            this.Close(obj);
        }
    }


    this.Close = function(obj){
            var sound = this.sound;
            setTimeout(function(){
                sound.play();
                    //door_sound.position.copy( obj.position );
                        Close = new TWEEN.Tween({y: obj.position.y})
                        .to({ y: obj.orgPosY}, 1000)
                        .onUpdate( function(){
                            //obj.translate(BABYLON.Axis.Y, 0.2, BABYLON.Space.WORLD);
                            obj.position.y=this.y;
                            if(obj.position.y.toFixed(4) == obj.orgPosY.toFixed(4)){
                                obj.lock = "0";
                            }
                        });
                        Close.start();
    
            },5000);
    
    }
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
var Load_Player = function(health){
    if(health == null){
        this.health = 100;
    }else{
        this.health = health;
    }

    this.update = function(){
//        console.log("Health " + this.health);
        
        var hud_health = document.getElementById("health");
        hud_health.innerHTML = "Health: " + this.health;
        if(this.health < 1){
            this.death();
        }
    }

    this.damage = function(hit){   
        this.health -= hit;
        this.update();
    }
    
    this.med = function(med){
        med = parseInt(med);
        this.health += med;
        this.update();
        
    }

    this.death = function(){
        console.log("Player Died!!!");
    }
}
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
    for(var x = 0; x<Teleporters.length;x++){
        var meshes = Teleporters[x];
        if(meshes != obj && meshes.pos == obj.pos ){
            Teleport_Blur();
            var sound = new Sound( [ "../../sounds/teleporter.wav" ], 275, 1 );
            sound.play();
    
            console.log("Teleporting to " + meshes.name)
            Camera.position.x = meshes.position.x;
            Camera.position.y = meshes.position.y;
            Camera.position.z = meshes.position.z;
            camSensor.position = Camera.position;
    
            break; 
        }
    }
}

function Teleport_Blur(){
    var blurw = 10;
    postProcess = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), blurw, .25, Camera, null, engine, true);

                    Blur = new TWEEN.Tween({w: blurw})
                    .to({ w: 0}, 1000)
                    .onUpdate( function(){
                        postProcess.blurWidth = this.w;
                        if(this.w == 0){
                            postProcess.dispose();
                        }
                    });
                    Blur.start();
}


var Touch_Sensor = 0;
function check_camSensor(){
    if(Touch_Sensor == 0){
        for(var i=0;i<Teleporters.length;i++){
            obj = Teleporters[i];
           
            if(camSensor.intersectsMesh(obj)){
                Touch_Sensor = 1;
                setTimeout(function(){ Touch_Sensor = 0; },5000); //wait for touch_sensor to reactivate
                Teleport(obj);
                break;
            }
        }

        for(var i=0;i<Items.length;i++){
            obj = Items[i];
            console.log("check");
            if(camSensor.intersectsMesh(obj.mesh)){
                Touch_Sensor = 1;
                setTimeout(function(){ Touch_Sensor = 0; },100); //wait for touch_sensor to reactivate
                if(obj.type == "HealthPack" && obj.active == true){
                    obj.active = false;
                    obj.mesh.dispose();
                    Player.med(obj.health);
                }
                    break;
            }
        }
    }
}

var camSensor;
function create_camSensor(){
    //console.log("creating camSensor");
    // create sensor mesh  - parent to  camera
    camSensor = new BABYLON.Mesh.CreateBox("sensor", 1, Scene);
    camSensor.material = new BABYLON.StandardMaterial("camMat", Scene);
    camSensor.isVisible = false;
    camSensor.material.wireframe = true;
    camSensor.scaling = new BABYLON.Vector3(1, 2, 1);
    camSensor.position = Camera.position;
//    camSensor.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 5, friction: 0.5, restitution: 0 });
    //camSensor.parent = Camera;
}

//items

var Load_Item = function(item){
    this.index = Enemies.length - 1;
    this.active = true;
    this.mesh = item;
    if(item.name.indexOf("HealthPack") > -1){
        //if it's a HealthPack
        HealthPack(this);
    }
}

function HealthPack(_this){
    _this.health = 25;
    _this.type = "HealthPack";
    obj = _this.mesh;
    HL = obj.name.split(".");
    for(i =0; i < HL.length;i++){
        if(HL[i].indexOf("HL-") > -1){
            H = HL[i].split("-");
            _this.health = H[1];
            break;
        }
    }
    
}
