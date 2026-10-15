import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// Ashima / Stefan Gustavson 3D simplex noise (MIT)
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPulse;
varying float vD;
varying vec3 vN;
varying vec3 vP;
${noise}
void main(){
  float d = snoise(normal*1.25 + uTime*0.32) * (0.26 + uPulse*0.12)
          + snoise(normal*3.1 - uTime*0.22) * 0.05;
  vec3 pos = position + normal*d;
  vD = d;
  vN = normalize(normalMatrix*normal);
  vP = pos;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}`

const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uLight;
varying float vD; varying vec3 vN; varying vec3 vP;
void main(){
  vec3 n = normalize(vN);
  float fres = pow(1.0-abs(n.z), 2.2);
  vec3 col = mix(uA, uB, smoothstep(-0.22, 0.28, vD));
  col = mix(col, uC, smoothstep(-0.4, 1.4, vP.y + vP.x*0.4) * 0.6);
  col += fres * mix(0.7, 0.35, uLight) * uC;
  col += (n.y*0.5+0.5) * 0.1;
  gl_FragColor = vec4(col, 1.0);
}`

function Blob({ palette, reduce }) {
  const mesh = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uLight: { value: 0 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
      uC: { value: new THREE.Color() },
    }),
    []
  )
  useEffect(() => {
    uniforms.uA.value.set(palette.a)
    uniforms.uB.value.set(palette.b)
    uniforms.uC.value.set(palette.c)
    uniforms.uLight.value = palette.light ? 1 : 0
  }, [palette, uniforms])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!reduce) uniforms.uTime.value += dt
    // follow the pointer gently
    const px = state.pointer.x, py = state.pointer.y
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, px * 0.6 + uniforms.uTime.value * 0.15, 0.05)
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -py * 0.4, 0.05)
    const target = Math.min(1, Math.hypot(px, py))
    uniforms.uPulse.value = THREE.MathUtils.lerp(uniforms.uPulse.value, target, 0.04)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.3, 48]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} />
    </mesh>
  )
}

function Dust({ color, reduce, count = 700 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.9 + Math.random() * 1.3
      const th = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 0.9 * (r - 1.2)
      p.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3)
    }
    return p
  }, [count])
  useFrame((_, dt) => {
    if (!reduce) ref.current.rotation.y += dt * 0.06
  })
  return (
    <points ref={ref} rotation={[0.35, 0, 0.18]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color={color} transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function Scene({ dark }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = typeof window !== 'undefined' && window.innerWidth < 700
  const palette = useMemo(
    () =>
      dark
        ? { a: '#4a2fbf', b: '#b59cff', c: '#ffab7a', light: false }
        : { a: '#6a43e0', b: '#c4b0ff', c: '#f07a4a', light: true },
    [dark]
  )
  return (
    <Canvas
      className="scene"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Blob palette={palette} reduce={reduce} />
      <Dust color={palette.c} reduce={reduce} count={small ? 380 : 700} />
    </Canvas>
  )
}
