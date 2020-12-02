// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let object, object1, object2;
let meshs;
let guiControls;

let video;

//add material name here first
let newMaterial, Standard, newStandard, pointsMaterial;

let SkyboxTexture, SkyboxMaterial, refractorySkybox;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();

  video = document.getElementById( 'video' );
  console.log(video);
  //raycaster = new THREE.Raycaster();
  //mouse = new THREE.Vector2();
 //scene.background = new THREE.Color( 0x8FBCD4 );
  guiControls = new function() {
    this.rotationX = 0.01;
    this.rotationY = 0.01;
    this.rotationZ = 0.01;
  };

  var gui = new dat.GUI();
  gui.add(guiControls, 'rotationX', 0, 1.0 );
  gui.add(guiControls, 'rotationY', 0, 1.0 );
  gui.add(guiControls, 'rotationZ', 0, 1.0 );


  createSkybox();
  getWebcam();
  //manualSkyBox();
  createCamera();
  createControls();
  createLights();
  createMaterials();

  loadModels();
  gettheObject();
  createRenderer();


  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createSkybox(){


SkyboxTexture = new THREE.CubeTextureLoader()
  					.setPath( 'textures/' )
  					.load( [ 'waterSquare.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg' ] );
//SkyboxTexture.encoding = THREE.sRGBEncoding;
SkyboxTexture.mapping = THREE.CubeRefractionMapping;
//other mappings to try:
/*
THREE.UVMapping
THREE.CubeReflectionMapping
THREE.CubeRefractionMapping
THREE.EquirectangularReflectionMapping
THREE.EquirectangularRefractionMapping
THREE.CubeUVReflectionMapping
THREE.CubeUVRefractionMapping
*/


scene.background = SkyboxTexture;

}


function manualSkyBox() {

  var textureLoader = new THREE.TextureLoader();

var texture0 = textureLoader.load( 'textures/waterSquare.jpg' );
var texture1 = textureLoader.load( 'textures/dark-s_px.jpg' );
var texture2 = textureLoader.load( 'textures/dark-s_nx.jpg' );
var texture3 = textureLoader.load( 'textures/dark-s_ny.jpg' );
var texture4 = textureLoader.load( 'textures/dark-s_nz.jpg' );
var texture5 = textureLoader.load( 'textures/dark-s_ny.jpg' );




var materials = [
    new THREE.MeshBasicMaterial( { map: VideoTexture } ),
    new THREE.MeshBasicMaterial( { map: VideoTexture } ),
    new THREE.MeshBasicMaterial( { map: VideoTexture } ),
    new THREE.MeshBasicMaterial( { map: VideoTexture } ),
    new THREE.MeshBasicMaterial( { map: VideoTexture } ),
    new THREE.MeshBasicMaterial( { map: texture5 } )
];

  var faceMaterial = new THREE.MeshFaceMaterial( materials );

  faceMaterial.side = THREE.DoubleSide;
  var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
  var ManualSkyBox = new THREE.Mesh( geometry, faceMaterial );
  ManualSkyBox.scale.set(1000, 1000, 1000);
  scene.add( ManualSkyBox );


  //Extra Cube for testing Materials Intersection
  const geometry1 = new THREE.BoxBufferGeometry( 10, 10, 10 );
  const material1 = new THREE.MeshBasicMaterial( {color: 0x9E4300} );
  const cube1 = new THREE.Mesh( geometry1, material1 );
  scene.add( cube1 );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 15, 44, 65);

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  const directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.set( 1, - 0.5, - 1 );
				scene.add( directionalLight );


  scene.add( ambientLight, mainLight, directionalLight );

}

function createMaterials(){

     let diffuseColor = "#9E4300";
     newMaterial = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
     Standard = new THREE.MeshStandardMaterial( { color: "#9E4300", skinning: true} );

     const loadTexture = new THREE.TextureLoader();
     const RainbowTexture = loadTexture.load("textures/SupernumeraryRainbows_Entwistle_1362.jpg");

     // set the "color space" of the texture
     RainbowTexture.encoding = THREE.sRGBEncoding;

       // reduce blurring at glancing angles
     RainbowTexture.anisotropy = 16;
     RainbowTexture.wrapS = RainbowTexture.wrapT = THREE.RepeatWrapping;

     const imgTexture = new THREE.TextureLoader().load( "textures/water.JPG" );
     				imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
     				imgTexture.anisotropy = 16;


    const videotext = new THREE.VideoTexture( video );


   SkyboxMaterial = new THREE.MeshBasicMaterial( {
                  map: videotext,
                  //envMap: scene.background,
                  refractionRatio: 0.8 } );


   newStandard = new THREE.MeshPhongMaterial( {
										map: RainbowTexture,
										//bumpMap: imgTexture,
										//bumpScale: 1,
										//color: diffuseColor,
										//metalness: 0.5,
										//roughness: 0.1,
										envMap: SkyboxTexture,
                    //displacementMap: imgTexture,
                    //displacementScale: 1,
                    refractionRatio: 0.98,
                    reflectivity: 0.9,
                    specular: 0x222222,
					          //shininess: 100,
                    skinning: true
									} );



   refractorySkybox = new THREE.MeshPhongMaterial( {
										//map: imgTexture,
										//bumpMap: imgTexture,
										//bumpScale: 1,
										//color: diffuseColor,
										//metalness: 0.5,
										//roughness: 0.1,
										envMap: SkyboxTexture,
                    //displacementMap: imgTexture,
                    //displacementScale: 1,
                    refractionRatio: 0.98,
                    reflectivity: 0.9,
                    //specular: 0x222222,
					          //shininess: 100,
                    skinning: true
									} );

    pointsMaterial = new THREE.PointsMaterial( {
      color: diffuseColor,
      sizeAttenuation: true,
      size: 0.1
    } );



}

function getWebcam(){

  if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

					const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

					navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

						// apply the stream to the video element used in the texture

						video.srcObject = stream;
						video.play();

					} ).catch( function ( error ) {

						console.error( 'Unable to access the camera/webcam.', error );

					} );

				} else {

					console.error( 'MediaDevices interface not available.' );

				}

			}



function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  //function onLoad() {}

  const onLoad = ( gltf, position, material, name) => {

  let object = gltf.scene;
    //stand in material for now
    //var material = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );

    object.traverse((child) => {
                       if (child.isMesh) {
                      child.material = material;
                      child.position.copy( position );
                      child.name = name;

                  }
                 });

                 scene.add(object);


  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const Position2 = new THREE.Vector3( -40,0,0 );
  loader.load( 'models/Amythest_export3_movedorigin.glb', gltf => onLoad( gltf, Position2, newStandard, "MeshName"), onProgress, onError );

  const Position3 = new THREE.Vector3( 0,0, 0 );
  loader.load( 'models/Amythest_export3_movedorigin.glb', gltf => onLoad( gltf, Position3, SkyboxMaterial, "MeshName1"), onProgress, onError );

  const Position4 = new THREE.Vector3( 40,0, 0 );
  loader.load( 'models/Amythest_export3_movedorigin.glb', gltf => onLoad( gltf, Position4, refractorySkybox, "MeshName2"), onProgress, onError );


}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;



  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  // /*for ( const mixer of mixers ) {
  //
  //   mixer.update( delta );
  // }
  // */

}

function gettheObject(){

   object = scene.getObjectByName("MeshName2"); // this is not the most efficient way
  // console.log(object);
   object1 = scene.getObjectByName("MeshName1");
  //console.log(object1);
   object2 = scene.getObjectByName("MeshName");


}


function render() {

  // update the picking ray with the camera and mouse position
 //  raycaster.setFromCamera( mouse, camera );

object = scene.getObjectByName("MeshName");
object1 = scene.getObjectByName("MeshName2");



 //console.log(object2);
 //object.rotation.y += 0.01; //break
//console.log(object2);

if(object) { //to get past our "undefined error"
  if (object.isMesh){
    object.rotation.y += guiControls.rotationX;
    object.rotation.x += guiControls.rotationY;

 }
}

if(object1) { //to get past our "undefined error"
  if (object1.isMesh){
    object1.rotation.y += guiControls.rotationX;
    object1.rotation.x += guiControls.rotationY;

 }
}



console.log(guiControls.rotationX);


  renderer.render( scene, camera );

}

function onMouseMove( event ) {  
  // calculate mouse position in normalized device coordinates 
  // (-1 to +1) for both components  
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  } 


function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );
window.addEventListener('mousemove', onMouseMove, false);

window.requestAnimationFrame(render);

init();
