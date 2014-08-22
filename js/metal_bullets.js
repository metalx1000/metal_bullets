/**
 * @author Kris Occhipinti <A.K.A. Metalx1000>/ http://filmsbykris.com/
 * @code https://github.com/metalx1000/metal_bullets
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 */

//var width = window.innerWidth;
//var height = window.innerHeight;

////////////////////////////Load Scene/////////////////////////////
var Scene, canvas, engine, Player;

//Load HUD hidden
Load_HUD();

function Load_Scene(MAP, MUSIC){
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
                Scene.gravity = new BABYLON.Vector3(0, -0.3, 0);
                Scene.collisionsEnabled = true;

                Player = new Load_Player();

                Load_Missile_Model();
                //Load_Fog();
                //Load_Sky();
                Object_Setup();
                Object_Setup();//Load Object Setup twice or interacting objects might be missed

                create_camSensor();
 
                activate_controls();
                win_controls();

                var music = [];
                music.push("../../music/storm_1.ogg");
                if (MUSIC != null){
                    music.push(MUSIC);
                }
                //console.log(music);
                Music = new Load_Music(music, 1, true);
                create_music_menu();

                Activate_HUD();
                Crosshairs("load");//check local storage to see if crosshairs should be on

                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function() {
                    Scene.render();
                    check_camSensor();
                    Player.update();
                    Sounds_Update();
                    Start_Main_Timer();
                });
            });
        }, function (progress) {
            // To do: give progress feedback to user
            if (progress.lengthComputable) {
                p = (progress.loaded * 100 / progress.total).toFixed();
                if(p == 100){
                   
                }else{
                    document.title = "Loading, please wait..." + p + "%";
                }
            }
        });
    }


}

////////////////World Settings//////////////////////
function Load_Fog(){
    Scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
//    Scene.fogDensity = 0.01;
    Scene.fogStart = 20.0;
    Scene.fogEnd = 60.0;
}

function Load_Sky(){
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, Scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", Scene);
    skyboxMaterial.backFaceCulling = false;
    skybox.material = skyboxMaterial;
    
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
}

////////////////Controls///////////////////////////
function activate_controls(){
    set_keys();
    set_mouse();
}

//KeyBoard Controls
function set_keys(){
    window.addEventListener("keydown", function (event) {
        //console.log(event); //uncomment to test key value
        if (event.keyCode === 32) {
            if(Player.dead == false && pause == false){
                //"Space as activate key"
                Activate();
            }else{
                location.reload();
            }
        }else if (event.keyCode === 77) {
            //"Menu on 'M'"
            Menu_Open();
        }else if (event.keyCode === 61 || event.keyCode === 187) {
            //music volume up on '+'
            Music.vol_up();
        }else if (event.keyCode === 173 || event.keyCode === 189) {
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
            Crosshairs();
        }




    }, false);

}


//Mouse Controls

var gun_active = false;
function set_mouse(){
    window.addEventListener("mousemove", function(event) {
                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                //make sure camera is loaded before trying to move it.
                if(!Camera){
                    console.log("Waiting for Camera to load...");
                }else{
                    if(Player.dead == false && pause == false){
                        Camera.rotation.y += movementX * 0.002;
                        Camera.rotation.x += movementY * 0.002;
                    }
                }
    });
    window.addEventListener("mousedown", function(event) {
        if(MenuOpen == false){
        Full_Screen();
            Pointer_Lock(true);
        }
        event.preventDefault();//This prevents the highlighting of elements when shooting
        //console.log(event.which);//uncomment to test buttons
        if(event.which == 1 && Player.dead == false && pause == false){
            Gun_Shoot();
        }else if(event.which == 3){
            if(Player.dead == false && pause == false){
                Player.jump();
            }else if (Player.dead == true){
                location.reload();//reload level if player is dead
            }

        }
    }, false);

    window.addEventListener("mouseup", function(event) {
        if(event.which == 1){
            gun_active = false;
        }
    },false);
}


/////////Weapons///////////
function Gun_Shoot(){
    gun_active = true;

    if(Player.gun == 1 && Player.bullets > 0){
            Gun_Fire();
    }else if (Player.gun == 2 && Player.bullets > 0){
        Gun_Fire();
        var machinegun = setInterval(function(){
            
            if( Player.bullets < 1){
                clearInterval(machinegun);
            }else{
                Gun_Fire();
            }
    
            if(gun_active == false){
                clearInterval(machinegun);
            }
        },100);
    }else if (Player.gun == 3 && Player.shells > 0 && Player.ShotGun_Active == 0){
        Player.ShotGun_Active = 1;
        Gun_Fire("shell");
        setTimeout(function(){
            Player.ShotGun_Active = 0;
        },1500);
    }

}

function Gun_Fire(type){
    if(type == "shell"){
        Player.shells -= 1;

        var gun_sound = new Sound( [ "../../sounds/weapons/shotgun1.wav" ] );
        gun_sound.play();

        for(var i = 10;i > 0;i--){
            Shot(type);
        }
    }else{
            Player.bullets -= 1;

            Player.bullet_sounds[Player.bullet_x].play();
            Player.bullet_x += 1;
            if(Player.bullet_x >= Player.bullet_max){
                Player.bullet_x = 0;
            }

            Shot();
    }

}


var MissileDUD;
function Load_Missile_Model(obj){
        BABYLON.SceneLoader.ImportMesh("Missile", "../../models/", "Missile.babylon", Scene, function (newMeshes, particleSystems) {
            MissileDUD = newMeshes[0];
            MissileDUD.visibility = false;
            MissileDUD.scaling.x = 0.25;
            MissileDUD.scaling.y = 0.25;
            MissileDUD.scaling.z = 0.25;
        });
}
//check if shot
function Shot(type){
    //find center of screen
    var x = Math.round(engine.getRenderWidth() * 0.5);
    var y = Math.round(engine.getRenderHeight() * 0.5);

 
    if(type == "shell"){
        //random placement of shotgun spray
        x += Math.floor(Math.random() * 10) - 5;
        y += Math.floor(Math.random() * 10) - 5;
        console.log(x + ":" + y);
        var active = Scene.pick(x,y);
        //Bullet_Effect(x,y, active.pickedMesh); //not working at this point
                                             //need to figure out z position
        if(active.pickedMesh != null && active.pickedMesh.shootable == true){
                var enemy = active.pickedMesh.enemy;
                enemy.damage(10);
        }


        //random placement of shotgun spray
        x += Math.floor(Math.random() * 100) - 50;            
        y += Math.floor(Math.random() * 100) - 50;            
        console.log(x + ":" + y);
        var active = Scene.pick(x,y);
        //Bullet_Effect(x,y, active.pickedMesh); //not working at this point
                                             //need to figure out z position
        if(active.pickedMesh != null && active.pickedMesh.shootable == true){
                var enemy = active.pickedMesh.enemy;
                enemy.damage(10);
        }


    }else{
        var active = Scene.pick(x,y);
        //Bullet_Effect(x,y, active.pickedMesh); //not working at this point
                                                 //need to figure out z position
        if(active.pickedMesh != null && active.pickedMesh.shootable == true){
                var enemy = active.pickedMesh.enemy;
                enemy.damage(10);
        }
    }

}

//bullet sprite effect
//Not functioning yet
var Bullet_Effect = function(x,y,obj){
    var impact = BABYLON.Mesh.CreatePlane("impact", .2, Scene);
    impact.material = new BABYLON.StandardMaterial("impactMat", Scene);
    impact.material.diffuseTexture = new BABYLON.Texture("../../sprites/bullet_hit.png", Scene);
    impact.material.diffuseTexture.hasAlpha = true;
    console.log(impact.position);
    impact.position = obj.position;
    impact.lookAt(Camera.position);
        impact.locallyTranslate(new BABYLON.Vector3(0, 0, -10));    
    
/*    while(impact.intersectsMesh(obj)){
        impact.locallyTranslate(new BABYLON.Vector3(0, -0.2, 0));    
        console.log("impact");
    }
*/
    console.log(impact.position);
    //impact.position = new BABYLON.Vector3(0, 0, -0.1);
    console.log(impact.position);
    //impact.position.x = x;
    //impact.position.y = y;
}

/////////////////////////////////Window Controls///////////////
function win_controls(){
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
}
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
            console.log("Volume is set to " + this.vol * 100 + "%");
            localStorage.setItem("Music_Vol", this.vol);
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
        console.log("Volume is set to " + this.vol * 100 + "%");
        localStorage.setItem("Music_Vol", this.vol);
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
        localStorage.setItem("Music_Vol", this.vol);
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
    }


    ////////////////Retrieve Saved music Volume
    if(localStorage.getItem("Music_Vol") != null){
        this.vol = parseFloat(localStorage.getItem("Music_Vol"));
        
        this.set_vol(this.vol);
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


var MenuOpen = false;
function Menu_Open(){
    if(MenuOpen == false){
        Pause(true);
        MenuOpen = true;
        var music_menu = document.getElementById('music_menu');
        music_menu.hidden = false;
        Pointer_Lock(false);
    }else{
        Pause(false);
        MenuOpen = false;
        var music_menu = document.getElementById('music_menu');
        music_menu.hidden = true;
        Pointer_Lock(true);

    }
}

var pause = false;
function Pause(set){
    if(set == true){
        pause = true;
        Camera.detachControl(canvas);
        Main_Timer = false;
    }else{
        pause = false;
        Main_Timer = true;
        Scene.activeCamera.attachControl(canvas);
    }
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


//pointer/cursor lock
function Pointer_Lock(lock){
    if(lock == true){
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock ||
                 element.mozRequestPointerLock ||
                 element.webkitRequestPointerLock;
// Ask the browser to lock the pointer
        element.requestPointerLock();
    }else{
        document.exitPointerLock = document.exitPointerLock ||
               document.mozExitPointerLock ||
               document.webkitExitPointerLock;
        document.exitPointerLock();
    }
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
                    //sound_num += 1;//uncomment to limit number of sounds at one time
//                    if(sound_num <= 25){
                        audio.play();
/*                   }

                    setTimeout(function(){
                        sound_num -= 1;
                        if(sound_num < 0){
                            sound_num = 0;
                        }
                    },1000); */
                }


                this.update = function ( camera ) {

                    var distance = check_distance( obj, Camera );
                    if ( distance <= radius ) {

                        audio.volume = volume * ( 1 - distance / radius );
//                        console.log("volume: " + audio.volume);
                    } else {

                        audio.volume = 0;

                    }

                }

}

function Sounds_Update(){
    for(var i = 0; i < Sounds.length; i++){
        Sounds[i].update();
    }   
}

//////////////////////////World Settings/////////////////
var postProcess;
function Activate(){
    var active = Scene.pick(width*0.5,height*0.5);
    if(active.pickedMesh != null && active.pickedMesh.type == "Door"){
            var obj = active.pickedMesh;
            var door = active.pickedMesh.actor;
            door.Open(obj);
    }

}


//setup collision on wall, floors, etc
var Teleporters = [];
var Walls = [];
var Doors = [];
var Floors = [];
var Enemies = [];
var Sounds = [];
var Items = [];
var Obstacles = [];

function Object_Setup(){
    //clear arrays       
    Teleporters = [];
    Walls = [];
    Doors = [];
    Floors = [];
    Enemies = [];
    Sounds = [];
    Items = [];
    Obstacles = [];
    Environments = [];

    var obj;
    for(var i = 0;i<Scene.meshes.length;i++){ 
        obj = Scene.meshes[i];
        obj.array = obj.name.split(".");
        obj.type = obj.array[0];
        if( obj.type == "Wall"){
            Walls.push(obj);
            Obstacles.push(obj);
            obj.checkCollisions = true;
            //obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0 });
        }else if(obj.type == "Door"){
            Doors.push(new Load_Door(obj));
            Obstacles.push(obj);
            obj.checkCollisions = true;
            //obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
        }else if(obj.type == "Floor"){
            obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.7, restitution: 0.7 });
            obj.checkCollisions = true;
            Obstacles.push(obj);
            Floors.push(obj);
        }else if(obj.type == "Enemy"){
            obj.checkCollisions = true;
            Obstacles.push(obj);
            Enemies.push(new Load_Enemy(obj));
        }else if(obj.type == "Explosion"){
            Explode = new Explosion(obj, 20, Math.floor(Math.random() * 6) + 1); 
        }else if(obj.type == "Teleporter"){
            Teleporters.push(obj);
            obj.pos = obj.array[1];
        }else if(obj.type == "Item"){
            Items.push(new Load_Item(obj));
        }else if(obj.type == "Env"){
            Environments.push(obj);
        }
    }
    
}

//Enemy settings
var Missile_ID = 0;
var Load_Enemy = function(obj){
    Enemies.push(this);
    this.index = Enemies.length - 1;
    this.active = false;
    this.mesh = obj;
    obj.shootable = true;
    obj.enemy = this;
    this.dead = false;
    this.mesh.dead = false;

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
    }else if(obj.name.indexOf("ShootPhysics") > -1){
        //Wait for player to get close then explode
        ShootPhysics(this);
    }else if(obj.name.indexOf("Flying") > -1){
        //Wait for player to get close then explode
        Flying(this);
    }


    this.damage = function(damage){
        this.health -= damage;
//        console.log(this.mesh.name + " has been hit!!!");
//        console.log(this.mesh.name + " health is " + this.health);
        
        if(this.health < 1){
            this.death();
        }

        this.active = true;
        if(this.physics == false){
            this.physics_activate(true);
            if(this.physics_others == true){
                for(var i = 0;i < Enemies.length;i++){
                    var dis = check_distance(this.mesh, Enemies[i].mesh);
                    if(dis < 15){
                        Enemies[i].physics_activate(true);
                    }                    
                }
            }
        }

    }


    this.death = function(){
        if(this.dead != true){
            this.dead = true;
            this.mesh.dead = true;
            //console.log(this.mesh.name + " is dead!!!");
            if(this.death_type=="explosion"){
                Explode = new Explosion(obj, this.death_size, this.death_delay)
            }
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
            },this.physics_time)
        }

    }

    this.attack = function(){
        if(this.dead != true){
            if(this.weapon == "HEAT"){
                var missile = BABYLON.Mesh.CreateSphere("Sphere", 5.0, 0.5, Scene);
                missile.position = this.mesh.position;
                //missile.position = this.mesh.position.add(new BABYLON.Vector3(0, 0, 0));
                var mis = new Load_Enemy(missile);
                Heat_Missile(mis,this);
            }else if(this.weapon == "Missile"){
                //var missile = BABYLON.Mesh.CreateSphere("Sphere", 5.0, 0.5, Scene);
                //var MissileDUD = Scene.getMeshByName("MissileDUD");
                var MissileDUD = Scene.getMeshByName("Missile");
                MissileDUD.lookAt(Camera.position);
                MissileDUD.position = this.mesh.position;
                var missile = MissileDUD.clone("MissileID" + Missile_ID);
                missile.visibility = true;
                missile = Scene.getMeshByName("MissileID" + Missile_ID);
                Missile_ID += 1;
                //missile.position = this.mesh.position.add(new BABYLON.Vector3(2, 2, 2));
    // console.log(this);
                var mis = new Load_Enemy(missile);
                Missile(mis,this);
            }
        }
    }

   
    this.life_span = function(){ 
        if(this.life_time != null && this.active == true && this.dead != true){
            var _this = this;
            setTimeout(function(){
                _this.death();
            },this.life_time);
            this.life_time = null;
        }
    }

    this.update = function(){
        //if object has life_time, die when the life time runs out
        this.life_span();
/*
        if(this.life_time != null && this.life_time > 0 && this.dead != true){
            this.life_time -= 1;
        }else if(this.life_time != null && this.life_time < 1 && this.dead != true){
            this.death();
        }
*/
        if(this.far == null){this.far = 100};

        if(this.dead != true){
            this.pos = this.mesh.position;

            if(this.follow == true && this.active == true && this.lookcam == 0){
                obj.lookAt(Camera.position);
            }
    
            var dis = check_distance(obj, Camera);
            if(dis < 50 && this.active == false){
                this.active = true;
                //console.log("You have been spotted!");
                if(this.ProxyDeath == true){
                    this.beep_sound = new Sound( [ "../../sounds/weapons/Proxy_Beep.wav" ], obj, 1, 50 );
                    Sounds.push(this.beep_sound);
                    this.beep_sound.play();
                    this.death();
                    this.ProxyDeath = false;
                }
    
            }else if(dis > this.far && this.active == true){
                this.active = false;
            }else if(dis < 5 && this.active == true){
                this.active = false;
                if(this.suicide == true){
                    this.death();
                }
            }
    
            //move enemy
            if(this.speed != null && this.active == true || this.projectile == true){
                //delay camera following
                this.lookcam -= 1;
                if(this.lookcam < 1){
                    this.lookcam = this.lookcam_d;
                    this.mesh.lookAt(Camera.position);
                }
               
                if(this.attack_delay < 1 && this.weapon != null){
                    this.mesh.lookAt(Camera.position);
                    this.attack_delay = this.attack_delay_d;
                    this.attack();
                }else if(this.attack_delay != null){    
                    this.attack_delay -=1;
                }
                //check collisions
                for(var i=0;i<Obstacles.length;i++){
                    var obs = Obstacles[i];
                    //console.log(wall.name + " is " + this.mesh.intersectsMesh(wall));
                    var col = this.check_collision(obs); 
                    if(col){break;}
                }
            }
  
        }
    }

    this.check_collision = function(obs){
//                   console.log(obs.dead) ;
                    if(this.mesh.intersectsMesh(obs) && this.mesh != obs && obs != this.mother){
                        if(obs.dead == false || obs.dead == null){
                            if(this.collsion_death == true){
                                this.death();
                            }
                            if (this.follow != "none"){
                                this.follow = false; 
                            }
    //                        this.mesh.position = this.pos;
                            var rotate = Math.floor(Math.random() * 4) + 1
                            this.mesh.rotate(BABYLON.Axis.Y, rotate, BABYLON.Space.LOCAL);
                            this.mesh.locallyTranslate(new BABYLON.Vector3(0, 0, 1));
                            return true;
                        }
                    }else{
                        if (this.follow != "none"){
                            this.follow = true; 
                        }
                        this.mesh.locallyTranslate(new BABYLON.Vector3(0, 0, -this.speed));
                        return false;
                    }
    }
}

function Turret(_this){
    _this.type = "Turret";
    _this.far = 200;
    _this.follow = true;
    _this.lookcam = 0;
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    _this.lookcam_d = 0;
    _this.lookcam = _this.lookcam_d;
    _this.speed = 0;
    _this.weapon = "Missile"    
    _this.attack_delay_d = Math.floor(Math.random() * 200) + 50;
    _this.attack_delay = _this.attack_delay_d;
}

function Flying(_this){
    _this.type = "Flying";
    _this.far = 4000;
    _this.follow = true;
    _this.lookcam_d = 100;
    _this.lookcam = _this.lookcam_d;
    _this.attack_delay_d = Math.floor(Math.random() * 300) + 50;
    _this.attack_delay = _this.attack_delay_d;
    _this.weapon = "HEAT";
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    _this.speed = .2;
    _this.suicide = true; //Kill themsselves to kill player
 
}

function Heat_Missile(_this,mother){
    _this.type = "Heat_Missile";
    _this.projectile = true;
    _this.follow = true;
    _this.far = 4000;
    _this.weapon = null;
    _this.collsion_death = true;
    _this.mother = mother.mesh;
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    _this.lookcam_d = 0;  
    _this.lookcam = _this.lookcam_d;   
    _this.speed = 2;
    _this.suicide = true; //Kill themsselves to kill player
    _this.life_time = 5000;

}

function Missile(_this,mother){
    _this.type = "Missile";
    _this.projectile = true;
    _this.follow = "none";
    _this.lookcam_d = 1000;
    _this.lookcam = _this.lookcam_d;
    _this.far = 4000;
    _this.weapon = null;
    _this.collsion_death = true;
    _this.mother = mother.mesh;
    _this.death_type="explosion";
    _this.death_size=10;
    _this.death_delay=0;
    _this.speed = 3;
    _this.suicide = true; //Kill themsselves to kill playeri
    _this.mesh.lookAt(Camera.position);
    _this.life_time = 5000;

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
    _this.physics_time = 10000;
    _this.physics_others = false;
}

function ShootPhysics(_this){
    _this.type = "ShootPhysics";
    _this.active = false;
    _this.follow = false;
    _this.mass = 4;
    _this.friction = 1;
    _this.restitution = 0;
    _this.physics = false;
    _this.physics_time = 10000;
    _this.physics_others = true;
    _this.health = 10000;
}


var sound_limit = 0;
var Explosion = function(obj, size, delay){
    this.mesh = obj;
    this.sound = new Sound( [ "../../sounds/weapons/explode_1.wav" ], obj, 1, 200 );

    Sounds.push(this.sound);
//    this.sound = new Sound( [ "../../sounds/weapons/explode_1.wav" ], 275, 1 );
    var explosion = new BABYLON.SpriteManager("Explosion", "../../sprites/explosions/Exp_type_B.png", 2, 32, Scene);
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
            pdamage = pdamage * 0.1 * (size * .1);
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
        //obj.dispose();//This is the line that cause object to not work correctly
        //disposing of meshes seems to sometimes cause other items (healthpacks and teleporters)
        //to stop working and walls sometimes disapear.
        //for right now, we'll just hide everything]        
        obj.isVisible = false;
        obj.setPhysicsState({});
        obj.checkCollisions = false;


        var Explode = new BABYLON.Sprite("explode", explosion);

        //Limit the number of Explotion sounds
        sound_limit += 1;//uncomment to limit number of sounds at one time
        if(sound_limit <=10){
            this.sound.play();
        }

        setTimeout(function(){
            sound_limit -= 1;
            if(sound_limit < 0){
                sound_limit = 0;
            }
        },1000); 



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

var Main_Timer = true;

var startDate = new Date();
var startTime = startDate.getTime();

var date_now = new Date (); 
var time_now = date_now.getTime (); 
var time_diff = time_now - startTime; 
var time_delay = 50;
var seconds_elapsed = Math.floor ( time_diff / 1000 ); 

function Start_Main_Timer(){
    date_now = new Date (); 
    time_now = date_now.getTime (); 
    time_diff = time_now - startTime; 
    seconds_elapsed = Math.floor ( time_diff / 1000 ); 

    if(Main_Timer ==  true && time_diff > time_delay){
    console.log(time_diff);

        if(Camera.cameraDirection.y < 0.25){
            Camera.cameraDirection.y = -0.4;//Gravity
        }
 
        for(var i = 0;i < Enemies.length;i++){
            Enemies[i].update();
        }
        //this updates the HUD fps element
        //and will most likely be moved else where at some pount
        HUD_FPS();

        //if player is in lava
        if(Player.lava == true){
            Player.damage(1);
        }

        startDate = new Date();
        startTime = startDate.getTime();
    };


}

//Crosshair
function Crosshairs(get){
    if(get == "load"){
        if(localStorage.getItem("crosshairs") === null){
            localStorage.setItem("crosshairs", "false");
        }else if(localStorage.getItem("crosshairs") == "true"){
            crosshairs = true;
            document.getElementById("crosshairs").style.visibility="visible";
        }else if(localStorage.getItem("crosshairs") == "false"){
            crosshairs = false;
            document.getElementById("crosshairs").style.visibility="hidden";
        }
    }else{
        if(crosshairs == true){
            crosshairs = false;
            localStorage.setItem("crosshairs", "false");
            document.getElementById("crosshairs").style.visibility="hidden";
        }else{
            crosshairs = true;
            localStorage.setItem("crosshairs", "true");
            document.getElementById("crosshairs").style.visibility="visible";
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
    Scene.stopAnimation(obj);
    this.sound = new Sound( [ '../../sounds/doors/door.wav' ], obj, 1, 200 );
    Sounds.push(this.sound);
    this.mesh = obj;
    obj.actor = this;
    this.array = obj.name.split(".");
    this.DoorType = obj.array[1];
    var lock = 0;

    if (this.DoorType == "Down"){
        for(var i=0;i<Scene.meshes.length;i++){
            var floor = Scene.meshes[i];
            if(obj.intersectsMesh(floor) && floor.type == "Floor"){
                obj.Floor = floor.position.y;
            }
        }
    
    }


    this.Open = function(obj){

        if(this.DoorType != "Down" && lock != "1"){
            lock = "1";
            _this = this;
            this.sound.play();
            Scene.beginAnimation(obj,1,30,false,1.0);
            setTimeout(function(){
                _this.sound.play();
                Scene.beginAnimation(obj,30,60,false,1.0);
                lock = "0";
            },5000);
            
        
        }else if(this.DoorType == "Down"){

            if(lock != "1"){
                lock = "1";
                obj.orgPosY = obj.position.y;
        
                //console.log("Door Open.");
                //door_sound.position.copy( obj.scaling.y );
                this.sound.play();
                var _this = this;
                var open = setInterval(function(){
                    obj.locallyTranslate(new BABYLON.Vector3(0, -0.2, 0));
                    if(obj.position.y < obj.Floor){
                        clearInterval(open);
                        setTimeout(function(){
                            _this.Close();
                        },5000);
                    }
                },10);
            }
        }
    } 
    

    this.Close = function(){
        this.sound.play();
        var close = setInterval(function(){
            obj.locallyTranslate(new BABYLON.Vector3(0, 0.2, 0));
            if(camSensor.intersectsMesh(obj)){
                Camera.position.y = obj.position.y + 3;
            }
            if(obj.position.y.toFixed(4) == obj.orgPosY.toFixed(4)){
                lock = "0";
//                Camera.cameraDirection.y = 2;
                clearInterval(close);
            }
        },10);

    }
}

function Full_Screen(){
    var element = document.body;
    element.requestFullscreen = element.requestFullscreen || 
        element.mozRequestFullscreen || 
        element.mozRequestFullScreen || 
        element.webkitRequestFullscreen;

    element.requestFullscreen();
}

/////////Player Configs/////////
var Load_Player = function(health){
    //Camera Controls
    Camera.keysRight.push(68);//Set Key 'D'
    Camera.keysLeft.push(65);//Set Key 'A'
    Camera.keysUp.push(87);//Set Key 'W'
    Camera.keysDown.push(83);//Set Key 'S'


    Camera.minZ = 1;
    Camera.checkCollisions = true;
//                Camera.applyGravity = true;//Using Custom now
    Camera.ellipsoid = new BABYLON.Vector3(1, 2, 1);
    Camera.speed = 3;


    this.dead = false;
    this.gun = 1;
    this.bullets = 100;
    this.shells = 0;
    this.ShotGun_Active = 0;
    this.weapon_mesh = null;

    //sounds
    this.death_sound = new Sound( [ "../../sounds/player/death_1.wav" ] );
    this.jump_sound = new Sound( [ "../../sounds/player/jump.wav" ] );

    this.water = false;
    this.water_splash_sound = new Sound( [ "../../sounds/water_splash.wav" ] );
    
    this.lava = false;

    this.hurt_sounds = [];
    this.hurt_sounds.push(new Sound( [ "../../sounds/player/hurt_1.wav" ] ));
    this.hurt_sounds.push(new Sound( [ "../../sounds/player/hurt_2.wav" ] ));

    this.bullet_sounds = [];
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1a.wav" ] ));//ricochet
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1b.wav" ] ));//ricochet
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1c.wav" ] ));//ricochet
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    this.bullet_sounds.push(new Sound( [ "../../sounds/weapons/gun1.wav" ] ));
    
    this.bullet_x = 0;
    this.bullet_max = this.bullet_sounds.length;


    this.gun3_cock_sound = new Sound( [ "../../sounds/weapons/shotgun_cock.wav" ] );

    this.health_sound = new Sound( [ "../../sounds/item_pickup.wav" ] );

    //is the player currently jumping
    this.jumping = false;

    if(health == null){
        this.health = 100;
    }else{
        this.health = health;
    }

    
    this.update = function(){
        //update health hud 
        var hud_health = document.getElementById("health");
        hud_health.innerHTML = "Health: " + this.health;
        if(this.health < 1){
            this.death();
        }

            //update ammo hud
            var bullets = document.getElementById("bullets");
            bullets.innerHTML = "Bullets: " + Player.bullets;
            var shells = document.getElementById("shells");
            shells.innerHTML = "Shells: " + Player.shells;

        
    }

    this.jump = function(height){
        if(height == null){height = 1};
            if(this.jumping == false){
                this.jumping = true;
                this.jump_sound.play();
                Camera.cameraDirection.y = height;
                _this = this;
                setTimeout(function(){
                    console.log("jump complete");
                    _this.jumping = false;
                },700);
            }
    }

    this.damage = function(hit){   
        if(god_mode == false && this.dead == false){
            var h = Math.floor(Math.random() * this.hurt_sounds.length);
            this.hurt_sounds[h].play(); 
            this.health -= hit;
            if(this.health <0){
                this.health = 0;
            }
            Damage_Layer();
        }else if(god_mode == true){
            this.health = 100;
        }
        this.update();
        
    }
    
    this.med = function(med){
        med = parseInt(med);
        this.health += med;
        if(this.health > 200){
            this.health = 200;
        }
        this.update();
        
    }

    this.death = function(){
        Camera.detachControl(canvas);
        Dead_Layer();
        if(this.dead == false){
            this.death_sound.play();
            this.dead = true;
            New_MSG("Player Died!!!");
            New_MSG("Press Space to restart level");
        }

        ////Player Drops Weapon on death
        if(this.weapon_mesh != null){
            this.weapon_mesh.parent = null;
            this.weapon_mesh.position = Camera.position.add(new BABYLON.Vector3(-2, -2, 0));
        }

    }

    var _this = this;
    setInterval(function(){
        if(_this.health > 100){
            _this.health -= 1;
        }
    },1000);
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
    var postProcess = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), blurw, .25, Camera, null, engine, true);

    var blur = setInterval(function(){
        blurw -= 0.2;
        postProcess.blurWidth = blurw;
        if(blurw < 0){
            blurw = 0;
            postProcess.dispose();
            clearInterval(blur);
        }
    },10);
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

        for(var i=0;i<Environments.length;i++){
            var obj = Environments[i];
            var name = obj.name.split(".");
            var type = name[1];

            if(camSensor.intersectsMesh(obj)){
                if(type == "Water" && Player.water == false){
                    Player.water = true;
                    Player.water_splash_sound.play();
                    break;
                }else if(type == "Lava" && Player.lava == false){
                    Player.lava = true;
                    break;
                }
            }else {
                Player.water = false;
                Player.lava = false;
            }
            
        }

        for(var i=0;i<Items.length;i++){
            obj = Items[i];
            dis = check_distance(obj.mesh, Camera);
            if(dis < obj.dis){
                Touch_Sensor = 1;
                setTimeout(function(){ Touch_Sensor = 0; },10); //wait for touch_sensor to reactivate
                if(obj.type == "HealthPack" && obj.active == true && Player.health < 100){
                    Player.health_sound.play();
                    obj.active = false;
                    obj.mesh.dispose();
                    Player.med(obj.health);
                    New_MSG("Picked Up Health Pack");
                }else if(obj.type == "Bullets" && obj.active == true && Player.bullets < 300){
                    obj.active = false;
                    obj.mesh.dispose();
                    Player.bullets += 100;
                }else if(obj.type == "Weapon" && obj.mesh.active == true){
                    obj.mesh.active = false;
                    obj.mesh.parent = Camera;
                    obj.mesh.position.x = 1;
                    obj.mesh.position.y = -1;
                    obj.mesh.position.z = 1;
                    //obj.mesh.dispose();
                    if(obj.wtype == "Gun2"){
                        Player.gun = 2;
                        if(Player.weapon_mesh != null){
                            Player.weapon_mesh.parent = null;
                            Player.weapon_mesh.position = Camera.position.add(new BABYLON.Vector3(-1, -1, 0));
                            var drop = Player.weapon_mesh;
                            setTimeout(function(){
                                drop.active = true;
                            },1000);
                        }
                        Player.weapon_mesh = obj.mesh;
                        Player.bullets += 100;
                    }else if(obj.wtype == "Gun3"){
                        Player.gun = 3;
                        Player.gun3_cock_sound.play();
                        if(Player.weapon_mesh != null){
                            Player.weapon_mesh.parent = null;
                            Player.weapon_mesh.position = Camera.position.add(new BABYLON.Vector3(-1, -1, 0));
                            var drop = Player.weapon_mesh;
                            setTimeout(function(){
                                drop.active = true;
                            },1000);
                        }
                        Player.weapon_mesh = obj.mesh;
                        Player.shells += 25;
                    }

                }else if(obj.type == "MSG" && obj.active == true){
                    obj.active = false;
                    New_MSG(ProxyMSG[obj.id]);
                }else if(obj.type == "Redirect" && obj.active == true){
                    obj.active = false;
                    window.location = ProxyURL[obj.id];
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
    camSensor.scaling = new BABYLON.Vector3(3, 4, 3);
    camSensor.position = Camera.position;
//    camSensor.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 5, friction: 0.5, restitution: 0 });
    //camSensor.parent = Camera;
}

//items

var Load_Item = function(item){
    this.active = true;
    this.mesh = item;
    this.name = item.name.split(".");
    this.type = this.name[1];
    if(this.type == "HealthPack"){
        this.dis = 5;
        //if it's a HealthPack
        HealthPack(this);
    }else if(this.type == "Redirect"){
        this.active = true;
        this.id = this.name[2];
        this.dis = 10;
    }else if(this.type == "MSG"){
        this.active = true;
        this.id = this.name[2];
        this.dis = 20;
    }else if(this.type == "Bullets"){
        this.mesh.active = true;
        this.dis = 5;
    }else if(this.type == "Weapon"){
        this.mesh.active = true;
        this.wtype = this.name[2];
        this.dis = 5;
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

//HTML Elements/HUD

var msg = [];
var msg_wait = 0;
setInterval(function(){
    if(msg.length > 0 && msg_wait == 0){
        msg.splice(0,1);
        var MSG = document.getElementById("MSG");
        MSG.innerHTML = "";
        for(var i = 0; i < msg.length;i++){
            MSG.innerHTML += "<br>" + msg[i]; 
        }
    }else{
        msg_wait = 0;
    }
},3000);

function New_MSG(message){
    var MSG_Sound = new Sound( [ "../../sounds/msg.wav" ] );
    MSG_Sound.play();
    msg_wait = 1;
    msg.push(message);
    MSG.innerHTML += "<br>" + message;
}

function Load_HUD(){
    //get body
    var html_body = document.getElementsByTagName('body')[0];
    
    //load canvas element
    var canvas = '<canvas id="renderCanvas"></canvas>';
    html_body.innerHTML += canvas;
    
    //basic html setup for game
    var HTML_HUD ='\
    <div id="hud" class="hud">\
        <div id="health" class="hud"></div>\
        <div id="bullets" class="hud"></div>\
        <div id="shells" class="hud"></div>\
        <div id="bugs" class="hud"></div>\
        <div id="fps" class="hud"></div>\
    </div>\
    \
    <div id="crosshairs"><img src="../../sprites/crosshairs/crosshair_1.png"></div>\
    '
    
    html_body.innerHTML += HTML_HUD;
    
    var BUGS = document.getElementById('bugs');
//    BUGS.innerHTML += "<br>";

    //Load Screen
    var HTML_LOAD ='<div id="load_screen" class="load_screen"><img src="Load_Screen.png" class="load_screen"></div>';//commented out until I figure out why loadscreen doesn't work in Windows 
//    var HTML_LOAD ='<div id="load_screen" class="load_screen"></div>';
    html_body.innerHTML += HTML_LOAD;

    var HTML_MSG = '<div id="MSG"></div>';
    html_body.innerHTML += HTML_MSG;
}

function Activate_HUD(){
                    document.title ="Metal Bullets";
                    document.getElementById("hud").style.visibility="visible";
                    document.getElementById("load_screen").style.visibility="hidden";
}


function call_sprite(img){
    var spriteManagerPlayer = new BABYLON.SpriteManager("Explosion", "../../sprites/explosions/Exp_type_B.png", 2, 192, Scene);
    var player = new BABYLON.Sprite("player", spriteManagerPlayer);
    player.position = Camera.position.add(new BABYLON.Vector3(10, 0, 10));
    player.playAnimation(0, 43, true, 100);
}

//////frame persecond for hud//////
var HUD_FPS_active = true;
function HUD_FPS(){
    var html = document.getElementById("fps");
    if(HUD_FPS_active == true){
        var fps = BABYLON.Tools.GetFps().toFixed() + " fps";
        html.innerHTML = fps;
    }else{
        html.innerHTML = "";
    }
        
}

///////cheats/////
var god_mode = false;
function GOD(){

    if(god_mode == false){
        god_mode = true;
        New_MSG("GOD MODE ENABLED!!!");
        return "GOD MODE ENABLED!!!";
    }else{
        god_mode = false;
        New_MSG("GOD MODE DISABLED!!!");
        return "GOD MODE DISABLED!!!";
    }

} 

function killall(){
    for(var i = 0;i < Enemies.length;i++){
        Enemies[i].death();
    }
}
//Respawn Player after death
function Respawn(){
    Player.health = 100;
    Player.dead = false;
    Scene.activeCamera.attachControl(canvas);
} 
////////layers///////////////////
////////display read layer when player is hit//////
var layer_timeout;
function Damage_Layer(){
    clearTimeout(layer_timeout);
    layer = document.getElementById("screen_layer");
    layer.style.visibility="visible";
    layer_timeout = setTimeout(function(){
        layer.style.visibility="hidden";
    },500);
}

function Dead_Layer(){
    layer = document.getElementById("screen_layer");
    layer.style.visibility="visible";
    layer.src = "../../sprites/screen_layers/red_dead.png";

}
