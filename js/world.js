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
}

function create_sky_color(size, color){

        var skyBoxGeometry = new THREE.CubeGeometry( size, size, size );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: color, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        scene.add(skyBox);

}
