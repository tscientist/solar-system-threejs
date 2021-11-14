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
    
    function animateScene() {
      window.requestAnimationFrame(animateScene.bind(this));
      renderer.render(scene, camera);
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

    const earthGeometry = new THREE.SphereGeometry(4);
    const earthTexture = new THREE.TextureLoader().load("earth-texture.jpg");
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.x += 48;
    
    let earthSystem = new THREE.Group();
    earthSystem.add(earthMesh);

    solarSystem.add(earthSystem);

    await initGui();
    const solarSystemGui = gui.addFolder("solar system");
    solarSystemGui.add(earthMesh, "visible").name("earth").listen();

    const animate = () => {
      sunMesh.rotation.y += 0.001;
      earthMesh.rotation.y += 0.005;
      earthSystem.rotation.y += 2 * Math.PI * (1 / 60) * (1 / 60);//earth rotate around the sun in 1 minute
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="solar-system" />
    </div>
  );
}