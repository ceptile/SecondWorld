import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class AssetLoader {
  private textureLoader = new THREE.TextureLoader();
  private gltfLoader = new GLTFLoader();
  private hdriLoader = new RGBELoader();
  private cache = new Map<string, unknown>();

  async loadTexture(url: string, srgb = true): Promise<THREE.Texture> {
    if (this.cache.has(url)) return this.cache.get(url) as THREE.Texture;
    const tex = await this.textureLoader.loadAsync(url);
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    this.cache.set(url, tex);
    return tex;
  }

  async loadGLTF(url: string) {
    if (this.cache.has(url)) return this.cache.get(url);
    const gltf = await this.gltfLoader.loadAsync(url);
    this.cache.set(url, gltf);
    return gltf;
  }

  async loadHDRI(url: string): Promise<THREE.DataTexture> {
    if (this.cache.has(url)) return this.cache.get(url) as THREE.DataTexture;
    const tex = await this.hdriLoader.loadAsync(url);
    this.cache.set(url, tex);
    return tex;
  }
}

export const assetLoader = new AssetLoader();
