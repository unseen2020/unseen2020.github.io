// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

//add material name here first
let newMaterial, Standard, newStandard;

// initialize texture array
var texturesArray = [];

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  createCamera();
  createControls();
  createLights();
  createMaterials();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 5, container.clientWidth / container.clientHeight, 0.1, 100 );
  camera.position.set( -5, 0, 65);

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xddeeff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}

function createMaterials(){

     let diffuseColor = new THREE.TextureLoader().load( "textures/Skin_Human_002_COLOR.png");
     let texture1 = new THREE.TextureLoader().load("textures/texture1.jpeg");
     let texture2 = new THREE.TextureLoader().load("textures/texture2.jpg");
     newMaterial = new THREE.MeshStandardMaterial( { color: "#3b5998", skinning: true} );
     Standard = new THREE.MeshStandardMaterial( { color: "#3b5998", skinning: true} );

     const dspTexture = new THREE.TextureLoader().load( "textures/Skin_Human_002_DISP.png" );
     				dspTexture.wrapS = dspTexture.wrapT = THREE.RepeatWrapping;
     				dspTexture.anisotropy = 16;

     const bumpTexture = new THREE.TextureLoader().load( "textures/Skin_Human_002_SPEC.png" );
            bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.anisotropy = 16;

     const imgTexture = new THREE.TextureLoader().load( "textures/Skin_Human_002_NRM.png" );
            imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
            imgTexture.anisotropy = 16;

     var white = new THREE.Color(1, 1, 1);

     newStandard = new THREE.MeshStandardMaterial( {
										// map: diffuseColor,
										// bumpMap: bumpTexture,
										// bumpScale: 1,
                    // // normalMap: imgTexture,
										// // color: diffuseColor,
										// metalness: 0,
										// roughness: 1.0,
										// envMap: imgTexture,
                    // displacementMap: dspTexture,
                    // displacementScale: 0.1,
                    // skinning: true

                    map: diffuseColor,
										bumpMap: bumpTexture,
										bumpScale: 1.0,
                    // normalMap: imgTexture,
										color: white,
										metalness: 0.5,
										roughness: 1.0,
										envMap: diffuseColor,
                    displacementMap: dspTexture,
                    displacementScale: 0.0,
                    skinning: true
									} );

      // add textures to texture array
      texturesArray.push(diffuseColor);
      texturesArray.push(texture1);
      texturesArray.push(texture2);
}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad1 = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

    model.rotation.z = 1.0;

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  const onLoad2 = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  const onLoad3 = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

    model.rotation.z = -1.0;

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( 0, 0, 0 );
  loader.load( 'models/woman_face_study/scene.gltf', gltf => onLoad2( gltf, parrotPosition, newStandard), onProgress, onError );

  const flamingoPosition = new THREE.Vector3( 2, 0, -2 );
  loader.load( 'models/woman_face_study/scene.gltf', gltf => onLoad1( gltf, flamingoPosition, newMaterial ), onProgress, onError );

  const storkPosition = new THREE.Vector3( -2, 0, -2 );
  loader.load( 'models/woman_face_study/scene.gltf', gltf => onLoad3( gltf, storkPosition, Standard ), onProgress, onError );

}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // renderer.gammaFactor = 2.2;
  // renderer.gammaOutput = true;

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

function render() {

  //console.log(camera.position);

  renderer.render( scene, camera );

  // can change values of parameters of materials here
  newStandard.displacementScale += 0.0001;
  newStandard.color.r -= 0.0002;
  newStandard.color.g -= 0.0002;
  newStandard.color.b -= 0.0002;
  // for loop to go thru texture array here
  // for (let i = 0; i < texturesArray.length; i++) {
    // newStandard.map = texturesArray[i];
    // newStandard.envMap = texturesArray[i];
  // }
}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
