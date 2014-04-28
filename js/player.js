document.addEventListener('mousemove', onMouseMove, false); 

function create_camera()
{
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(0,20,1000);
//        camera.lookAt(scene.position);  

}

function camera_control()

{
        moveDistance = speed * clock.getDelta();
        player_gravity();
        
        keyboard.update();
//        console.log(clock.getDelta());

        if ( keyboard.pressed("W") ){
                camera.translateZ( -moveDistance );
                walk();
        }

        if ( keyboard.pressed("S") ){
                camera.translateZ(  moveDistance );
                walk();
        }

        if ( keyboard.pressed("A") )
                camera.translateX( -moveDistance );

        if ( keyboard.pressed("D") )
                camera.translateX( moveDistance );

        if ( keyboard.pressed("left") )
                camera.rotation.y += .05;

        if ( keyboard.pressed("right") )
                camera.rotation.y -= .05;

        if ( keyboard.pressed("M") )
                music.pause();
        //jump
        if ( keyboard.pressed("space") && player_jump == 'false'){  
            player_jump = 'true';
            jump();
        }
        //


        if ( keyboard.down("R") )
                mesh.material.color = new THREE.Color(0xff0000);
        if ( keyboard.up("R") )
                mesh.material.color = new THREE.Color(0x0000ff);


        player_check_collision();
        //Limit Level Size
/*
        limits = 1000;
        if ( camera.position.x > limits ){
            camera.position.x = limits;
        }
        else if ( camera.position.x < -limits )
        {
            camera.position.x = -limits;
        }
        else if ( camera.position.z > limits )
        {
            camera.position.z = limits;
        }
        else if(camera.position.z < -limits)
        {
            camera.position.z = -limits;
        }
        //
*/
}

function player_gravity(){
        //console.log("check");
        //keep camera above floor

        if (camera.position.y < floor)
        {
            camera.position.y = floor;
            player_jump='false';
        }

}

function jump(){
                player_jump_audio.play();
                Jump = new TWEEN.Tween({y: camera.position.y})
                    .to({ y: jump_height}, 500)
                    .onUpdate( function(){
                        //console.log(this.y);
                        camera.position.y=this.y;
                    });

                finishJump = new TWEEN.Tween({y: jump_height})
                    .to({ y: floor - .01}, 500)
                    .onUpdate( function(){
                        //console.log(this.y);
                        camera.position.y=this.y;
    
                    });

                Jump.chain(finishJump);
            
                Jump.start();


}

function walk(){
                check_distance();
                //player_walk_audio.play();
                Walk_Down = new TWEEN.Tween({bottom: gun_height})
                    .to({ bottom: gun_height - 10}, 400)
//                    .easing(TWEEN.Easing.Back.InOut)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate( function(){
                        //console.log(this.bottom);
                        gun.position.set( 0, this.bottom, 1 );
                        bobx = this.bottom;
                    });

                Walk_Up = new TWEEN.Tween({bottom: gun_height - 10})
                    .to({ bottom: gun_height }, 400)
//                    .easing(TWEEN.Easing.Back.InOut)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate( function(){
                        //console.log(this.bottom);
                        gun.position.set( 0, this.bottom, 1 );
                        bobx = this.bottom;
                    });

//                Walk_Right.chain(Walk_Left);
//                Walk_Right.start();

                Walk_Down.chain(Walk_Up);
            if (bobx == gun_height){
                Walk_Down.start();
            }
}

function player_check_collision()
{
    var obj, i;
    for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
        obj = scene.children[ i ];
        //scene.remove(obj);
        if(obj.name.indexOf("KRIS") > -1){
//            var xcol = (obj.geometry.boundingSphere.radius / 2) + obj.position.x;
            var xcol = obj.geometry.boundingSphere.radius;
            
            if(camera.position.x < xcol){
                console.log("hit");
                console.log(camera.position.x);
                console.log(obj.position.y)
            }
        }
    }
}
        var onMouseMove = function ( event ) {

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                camera.rotation.y -= movementX * 0.002;
//                pitchObject.rotation.x -= movementY * 0.002;

//                pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

        };

