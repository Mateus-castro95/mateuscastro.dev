<script setup lang="ts">
import { shallowRef, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Shared loaders (one instance reused for all models)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const props = defineProps<{ startAnimation: boolean }>()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const containerRef = shallowRef<HTMLDivElement | null>(null)
const isReady = ref(false)

// Three.js scene objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animFrameId: number
let fallBlockMesh: THREE.Mesh | null = null
let chipModelGroup: THREE.Group | null = null

const stationGroups: THREE.Group[] = []
const chipParent = new THREE.Group()

// Station layout — matches Merodev isometric positions
const stations = [
  { name: 'BACKSTAGE',   model: 'door.glb',        pos: [-12, 0, -12] as [number,number,number] },
  { name: 'WORKS',       model: 'server.glb',       pos: [  5, 0, -15] as [number,number,number] },
  { name: 'CONTACT',     model: 'satellite.glb',    pos: [ 15, 0,  -8] as [number,number,number] },
  { name: 'RESUME',      model: 'cabinet.glb',      pos: [ 18, 0,   5] as [number,number,number] },
  { name: 'ABOUT ME',    model: 'office.glb',       pos: [ 12, 0,  15] as [number,number,number] },
  { name: 'SKILLS',      model: 'robotic_arm.glb',  pos: [  0, 0,  15] as [number,number,number] },
  { name: 'EXPERIENCE',  model: 'table.glb',        pos: [-12, 0,  12] as [number,number,number] },
  { name: 'TESTIMONIALS',model: 'hover_podium.glb', pos: [-18, 0,   0] as [number,number,number] },
]

// ---------- Helpers ----------

const loadGLTF = (path: string): Promise<THREE.Group> =>
  new Promise((resolve, reject) => {
    gltfLoader.load(path, g => resolve(g.scene), undefined, reject)
  })

const makeLabel = (text: string): THREE.Sprite => {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 80
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.font = '700 28px monospace'
  ctx.fillStyle = '#00F2FF'
  ctx.fillText(`{ ${text} }`, 14, 52)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }))
  sprite.scale.set(8, 1.5, 1)
  sprite.position.set(0, 3.8, 0)
  return sprite
}

const buildCrossGrid = (): THREE.Group => {
  const group = new THREE.Group()
  const gridSize = 400
  const divisions = 80         // number of cells
  const step = gridSize / divisions  // 5 units per cell
  const half = gridSize / 2
  const crossArm = 0.35        // half-length of each + arm

  // ---- Faint grid lines ----
  const linePts: THREE.Vector3[] = []
  for (let i = 0; i <= divisions; i++) {
    const p = -half + i * step
    linePts.push(new THREE.Vector3(-half, 0, p), new THREE.Vector3(half, 0, p))
    linePts.push(new THREE.Vector3(p, 0, -half), new THREE.Vector3(p, 0, half))
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0a2535, transparent: true, opacity: 0.55 })
  group.add(new THREE.LineSegments(lineGeo, lineMat))

  // ---- Cross (+) markers — billboard sprites facing camera ----
  const crossCanvas = document.createElement('canvas')
  crossCanvas.width = 32; crossCanvas.height = 32
  const cc = crossCanvas.getContext('2d')!
  cc.strokeStyle = '#00c8d8'
  cc.lineWidth = 4
  cc.lineCap = 'square'
  cc.beginPath(); cc.moveTo(4, 16); cc.lineTo(28, 16); cc.stroke()   // horizontal
  cc.beginPath(); cc.moveTo(16, 4); cc.lineTo(16, 28); cc.stroke()   // vertical
  const crossTex = new THREE.CanvasTexture(crossCanvas)

  const crossPosPts: number[] = []
  for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= divisions; j++) {
      crossPosPts.push(-half + i * step, 0, -half + j * step)
    }
  }
  const pointsGeo = new THREE.BufferGeometry()
  pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(crossPosPts, 3))
  const pointsMat = new THREE.PointsMaterial({
    map: crossTex,
    size: 0.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    alphaTest: 0.01,
  })
  group.add(new THREE.Points(pointsGeo, pointsMat))

  group.position.y = -0.5
  return group
}

const makeWire = (to: [number, number, number]): THREE.Line => {
  const mat = new THREE.LineBasicMaterial({ color: 0x00F2FF, transparent: true, opacity: 0.6 })
  // L-shaped orthogonal path: [0,0,0] → [x,0,0] → [x,0,z]  (circuit-board style)
  const points = [
    new THREE.Vector3(0,    0, 0),
    new THREE.Vector3(to[0], 0, 0),
    new THREE.Vector3(to[0], 0, to[2]),
  ]
  const geo = new THREE.BufferGeometry().setFromPoints(points)
  return new THREE.Line(geo, mat)
}

// ---------- Init ----------

const initScene = async () => {
  if (!canvasRef.value || !containerRef.value) return
  const W = containerRef.value.clientWidth
  const H = containerRef.value.clientHeight

  // Renderer (opaque — background set on scene)
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x030708)

  // Camera — isometric angle like Merodev
  camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 1000)
  camera.position.set(38, 34, 38)
  camera.lookAt(0, 0, 0)

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 10))
  const dir = new THREE.DirectionalLight(0xffffff, 7)
  dir.position.set(20, 30, 10)
  dir.castShadow = true

  dir.shadow.mapSize.width = 2048
  dir.shadow.mapSize.height = 2048
  dir.shadow.camera.near = 1
  dir.shadow.camera.far = 100
  dir.shadow.camera.left = -50
  dir.shadow.camera.right = 50
  dir.shadow.camera.top = 50
  dir.shadow.camera.bottom = -50

  scene.add(dir)
  const pt = new THREE.PointLight(0x00F2FF, 12, 80)
  pt.position.set(0, 8, 0)
  scene.add(pt)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  dir.castShadow = true
  dir.receiveShadow = true

  // 3D Cross-Grid matching Merodev style
  scene.add(buildCrossGrid())

  // ---------- Chip (central) ----------
  chipParent.visible = false
  scene.add(chipParent)

  // Falling block (neon cube)
  const blockGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2)
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x00F2FF, emissive: 0x00F2FF,
    emissiveIntensity: 3, metalness: 0.7, roughness: 0.2,
  })
  fallBlockMesh = new THREE.Mesh(blockGeo, blockMat)
  fallBlockMesh.position.set(0, 28, 0) // starts high above
  chipParent.add(fallBlockMesh)

  // Platform ring for chip
  const ringGeo = new THREE.RingGeometry(2.2, 2.5, 64)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00F2FF, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  chipParent.add(ring)

  try {
    chipModelGroup = await loadGLTF('/models/chip.glb')
    chipModelGroup.scale.setScalar(2)
    chipParent.add(chipModelGroup)
  } catch (e) { console.warn('chip.glb failed', e) }

  // ---------- Stations ----------
  for (let i = 0; i < stations.length; i++) {
    const st = stations[i]!
    const group = new THREE.Group()
    group.position.set(0, 0, 0) // MUST start at center

    // Platform disc
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 0.12, 32),
      new THREE.MeshStandardMaterial({ color: 0x0b1e26, metalness: 0.8, roughness: 0.3 })
    )
    disc.position.y = -0.1
    group.add(disc)

    // Model
    try {
      const model = await loadGLTF(`/models/${st.model}`)
      model.scale.setScalar(1.4)
      group.add(model)
    } catch (e) { console.warn(`${st.model} failed`, e) }

    // Label
    group.add(makeLabel(st.name))

    group.visible = false
    scene.add(group)
    stationGroups.push(group)
  }

  // Render loop
  const tick = () => {
    animFrameId = requestAnimationFrame(tick)
    renderer.render(scene, camera)
  }
  tick()

  window.addEventListener('resize', onResize)
  isReady.value = true
}

const onResize = () => {
  if (!containerRef.value) return
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

// ---------- Animation sequence ----------

const playAnimation = () => {
  if (!fallBlockMesh) return

  chipParent.visible = true
  const tl = gsap.timeline()

  // 1. Block falls from y=28 to y=0
  tl.to(fallBlockMesh.position, { y: 0, duration: 1.2, ease: 'bounce.out', delay: 0.2 })

  // 2. Block shrinks (impact into chip)
  tl.to(fallBlockMesh.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: 'power4.in' })

  // 3. Stations & wires burst outward
  tl.add(() => {
    stationGroups.forEach((group, i) => {
      const st = stations[i]!
      group.visible = true

      // Wires
      scene.add(makeWire(st.pos))

      // Animate position from center → final
      gsap.to(group.position, {
        x: st.pos[0], y: st.pos[1], z: st.pos[2],
        duration: 1.6,
        delay: i * 0.07,
        ease: 'expo.out',
      })
    })
  })
}

watch(() => props.startAnimation, (val) => {
  if (!val) return
  if (isReady.value) {
    playAnimation()
  } else {
    const id = setInterval(() => {
      if (isReady.value) { clearInterval(id); playAnimation() }
    }, 50)
  }
})

onMounted(async () => {
  await nextTick()
  await initScene()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrameId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full absolute inset-0">
    <canvas ref="canvasRef" class="w-full h-full block" />
  </div>
</template>
