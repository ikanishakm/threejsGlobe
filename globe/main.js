import ThreeGlobe from "three-globe"
import "./style.css"



const myGlobe = new ThreeGlobe().globeImageUrl(myImageUrl).pointsData(myData)

const myScene = new THREE.Scene()
myScene.add(myGlobe)