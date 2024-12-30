import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader,
  } from "./shaders.js";
  
  document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    const mouse = new THREE.Vector2();
    let frame = 0;
  
    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
  
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
  
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);
  
    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });
  
    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    simScene.add(simQuad);
    scene.add(renderQuad);
  
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });
  
    ctx.fillStyle = "#fb7427";
    ctx.fillRect(0, 0, width, height);
  
    const fontSize = Math.round(250 * window.devicePixelRatio);
    ctx.fillStyle = "#fef4b8";
    ctx.textRendering = "geometricPrecision";
    ctx.imageSmoothingEnabled = "true";
    ctx.imageSmoothingQuality = "high";
    ctx.fillText("softhorizon", width / 2, height / 2);
  
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;
  
    window.addEventListener("resize", () => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;
      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);
  
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.fillStyle = "#fb7427";
      ctx.fillRect(0, 0, newWidth, newHeight);
  
      textTexture.needsUpdate = true;
    });
  
    renderer.domElement.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    });
  
    renderer.domElement.addEventListener("mouseleave", () => {
      mouse.set(0, 0);
    });

  });
  