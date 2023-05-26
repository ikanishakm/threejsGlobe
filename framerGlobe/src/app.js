import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
import earthImg from './images/blue.jpg'
import ThreeGlobe from 'three-globe'
import countries from './files/globe-data-min.json'
import micro1 from './files/micro1-client.json'
import micro1_connections from './files/micro1-connections.json'

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'

// Object.assign(THREE, { TrackballControls, CSS2DRenderer })

const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  let params = {
    color: '#BBDAFF',
    color3: '#561BFF',

    color2: '#1819FF',
  }
  const atmcolor = gui.addFolder('atmosphercolor')
  atmcolor.addColor(params, 'color').onChange(function () {
    params.color
  })

  const { width, height } = useRenderSize()
  const dirLight = new THREE.DirectionalLight('#ffffff', 0.75)
  dirLight.position.set(1, 1, 1)
  const ambientLight = new THREE.AmbientLight('0xffffff', 0.25)
  scene.add(dirLight, ambientLight)

  const myGlobe = new ThreeGlobe({
    waitForGlobeReady: true,
  })
    .globeImageUrl(earthImg)
    .arcsData(micro1_connections)
    .hexPolygonsData(countries.features)
    .arcColor((e) => {
      return '#986CF5'
    })
    .arcStroke((e) => {
      return 0.8
    })
    .atmosphereColor(new THREE.Color(params.color))
    .atmosphereAltitude(0.2)
    .arcDashLength(0.4)
    .arcDashGap(4)
    .arcDashInitialGap(() => Math.random() * 5)
    .arcDashAnimateTime(1000)
    .hexPolygonColor(() => `rgba(255,255,255,0.2)`)
    .labelsData(micro1.image)
    .htmlElementsData(micro1)
    .htmlElement((d) => {
      const el = document.createElement('div')
      el.innerHTML = `
      <img src="${d.image}" alt="" width="30px" height="30px" style="border-radius: 50%; border: 2px solid #fff" />
    `
      return el
    })

  const renderers = [new THREE.WebGLRenderer(), new CSS2DRenderer()]
  renderers.forEach((r, idx) => {
    r.setSize(window.innerWidth, window.innerHeight)
    if (idx > 0) {
      // overlay additional on top of main renderer
      r.domElement.style.position = 'absolute'
      r.domElement.style.top = '0px'
      r.domElement.style.pointerEvents = 'none'
    }
    document.getElementById('root').appendChild(r.domElement)
  })

  scene.add(myGlobe)
  // GUI
  // const cameraFolder = gui.addFolder('Camera')
  // cameraFolder.add(camera.position, 'z', 0, 150)
  // cameraFolder.open()

  const tbControls = new TrackballControls(camera, renderers[0].domElement)
  tbControls.minDistance = 250
  tbControls.rotateSpeed = 2
  tbControls.zoomSpeed = 0.2

  myGlobe.setPointOfView(camera.position, myGlobe.position)
  tbControls.addEventListener('change', () =>
    myGlobe.setPointOfView(camera.position, myGlobe.position)
  )
  window.addEventListener('resize', onWindowResize)
  function onWindowResize() {
    renderers.forEach((r, idx) => {
      r.setSize(window.innerWidth, window.innerHeight)
      if (idx > 0) {
        // overlay additional on top of main renderer
        r.domElement.style.position = 'absolute'
        r.domElement.style.top = '0px'
        r.domElement.style.pointerEvents = 'none'
      }
      document.getElementById('root').appendChild(r.domElement)
    })
  }

  useTick(({ timestamp, timeDiff }) => {
    tbControls.update()
    renderers.forEach((r) => r.render(scene, camera))
  })
}

export default startApp
