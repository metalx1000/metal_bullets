hud = new THREE.Scene();

hudcamera = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
hudcamera.position.z = 10;

$(document).bind("contextmenu",function(e){
    return false;
});

$(document).mousedown(function(event) {
    if (event.which == 3 && player_jump == 'false') {
            player_jump = 'true';
            jump();
    }else if (event.which == 1){
        gun_bang();
        return false;//This prevents high lighting html Elements when clicking and dragging
    }
});


function create_renderer(div)
{
        if ( Detector.webgl )
                renderer = new THREE.WebGLRenderer( {antialias:true} );
        else
                renderer = new THREE.CanvasRenderer(); 
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container = document.getElementById( div );
        container.appendChild( renderer.domElement );

}

function create_grid(size, step, color){

//                var size = 300, step = 10;

                var geometry = new THREE.Geometry();
                var grid_mat = new THREE.LineBasicMaterial({color: color});   

                for ( var i = - size; i <= size; i += step){
                    geometry.vertices.push(new THREE.Vector3( - size, - 0.04, i ));
                    geometry.vertices.push(new THREE.Vector3( size, - 0.04, i ));
   
                    geometry.vertices.push(new THREE.Vector3( i, - 0.04, - size ));
                    geometry.vertices.push(new THREE.Vector3( i, - 0.04, size ));

                }

                var line = new THREE.Line( geometry, grid_mat, THREE.LinePieces);
                scene.add(line);

}

function create_sky(size,dir,ext){
    console.log("Loading Sky...");
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/posx.' + ext ) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/negx.' + ext ) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/posy.' + ext ) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/negy.' + ext ) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/posz.' + ext ) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( dir + '/negz.' + ext ) }));
    for (var i = 0; i < 6; i++)
       materialArray[i].side = THREE.BackSide;
    var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
    
    var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
    
    var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
    scene.add( skybox );    

    console.log("Sky Loaded!");
}

function create_sky_color(size, color){

        var skyBoxGeometry = new THREE.CubeGeometry( size, size, size );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        scene.add(skyBox);

}

function load_music(src){
    music = document.createElement('audio');
    music.loop="loop";
    music.autoplay="autoplay";
    music.controls="none";
    document.getElementsByTagName('body')[0].appendChild(music);        

    music_source = document.createElement('source');
    music_source.src = src;
    document.getElementsByTagName('audio')[0].appendChild(music_source);
}

function list_scene_objects(){
    var obj, i;
    for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
        obj = scene.children[ i ];
        //scene.remove(obj);
        if(obj.name.indexOf(".Music") > -1){
//        if(obj.name == "MainDoor"){
            console.log(camera.matrix.elements);
            console.log(obj);
        }
    }   
}

function check_distance(){
   var obj, i, dis;

   for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
       obj = scene.children[ i ];
       
       //Door Opens down
       if (obj.name.indexOf("Door") != -1){
           dis = camera.position.distanceToSquared(obj.position);
           if ( dis < 20 ){
//               console.log("Door Opening");
               open_door(obj);
           }
      }

   }
}

function open_door(obj){
    if(obj.lock != "1"){
        obj.lock = "1";
        obj.orgPosY = obj.position.y;
        door_sound = new Sound( [ '../../sounds/doors/door.wav' ], 275, 1 );
        door_sound.position.copy( obj.position );

        //console.log("Door Open.");
            if (obj.name.indexOf("Down") != -1){
                    door_sound.play();
                    //console.log("Down");
                    Open = new TWEEN.Tween({y: obj.position.y})
                    .to({ y: obj.position.y - obj.scale.y * 4}, 1000)
                    .onUpdate( function(){
                        //console.log(this.y);
                        obj.position.y=this.y;
                    });
                    Open.start(); 
            }
        setTimeout(function(){
            //console.log("Door Close.");
            obj.lock = "0";

            if (obj.name.indexOf("Down") != -1){
                    door_sound.play();
                    //console.log("Up");
                    Close = new TWEEN.Tween({y: obj.position.y})
                    .to({ y: obj.orgPosY}, 1000)
                    .onUpdate( function(){
                        //console.log(this.y);
                        obj.position.y=this.y;
                    });
                    Close.start();
            }

        },5000);
    }
}


            var Sound = function ( sources, radius, volume ) {

                var audio = document.createElement( 'audio' );

                for ( var i = 0; i < sources.length; i ++ ) {

                    var source = document.createElement( 'source' );
                    source.src = sources[ i ];

                    audio.appendChild( source );

                }

                this.position = new THREE.Vector3();

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
