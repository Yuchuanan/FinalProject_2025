const modelConfigs = [
  {
    path: 'chair1.glb',
    scale: [19, 19, 19],
    position: [0, -8, 0],
    rotation: [0.1, 0, 0],
    product: { name: "Eames DAW", designer: "Charles and Ray Eames", year: "1950" }
  },
  {
    path: 'chair2.glb',
    scale: [22, 22, 22],
    position: [0, -8, 0],
    rotation: [0, 0, 0],
    product: { name: "Angie Mid-Century Armchair", designer: "Adrian Pearsall", year: "1950s" }
  },
  {
    path: 'chair3.glb',
    scale: [20, 20, 20],
    position: [0, -8.5, 0],
    rotation: [0, 0, 0],
    product: { name: "Lutra Chair", designer: "Yrjö Kukkapuro", year: "1964" }
  },
  {
    path: 'chair4.glb',
    scale: [22, 22, 22],
    position: [0, -6, 0],
    rotation: [0, 0.3, 0],
    product: { name: "Mater High Stool", designer: "Space Copenhagen", year: "1983" }
  },
  {
    path: 'chair5.glb',
    scale: [30, 30, 30],
    position: [0, -7, 0],
    rotation: [0.4, 0.4, 0],
    product: { name: "No. 811 beechwood stool", designer: "Josef Hoffmann", year: "1925" }
  },
  {
    path: 'chair6.glb',
    scale: [40, 40, 40],
    position: [0, -8, 0],
    rotation: [0, 1, 0],
    product: { name: "Chandigarh chair", designer: "Pierre Jeanneret", year: "1950s" }
  },
  {
    path: 'chair7.gltf',
    scale: [17, 17, 17],
    position: [0, -8, 0],
    rotation: [0, 0.4, 0],
    product: { name: "Beetle Chair", designer: "GamFratesi", year: "1980" }
  },
  {
    path: 'chair8.glb',
    scale: [32, 32, 32],
    position: [0, -8, 0],
    rotation: [0.2, 0.7, 0],
    product: { name: "Flora Chair", designer: "Designer H", year: "1985" }
  },
  {
    path: 'chair9.glb',
    scale: [20, 20, 20],
    position: [0, -8, 0],
    rotation: [0, -1, 0],
    product: { name: "Cesca Chair", designer: "Marcel Breuer", year: "1928" }
  }
];
let currentModelIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  if (document.getElementById('model-container')) {
    init3DViewer();
  }

  const yearButtons = document.querySelectorAll('.year-button');
  yearButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    });
  });
});

function init3DViewer() {
  const container = document.getElementById('model-container');
  const aspect = container.clientWidth / container.clientHeight;
  const d = 10; 

  const camera = new THREE.OrthographicCamera(
    -d * aspect, d * aspect,
    d, -d,
    0.1, 1000
  );
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(100, 100, 100);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const loader = new THREE.GLTFLoader();
  function loadModel(config) {
    loader.load(
      config.path,
      function (gltf) {
        const oldModel = scene.getObjectByName('model');
        if (oldModel) scene.remove(oldModel);
        const model = gltf.scene;
        model.name = 'model';
        model.scale.set(...config.scale);
        model.position.set(...config.position);
        model.rotation.set(...config.rotation);
        scene.add(model);
        scene.model = model;
        console.log(`Loaded model: ${config.path}`);
        console.log(`Scale: ${config.scale}, Position: ${config.position}, Rotation: ${config.rotation}`);
        updateProductInfo(config.product);
        if (window.controls) window.controls.reset();
      },
      undefined,
      function (error) {
        console.error('Error loading model:', error);
      }
    );
  }

  loadModel(modelConfigs[currentModelIndex]);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.rotateSpeed = 0.5;
  window.controls = controls;

  window.addEventListener('resize', () => {
    const aspect = container.clientWidth / container.clientHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  const nextBtn = document.getElementById('next-model');
  const prevBtn = document.getElementById('prev-model');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => switchModel(1));
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => switchModel(-1));
  }

  window.loadModel = loadModel;
  window.scene = scene;
}

function switchModel(direction) {
  currentModelIndex = (currentModelIndex + direction + modelConfigs.length) % modelConfigs.length;
  gsap.to("#product-info", {
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      gsap.to("#model-container", {
        scale: 0.7,
        opacity: 0,
        rotateY: direction * 30,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          loadModel(modelConfigs[currentModelIndex]);
          gsap.fromTo("#model-container", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" });
          gsap.fromTo("#product-info", { x: direction > 0 ? 100 : -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
        }
      });
    }
  });
}

function resetModel() {
  if (window.scene && window.scene.model) {
    const config = modelConfigs[currentModelIndex];
    gsap.to(window.scene.model.rotation, { x: config.rotation[0], y: config.rotation[1], z: config.rotation[2], duration: 0.5 });
    gsap.to(window.scene.model.position, { x: config.position[0], y: config.position[1], z: config.position[2], duration: 0.5 });
    gsap.to(window.scene.model.scale, { x: config.scale[0], y: config.scale[1], z: config.scale[2], duration: 0.5 });
    if (window.controls) window.controls.reset();
  }
}

function updateProductInfo(product) {
  const infoContainer = document.getElementById("product-info");
  if (infoContainer) {
    infoContainer.innerHTML = `
      <div class="product-details">
        <div class="product-text">
          <h2 class="product-name">${product.name}</h2>
          <p class="product-info-line">Designer: ${product.designer} | Year: ${product.year}</p>
        </div>
        <button id="reset-btn" class="reset-btn">Reset Model</button>
      </div>
    `;
    document.getElementById("reset-btn").addEventListener("click", resetModel);
  }
}
