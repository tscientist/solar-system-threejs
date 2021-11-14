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

    const sunGeometry = new THREE.SphereGeometry(8);
    const sunTexture = new THREE.TextureLoader().load("blue-sun-texture.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    const solarSystem = new THREE.Group();
    solarSystem.add(sunMesh);
    scene.scene.add(solarSystem);

    await initGui();
    const solarSystemGui = gui.addFolder("solar system");

    const animate = () => {
      sunMesh.rotation.y += 0.001;
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