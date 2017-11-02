var GRID_SIZE = 16;

var color;
var i;
var width = GRID_SIZE * 0.2;
var height = GRID_SIZE * 1.5;
var diemention = GRID_SIZE;

var shininess = 50, specular = 0x333333;
var KICKS_COLOR = '#B793E6';

// THREE VARIABLES:
var camera, scene, light, renderer, container, center;
var meshs = [];
var boxGeometry, sphereGeometry;
var basicMaterial;

// OIMO VARIABLES:
var world;
var bodys = [];

/*-----------------

  CAKE CAKE CAKE
-------------------*/
var dataSet = [
  // 'A ','B ','C ','D ','E ','F ','G ','H ','I ','J ','K ','L ','M ','N ','O ','P ',
    'BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','BG','BG','OL','BG','BG','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','BG','OL','OL','OL','BG','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','OL','OL','SB','SB','OL','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','OL','CM','SB','SB','SB','WH','OL','BG','BG','BG',
    'BG','BG','BG','BG','OL','OL','WH','SB','SB','SB','LC','LC','WH','OL','BG','BG',
    'BG','BG','OL','OL','WH','WH','LC','LC','LC','LC','LC','WH','WH','OL','BG','BG',
    'BG','OL','WH','WH','WH','WH','WH','WH','WH','WH','WH','WH','WH','OL','BG','BG',
    'BG','OL','JM','JM','JM','JM','JM','JM','JM','JM','JM','JM','JM','OL','BG','BG',
    'BG','OL','CM','CM','CM','CM','CM','CM','CM','CM','CM','WH','WH','OL','BG','BG',
    'BG','OL','JM','JM','JM','JM','JM','JM','LC','LC','LC','LC','LC','OL','BG','BG',
    'BG','OL','LC','CM','CM','CM','CM','CM','CM','CM','CM','CM','CM','OL','BG','BG',
    'BG','OL','OL','OL','OL','OL','OL','OL','OL','OL','OL','OL','OL','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG',
    'BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG','BG',
];

function getRgbColor(colorType) {
  var colors = {
    'BG':'#BBBBBB', // cardbord color
    'WH':'#FFFFFF', // white
    'OL':'#781214', // OUTLINE
    'SB':'#E81D25', // STRAWBERRY
    'CM':'#F7AAAC', // PINK-CREAM
    'JM':'#F15753', // JAM
    'LC':'#FCDEDE', // LIGHT-CREAM
  };
  return colors[colorType];
}

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    clearColor: 0x585858,
    clearAlpha: 0
  });

  renderer.setClearColor(0x000, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 300, 50);

  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x383838 ) );

  light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(100.3, 100, 0.5);
  scene.add(light);

  var controls = new THREE.OrbitControls( camera );
  controls.target.set( 0, 2, 0 );
  controls.update();

  // GROUND
  var groundMaterial = new THREE.MeshToonMaterial( {
    color: 0x151515,
    specular: 1,
    reflectivity: 1,
    shininess: 1,
  } );

  var groundGeometry = new THREE.CubeGeometry(800, 10, 850);
  var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.position.y = -50;
  scene.add(groundMesh);

  sphereGeometry = new THREE.SphereGeometry(1, 20, 10);
  boxGeometry = new THREE.CubeGeometry(1, 1, 1);
  basicMaterial = new THREE.MeshLambertMaterial({ color: 0x151515 });

  // oimo init
  world = new OIMO.World();
  createObjects();

  window.addEventListener('resize', onWindowResize, false);
}

function createObjects() {
  clearMesh();
  world.clear();

  // GROUND
  var ground2 = new OIMO.Body({
    size: [400, 40, 400],
    pos: [0, -50, 0],
    world: world
  });

  createTiles();
  createKicks();
}

function createTiles() {
  for (var col = 0; col < 16; col++) {
    for (var row = 0; row < 16; row++) {
      i = col + (row) * 16;
      color = getRgbColor(dataSet[i]);
      bodys[i] = new OIMO.Body({
        type: 'box',
        size: [width, height, diemention],
        pos: [-120 + col * GRID_SIZE, 0 * GRID_SIZE, -120 + row * GRID_SIZE * 1.2],
        move: true,
        world: world
      });
      
      var material = new THREE.MeshToonMaterial( {
        color: color,
        specular: 1,
        reflectivity: 1,
        shininess: 1,
      } );
      meshs[i] = new THREE.Mesh(boxGeometry, material);
      meshs[i].scale.set(width, height, diemention);

      scene.add(meshs[i]);
    }
  }
}

function createKicks() {
  var size = bodys.length;
  for (i = 0; i < 16; i++) {
    width = GRID_SIZE;
    height = GRID_SIZE;
    diemention = GRID_SIZE;
    x = 0;
    y = 2;
    z = i;

    bodys[size + i] = new OIMO.Body({
      type: 'box',
      size: [width, height, diemention],
      pos: [-125 - x * GRID_SIZE, y * GRID_SIZE, -120 + z * GRID_SIZE * 1.2],
      move: true,
      world: world
    });

    var material = new THREE.MeshToonMaterial( {
      color: KICKS_COLOR,
      specular: 1,
      reflectivity: 1,
      shininess
    } );

    meshs[size + i] = new THREE.Mesh(sphereGeometry, material);
    meshs[size + i].scale.set(width, height, diemention);

    scene.add(meshs[size + i]);
  }
}

function clearMesh() {
  var i = meshs.length;
  while (i--) {
    scene.remove(meshs[i]);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    world.step();
    var mtx = new THREE.Matrix4();
    var i = bodys.length;
    var mesh;

    while (i--) {
      var body = bodys[i].body;
      mesh = meshs[i];
      m = body.getMatrix();
      mtx.fromArray(m);
      mesh.position.setFromMatrixPosition(mtx);
      mesh.rotation.setFromRotationMatrix(mtx);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
animate();
