// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let head;
let guiControls;
let cube, geometry1, material1;

let video, videoColor, videoTexture, canvas, context;

let microaggressions = ["Trigger Warning: This piece is a commentary on racial trauma.", "Sir, this line is for first class only.", "You’re so pretty for a Black girl.", "Oh, are you here on a sports scholarship? What do you play?", "* followed while shopping *", "Can I touch your hair?", "I don't see color. There is only one race, the human race.",
                      "You're so well-spoken!", "Can you make your hair more professional?", "* being the token Black person *", "I’m not racist. I have several Black friends.", "* clutching their purse tighter as you walk by *", "* mistaken as service worker *"];
let counter = 0;
let darkCounter = 0;

//add material name here first
let newMaterial, Standard, newStandard;

let group, textMesh1, textMesh2, textGeo, materials;

let firstLetter = true;

let text = "three.js",

	  bevelEnabled = true,

		font = undefined,

		fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
		fontWeight = "bold"; // normal bold

const height = 20,
		size = 70,
		hover = 30,

		curveSegments = 4,

		bevelThickness = 2,
		bevelSize = 1.5;

const fontMap = {

    "helvetiker": 0,
    "optimer": 1,
    "gentilis": 2,
    "droid/droid_sans": 3,
    "droid/droid_serif": 4

};

const weightMap = {

		"regular": 0,
		"bold": 1

};

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );
  canvas = document.querySelector('#canvas');
  context = canvas.getContext('2d');

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xFFFFFF );

  let fontIndex = 1;

  group = new THREE.Group();
  group.position.y = 100;

  scene.add( group );

  // loadFont();
  // createText();

  video = document.querySelector( '#video' );
  // console.log("video: " + video);
	videoTexture = new THREE.VideoTexture( video );
  // console.log("texture: " + videoTexture);
  material = new THREE.MeshStandardMaterial( { map: videoTexture } )
  // console.log("material: " + material);

  // geometry1 = new THREE.BoxBufferGeometry( 2, 2, 2 );
  // material1 = new THREE.MeshBasicMaterial( {color: 0x9E4300} );
  // cube = new THREE.Mesh( geometry1, material1 );
  // scene.add( cube );

  guiControls = new function() {
    // this.rotationX = 0.01;
    this.rotationY = 0.01;
    // this.rotationZ = 0.01;
  };

  var gui = new dat.GUI();
  // gui.add(guiControls, 'rotationX', 0, 1.0);
  gui.add(guiControls, 'rotationY', 0, 1.0);
  // gui.add(guiControls, 'rotationZ', 0, 1.0);

  getWebcam();

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
                    map: videoTexture,
										bumpMap: bumpTexture,
										bumpScale: 1.0,
                    // normalMap: imgTexture,
										color: white,
										// metalness: 0.5,
										// roughness: 1.0,
										envMap: diffuseColor,
                    displacementMap: videoTexture,
                    displacementScale: 0.0,
                    skinning: true
									} );
}

function getWebcam(){
  if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
			const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
			navigator.mediaDevices.getUserMedia( {video: true} ).then( function ( stream ) {
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

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    // console.log("rgb: " + rgb);
    return rgb;

}


function loadFont() {

				const loader = new THREE.FontLoader();
				loader.load( 'js/three.js-master/examples/fonts/optimer_bold.typeface.json', function ( font ) {

          var textGeo = new THREE.TextGeometry( "My Text", {

              font: font,

              size: 40,
              height: 10,
              curveSegments: 12,

              bevelThickness: 2,
              bevelSize: 5,
              bevelEnabled: true

          } );

          var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

          var mesh = new THREE.Mesh( textGeo, textMaterial );
          mesh.position.set( 0, 0, 0);

          scene.add( mesh );

				} );

}

			function createText() {

				textGeo = new THREE.TextGeometry( text, {

					font: font,

					size: size,
					height: height,
					curveSegments: curveSegments,

					bevelThickness: bevelThickness,
					bevelSize: bevelSize,
					bevelEnabled: bevelEnabled

				} );

				textGeo.computeBoundingBox();
				textGeo.computeVertexNormals();

				const triangle = new THREE.Triangle();

				// "fix" side normals by removing z-component of normals for side faces
				// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

				if ( ! bevelEnabled ) {

					const triangleAreaHeuristics = 0.1 * ( height * size );

					for ( let i = 0; i < textGeo.faces.length; i ++ ) {

						const face = textGeo.faces[ i ];

						if ( face.materialIndex == 1 ) {

							for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

								face.vertexNormals[ j ].z = 0;
								face.vertexNormals[ j ].normalize();

							}

							const va = textGeo.vertices[ face.a ];
							const vb = textGeo.vertices[ face.b ];
							const vc = textGeo.vertices[ face.c ];

							const s = triangle.set( va, vb, vc ).getArea();

							if ( s > triangleAreaHeuristics ) {

								for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

									face.vertexNormals[ j ].copy( face.normal );

								}

							}

						}

					}

				}

				const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

				textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );

				textMesh1 = new THREE.Mesh( textGeo, materials );

				textMesh1.position.x = centerOffset;
				textMesh1.position.y = hover;
				textMesh1.position.z = 0;

				textMesh1.rotation.x = 0;
				textMesh1.rotation.y = Math.PI * 2;

				group.add( textMesh1 );

			}


function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad1 = ( gltf, position, material, name ) => {

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
    object.name = name;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                       // child.name = name;
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  const onLoad2 = ( gltf, position, material, name ) => {

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
    object.name = name;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                       // child.name = name;
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  const onLoad3 = ( gltf, position, material, name ) => {

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
    object.name = name;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                       // child.name = name;
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
  loader.load( 'models/woman_face_study/scene.gltf', gltf => onLoad2( gltf, parrotPosition, newStandard, "MeshName"), onProgress, onError );

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

function gettheObject() {
  // head = scene.getObjectByName("MeshName");
  // console.log(scene);
  // console.log(head);
}

function render() {
  // await loadModels();

  newStandard.displacementScale.needsUpdate = true;
  // console.log(camera.position);

  head = scene.getObjectByName("MeshName");

  if (head) { //to get past our "undefined error"
      // head.rotation.x += guiControls.rotationX;
      head.rotation.y += guiControls.rotationY;
      // head.rotation.z += guiControls.rotationZ;
  }

  // cube.rotation.x += guiControls.rotationX;
  // cube.rotation.y += guiControls.rotationY;
  // cube.rotation.z += guiControls.rotationZ;

  videoColor = getAverageRGB(video);
  // console.log("video color: " + videoColor);

  var r = videoColor.r;
  var g = videoColor.g;
  var b = videoColor.b;

  console.log("r: " + r + ", g: " + g + ", b: "+ b);

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  console.log(luma);

  if (luma < 40) {
    // console.log("dark");
    newStandard.displacementScale += 0.01;
    if (darkCounter%200 == 0) {
      window.alert(microaggressions[counter]);
      if (counter < 12) {
        counter++;
      } else {
        counter = 1;
      }
    }
    darkCounter++;
  }
  else {
    // console.log("light");
    if (newStandard.displacementScale > 0.0) {
      newStandard.displacementScale -= 0.01;
    }
  }

  renderer.render( scene, camera );

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
