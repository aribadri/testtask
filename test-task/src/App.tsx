import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import RotationControls from './components/RotationControls/RotationControls';
import ColorInput from './components/ColorInput/ColorInput';
import { RotationDirection } from './constants';
import CustomButton from './components/CustomButton/CustomButton';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubeRef = useRef<THREE.Mesh>();
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [cubeColor, setCubeColor] = useState<string>('white');
  const cubeMaterial = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({ color: cubeColor, opacity: 0.4, transparent: false, roughness: 0.5, metalness: .9 })
  );

  useEffect(() => {
    const init = () => {
      if (!canvasRef.current) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(-15, 10, 10);

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;

      const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.maxPolarAngle = Math.PI / 2 + 0.1;

      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      const directionLight = new THREE.DirectionalLight(0xffffff, 2);
      directionLight.position.set(-15, 35, -12);
      directionLight.castShadow = true;
      directionLight.shadow.mapSize.width = 1024;
      directionLight.shadow.mapSize.height = 1024;
      directionLight.shadow.bias = -0.001;
      scene.add(directionLight, ambientLight);

      const floorMaterial = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.8, transparent: false });
      
      const envSphereGeometry = new THREE.SphereGeometry(50, 128, 128);
      const envSphereMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('env.jpg'), side: THREE.BackSide });
      const environmentSphere = new THREE.Mesh(envSphereGeometry, envSphereMaterial);
      scene.add(environmentSphere);

      const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.current);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);
      cubeRef.current = cube;

      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const ground = new THREE.Mesh(groundGeometry, floorMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -6;
      ground.receiveShadow = true;
      ground.castShadow = true;
      scene.add(ground);

      const animate = () => {
        if (!cubeRef.current) return;
        requestAnimationFrame(animate);
        cubeRef.current.rotation.x = THREE.MathUtils.lerp(cubeRef.current.rotation.x, targetRotationX.current, 0.05);
        cubeRef.current.rotation.y = THREE.MathUtils.lerp(cubeRef.current.rotation.y, targetRotationY.current, 0.05);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };
    init();
  }, []);

  useEffect(() => {
    cubeMaterial.current.color.set(cubeColor);
  }, [cubeColor]);

  const handleRotate = (direction: RotationDirection) => {
    const rotationOffset = Math.PI / 4;
    switch (direction) {
      case RotationDirection.Up:
        targetRotationX.current += rotationOffset;
        break;
      case RotationDirection.Down:
        targetRotationX.current -= rotationOffset;
        break;
      case RotationDirection.Left:
        targetRotationY.current += rotationOffset;
        break;
      case RotationDirection.Right:
        targetRotationY.current -= rotationOffset;
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setCubeColor(inputValue)
    setInputValue('')
  };

  return (
    <>
      <canvas ref={canvasRef} />
      <div className="buttons-wrapper">
        <RotationControls className="up-btn btns" direction={RotationDirection.Up} onRotate={() => handleRotate(RotationDirection.Up)} />
        <RotationControls className="down-btn btns" direction={RotationDirection.Down} onRotate={() => handleRotate(RotationDirection.Down)} />
        <RotationControls className="left-btn btns" direction={RotationDirection.Left} onRotate={() => handleRotate(RotationDirection.Left)} />
        <RotationControls className="right-btn btns" direction={RotationDirection.Right} onRotate={() => handleRotate(RotationDirection.Right)} />
      </div>
      <div className="input-wrapper">
        <ColorInput value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter color" />
        <CustomButton className='submit-btn' onSubmit={handleSubmit} >
          Apply
        </CustomButton>
      </div>
    </>
  );
};

export default App;
