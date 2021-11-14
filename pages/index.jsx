import * as THREE from "three";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default function Home() {
  let gui;

  const initGui = async () => {
    const dat = await import("dat.gui");
    gui = new dat.GUI();
  };

  useEffect(async () => {
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 1000);
    
    camera.position.z = 128;
  
    const scene = new THREE.Scene();

    const spaceTexture = new THREE.TextureLoader().load("space-texture2.png");
    scene.background = spaceTexture;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("solar-system"),
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    const controls = new OrbitControls(camera, renderer.domElement);
  
    const stats = Stats();
    document.body.appendChild(stats.dom);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
    
    const animateScene = () => {
      window.requestAnimationFrame(animateScene.bind(this));
      render()
      stats.update();
    }

    animateScene();

    const sunGeometry = new THREE.SphereGeometry(14);
    const sunTexture = new THREE.TextureLoader().load("sun-texture.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    const solarSystem = new THREE.Group();
    solarSystem.add(sunMesh);
    scene.add(solarSystem);

    const earthGeometry = new THREE.SphereGeometry(3);
    const earthTexture = new THREE.TextureLoader().load("earth-texture.jpg");
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.x += 48;
    let earth = {  
      target : false,
      rotation : false,
      translation : false
    };
    let earthSystem = new THREE.Group();
    earthSystem.add(earthMesh);
    solarSystem.add(earthSystem);

    // const moonGeometry = new THREE.SphereGeometry(0.5);
    // const moonTexture = new THREE.TextureLoader().load("earth-texture.jpg");
    // const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    // const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    // moonMesh.position.x += 55;
    // let moon = {  
    //   target : false,
    //   rotation : false,
    //   translation : false
    // };
    // let moonSystem = new THREE.Group();
    // moonSystem.add(moonMesh);
    // earthSystem.add(moonSystem);

    await initGui();
    const solarSystemGui = gui.addFolder("solar system");
    solarSystemGui.add(earthMesh, "visible").name("earth").listen();
    solarSystemGui.add(sunMesh, "visible").name("sun").listen();
    solarSystemGui.add(activateRotation(earth), 'rotation').name("Earth Rotation");
    solarSystemGui.add(activateTranslation(earth), 'translation').name("Earth Translation");

    //Camera
    const cameraFolder = gui.addFolder('Camera')

    const cameraRotationFolder = cameraFolder.addFolder('Rotation')
    cameraRotationFolder.add(camera.rotation, 'x',  -2, Math.PI * 2)
    cameraRotationFolder.add(camera.rotation, 'y',  0, Math.PI * 2)
    cameraRotationFolder.add(camera.rotation, 'z',  0, Math.PI * 2)

    const cameraFocusFolder = cameraFolder.addFolder('Focus')
    cameraFocusFolder.add(earth, 'target').name('Earth')

    const animate = () => {
      render()
      sunMesh.rotation.y += 0.001;
    
      // moonSystem.rotation.y += 1 * Math.PI * (1 / 30) * (1 / 30);//earth rotate around the sun in 1 minute

      if (earth.target){
        camera.lookAt(earthMesh.position.x, earthMesh.position.y, earthMesh.position.z);
      } 

      if (earth.rotation) {
        earthMesh.rotation.y += 0.005;
      }

      if (earth.translation) {
        earthSystem.rotation.y += 2 * Math.PI * (1 / 60) * (1 / 60);//earth rotate around the sun in 1 minute
      }

      requestAnimationFrame(animate);
    };

    function render() {
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return (
    <div>
      <canvas id="solar-system" />
    </div>
  );
}