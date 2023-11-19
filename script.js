import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Milad Fakurian https://unsplash.com/photos/iFu2HILEng8
const disp_url = 'https://images.unsplash.com/photo-1618397746666-63405ce5d015?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGdyYWRpZW50JTIwYmx1ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
const disp_tex = new THREE.TextureLoader().load(disp_url)
disp_tex.wrapS = THREE.MirroredRepeatWrapping
disp_tex.wrapT = THREE.MirroredRepeatWrapping
disp_tex.repeat.set(1, 1)

// Anton Darius https://unsplash.com/photos/jvR9ieZVG64
const alpha_url = 'https://images.unsplash.com/photo-1511512608152-b60215d0dd61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fGJsYXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60'
const alpha_tex = new THREE.TextureLoader().load(alpha_url)
alpha_tex.wrapS = THREE.RepeatWrapping
alpha_tex.wrapT = THREE.MirroredRepeatWrapping
alpha_tex.repeat.set(0.1, 2)

// Anastasia Mihalkova https://unsplash.com/photos/rHWnVWrDUto
const image_url = 'https://images.unsplash.com/photo-1566321985021-e32e0e22e5e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
const image_tex = new THREE.TextureLoader().load(image_url)
const image_ratio = 387 / 581

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('white')
camera.position.set(0, 0, 1.4)
controls.enableDamping = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const light = new THREE.DirectionalLight()
light.position.set(2, 0, 2)
light.castShadow = true
light.shadow.bias = -0.00001
scene.add(light)
scene.add(new THREE.AmbientLight('white', 0.3))

const geom = new THREE.PlaneGeometry(image_ratio, 1, 100, 100)
const mat = new THREE.MeshLambertMaterial({ displacementMap: disp_tex, map: image_tex, alphaMap: alpha_tex })
const mesh = new THREE.Mesh(geom, mat)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)

// ----
// render
// ----

renderer.setAnimationLoop((t) => {
  renderer.render(scene, camera)
  controls.update()
  disp_tex.offset.set(t * 0.0002, t * 0.001)
  mat.alphaTest = 0.1 + (Math.sin(t * 0.001) * 0.5 + 0.5) * 0.3
  alpha_tex.offset.set(t * 0.0001, t * 0.0001)
})

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', () => resize(innerWidth, innerHeight))
dispatchEvent(new Event('resize'))
document.body.prepend(renderer.domElement)