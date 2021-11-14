import * as THREE from "three";
import { useEffect } from "react";
import SceneInit from "../SceneInit";

export default function Home() {
  let gui;

  const initGui = async () => {
    const dat = await import("dat.gui");
    gui = new dat.GUI();
  };

  useEffect(async () => {
    let scene = new SceneInit();
    scene.initScene();
    scene.animate();

    const sunGeometry = new THREE.SphereGeometry(14);
    const sunTexture = new THREE.TextureLoader().load("blue-sun-texture.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    const solarSystem = new THREE.Group();
    solarSystem.add(sunMesh);
    scene.scene.add(solarSystem);

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
      earthSystem.rotation.y += 2 * Math.PI * (1 / 60) * (1 / 60);;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas id="solar-system" />
    </div>
  );
}