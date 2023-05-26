import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { Scene } from "three";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import countries from "./files/globe-data-min.json";
import micro1 from "./files/micro1-client.json";
import micro1_connections from "./files/micro1-connections.json";

Object.assign(THREE, { TrackballControls, CSS2DRenderer });

var renderer, camera, scene, tbControls;
var Globe;

init();
initGlobe();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  const globeDiv = document.getElementById("micro1-globe");
  globeDiv.style.position = "relative";
  // get the width and height of the div
  // const globeWidth = globeDiv.clientWidth;
  // const globeHeight = globeDiv.clientHeight;
  const globeWidth = globeDiv.clientWidth;
  const globeHeight = globeDiv.clientHeight;
  // Initialize renderer
  renderer = [
    new THREE.WebGLRenderer({ antialias: true, alpha: true }),
    new THREE.CSS2DRenderer(),
  ];
  renderer.forEach((r, idx) => {
    r.setSize(globeWidth, globeHeight);
    if (idx > 0) {
      // overlay additional on top of main renderer
      r.domElement.style.position = "absolute";
      r.domElement.style.top = "0px";
      r.domElement.style.pointerEvents = "none";
    }
    globeDiv.appendChild(r.domElement);
  });

  // Initialize scene, light
  scene = new Scene();
  scene.add(new AmbientLight(0xd6ddff, 1));
  scene.background = null;

  // Initialize camera, light
  camera = new PerspectiveCamera();
  camera.aspect = globeWidth / globeHeight;
  camera.updateProjectionMatrix();

  // fit camera position z to the globe
  const distance = 300;
  const scale = Globe ? Globe.scale() : 1;
  camera.position.z = distance / scale;

  var dLight = new DirectionalLight(0x000000, 0.1);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  scene.add(camera);

  // Initialize controls
  tbControls = new THREE.TrackballControls(camera, renderer[0].domElement);
  tbControls.minDistance = 101;
  tbControls.rotateSpeed = 5;
  tbControls.zoomSpeed = 0.8;
  // disable zoom
  tbControls.noZoom = true;
}

// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.2)
    .showAtmosphere(true)
    .atmosphereColor("#EAEBFF")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      return "rgba(5, 0, 255, 0.15)"
    })
    .htmlElementsData(micro1)
    .htmlElement((d) => {
      const el = document.createElement("div")
      el.innerHTML = `
      <img src="${d.image}" alt="" width="30px" height="30px" style="border-radius: 50%; border: 2px solid #fff" />
    `
      return el
    })

  // NOTE Arc animations are followed after the globe enters the scene
  setTimeout(() => {
    Globe.arcsData(micro1_connections)
      .arcColor((e) => {
        return "#986CF5";
      })
      .arcAltitude((e) => {
        return 0.3;
      })
      .arcStroke((e) => {
        return 0.5;
      })
      .arcDashLength(1)
      .arcDashGap(1)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap(1);

    Globe.setPointOfView(camera.position, Globe.position);
    // Update pov when camera moves
    tbControls.addEventListener("change", () =>
      Globe.setPointOfView(camera.position, Globe.position)
    );
  }, 1000);

  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new Color(0xffffff);
  globeMaterial.emissive = new Color(0xe8ecfe);
  globeMaterial.emissiveIntensity = 0.05;
  globeMaterial.shininess = 0;

  // NOTE Cool stuff
  // globeMaterial.wireframe = true;
  scene.add(Globe);
}

function animate() {
  tbControls.update();
  renderer.forEach((r) => {
    r.render(scene, camera);
  });
  requestAnimationFrame(animate);
}
