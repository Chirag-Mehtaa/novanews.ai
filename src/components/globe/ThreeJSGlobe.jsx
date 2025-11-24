"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const ThreeJSGlobe = ({ newsData = [] }) => {
    const mountRef = useRef(null);
    const [isThreeJsLoaded, setIsThreeJsLoaded] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    // Default Mock Data (Agar backend se data na aaye to ye dikhega)
    const defaultData = [
        { id: 1, lat: 28.6139, lon: 77.2090, color: 0x64FFDA, news: { title: "New Delhi Tech Hub", summary: "AI adoption rises in India.", metric: "Live" } },
        { id: 2, lat: 40.7128, lon: -74.0060, color: 0xFFA500, news: { title: "Wall Street Rally", summary: "Markets hit record highs.", metric: "+2.4%" } },
        { id: 3, lat: 51.5074, lon: -0.1278, color: 0xFF00FF, news: { title: "London Crypto Event", summary: "Blockchain summit starts.", metric: "980 Attendees" } },
        { id: 4, lat: 35.6762, lon: 139.6503, color: 0xFFFF00, news: { title: "Tokyo Robotics", summary: "New androids revealed.", metric: "Trending" } }
    ];

    const activeConnections = newsData.length > 0 ? newsData.slice(0, 10) : defaultData;

    useEffect(() => {
        if (window.THREE) {
            setIsThreeJsLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        script.onload = () => setIsThreeJsLoaded(true);
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (!isThreeJsLoaded || !mountRef.current) return;

        const THREE = window.THREE;
        let scene, camera, renderer, globeGroup, atmosphere;
        let frameId;
        
        // Interaction Vars
        let targetRotationX = 0.2;
        let targetRotationY = 0.1;
        let targetRotationXOnMouseDown = 0;
        let targetRotationYOnMouseDown = 0;
        let mouseX = 0, mouseXOnMouseDown = 0;
        let mouseY = 0, mouseYOnMouseDown = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        let isDragging = false;

        const container = mountRef.current;
        let width = container.clientWidth || 500;
        let height = container.clientHeight || 500;

        // 1. SCENE
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
        camera.position.z = 320; 

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); 
        
        if (container.firstChild) container.removeChild(container.firstChild);
        container.appendChild(renderer.domElement);

        // 2. LIGHTING (Bright & Clean)
        scene.add(new THREE.AmbientLight(0xffffff, 0.6)); // Soft bright light
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(100, 50, 100);
        scene.add(sunLight);

        const blueRim = new THREE.SpotLight(0x64FFDA, 2); 
        blueRim.position.set(200, 0, -100);
        blueRim.lookAt(new THREE.Vector3(0,0,0));
        scene.add(blueRim);

        // 3. GLOBE
        globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // --- A. BLUE MARBLE EARTH (Clean Texture) ---
        const loader = new THREE.TextureLoader();
        const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
        
        const sphereGeo = new THREE.SphereGeometry(100, 64, 64);
        const sphereMat = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: earthTexture,
            bumpScale: 0.02,
            specular: new THREE.Color('grey'),
            shininess: 5,
            transparent: true,
            opacity: 1.0
        });
        const earth = new THREE.Mesh(sphereGeo, sphereMat);
        globeGroup.add(earth);

        // --- B. ATMOSPHERE GLOW ---
        const atmoGeo = new THREE.SphereGeometry(100, 64, 64);
        const atmoMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                    // Cyan/Blue Glow
                    gl_FragColor = vec4(0.3, 0.7, 1.0, 1.0) * intensity * 2.0; 
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        atmosphere.scale.set(1.15, 1.15, 1.15);
        scene.add(atmosphere);

        // --- C. UTILS ---
        const clickableObjects = [];
        
        function latLonToVector3(lat, lon, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));
            return new THREE.Vector3(x, y, z);
        }

        // Tube for Lines
        function createArc(start, end, color) {
            const dist = start.distanceTo(end);
            const mid = start.clone().add(end).multiplyScalar(0.5);
            const midLen = mid.length();
            mid.normalize().multiplyScalar(midLen + dist * 0.5); 
            
            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const geometry = new THREE.TubeGeometry(curve, 40, 0.3, 8, false); 
            const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
            return new THREE.Mesh(geometry, material);
        }

        // --- RENDER DATA ---
        activeConnections.forEach(conn => {
            const pos = latLonToVector3(conn.lat, conn.lon, 100.5);
            
            // Hotspot
            const hitGeo = new THREE.SphereGeometry(5, 8, 8); 
            const hitMat = new THREE.MeshBasicMaterial({ visible: false }); 
            const hitMesh = new THREE.Mesh(hitGeo, hitMat);
            hitMesh.position.copy(pos);
            hitMesh.userData = { type: 'hotspot', data: conn };
            globeGroup.add(hitMesh);
            clickableObjects.push(hitMesh);

            // Dot
            const dotGeo = new THREE.SphereGeometry(1.2, 16, 16);
            const dotMat = new THREE.MeshBasicMaterial({ color: conn.color || 0x64FFDA });
            const dot = new THREE.Mesh(dotGeo, dotMat);
            dot.position.copy(pos);
            globeGroup.add(dot);

            // Ring
            const ringGeo = new THREE.RingGeometry(1.8, 3.2, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: conn.color || 0x64FFDA, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(pos);
            ring.lookAt(new THREE.Vector3(0,0,0));
            ring.userData = { animateRing: true };
            globeGroup.add(ring);

            // Arc (Optional: Target ho tabhi banao)
            if (conn.target) {
               const endPos = latLonToVector3(conn.target.lat, conn.target.lon, 100.5);
               const arc = createArc(pos, endPos, conn.color || 0x64FFDA);
               globeGroup.add(arc);
            }
        });

        // --- INTERACTION ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseDown = (event) => {
            event.preventDefault();
            isDragging = true;
            mouseXOnMouseDown = event.clientX - windowHalfX;
            mouseYOnMouseDown = event.clientY - windowHalfY;
            targetRotationYOnMouseDown = targetRotationY;
            targetRotationXOnMouseDown = targetRotationX;
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
        };

        const onMouseMove = (event) => {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
            targetRotationY = targetRotationYOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.005;
            targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.005;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(clickableObjects);
            if (intersects.length > 0) {
                setSelectedNews(intersects[0].object.userData.data);
            } else if (!isDragging) {
                setSelectedNews(null);
            }
        };

        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('click', onClick);

        // --- ANIMATION ---
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            
            if (!isDragging) {
                targetRotationY += 0.0015; 
            }

            globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
            globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

            globeGroup.children.forEach(child => {
                if (child.userData.animateRing) {
                    const scale = 1 + Math.sin(Date.now() * 0.004) * 0.5;
                    child.scale.set(scale, scale, scale);
                    child.material.opacity = Math.max(0, 1 - scale/1.5);
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (container) {
                const w = container.clientWidth;
                const h = container.clientHeight;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('click', onClick);
            if(renderer) renderer.dispose();
        };
    }, [isThreeJsLoaded, activeConnections]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div ref={mountRef} className="w-full h-full cursor-move" />
            
            {!isThreeJsLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-teal-accent animate-pulse font-mono">
                    LOADING SYSTEM...
                </div>
            )}

           {/* 🔥 NEW FUTURISTIC POPUP UI */}
            {selectedNews && selectedNews.news && (
                <div className="absolute bottom-8 left-4 right-4 md:left-auto md:right-10 md:top-20 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="relative bg-[#0a192f]/90 backdrop-blur-xl border border-teal-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                        
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>

                        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                                </span>
                                <span className="text-teal-400 text-[10px] font-extrabold tracking-[0.2em] uppercase font-mono">
                                    Live Feed
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedNews(null)} 
                                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-bold text-white leading-snug mb-3 drop-shadow-sm font-serif">
                                {selectedNews.news.title}
                            </h3>
                            
                            <div className="pl-3 border-l-2 border-teal-500/30 mb-4">
                                <p className="text-xs text-gray-300 leading-relaxed font-light">
                                    {selectedNews.news.summary}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Location</span>
                                    <span className="text-xs text-gray-200 font-medium">{selectedNews.name || "Global"}</span>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Status</span>
                                    <span className="text-xs text-teal-300 font-mono bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                        {selectedNews.news.metric || "Active"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreeJSGlobe;