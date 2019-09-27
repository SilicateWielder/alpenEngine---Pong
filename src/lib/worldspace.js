/*
 * Candle Lib - worldspace.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage polygons
 */
 
import { Thread } from 'sphere-runtime';

import FastColors from './colors.js';

import Smath from './smath.js';

import PointCloud from './pointcloud.js';
import Model from './model.js';

import ScalingTex from './scalingtex.js';
import Camera from './camera.js';

export default
class Scene
{
	constructor(defaultTexture)
	{
        // "Math accelerator" and "color caching".
        this.fmath = new Smath();
        this.fcolors = new FastColors();

        // Used to track model positions.
        this.cloud = new PointCloud();
        
        // Particle system's cloud.
        this.particles = new PointCloud();

        // World's camera.
        this.camera = new Camera(GetScreenWidth(), GetScreenHeight(), 0, 0, 0, 0, 0, 0);

        // Cache for building geometry.
        this.modelCache = new Model(this.camera);

        this.objects = [];
    }
    
    placeCam(x, y, z)
    {

    }

    placeModel(id, x, y, z)
    {
        let cloudId = this.objects[id].id;
        this.cloud.setPos(cloudId, x,  y, z);
    }
    
    addPoint(x, y, z)
    {
        this.modelCache.addPoint(x, y , z);
    }

    definePoly(points, texture, flipped)
    {
        this.modelCache.definePoly(points, texture,flipped);
    }

    calcModelColider()
    {
        this.modelCache.findCollisionBounds();
    }

    generateEntry(x = 0, y = 0, z = 0)
    {
        let entry = {};
        entry.model = this.modelCache;
        entry.id = this.cloud.addPoint(x, y, z);
        return(entry);
    }

    finalizeModel(x, y, z)
    {
        let entry = this.generateEntry(x, y, z);
        this.objects.push(entry);
        
        return this.objects.length - 1;
    }
    
    clearCache()
    {
        this.modelCache = new Model(this.camera);
    }

    getModel(id)
    {
        return this.objects[id].model;
    }

    blit()
    {
        let modelCount = this.objects.length;
        //this.cloud.rotate(this.camera.rot.x, this.camera.rot.y, this.camera.rot.z);
        for(let m = 0; m < modelCount; m++)
        {
            let currentModel = this.objects[m]
            let pos = this.cloud.getPos(currentModel.id);
            currentModel.model.rotate(this.camera.rot.x, this.camera.rot.y, this.camera.rot.z);
            print(currentModel.model.pos);
            currentModel.model.blit(pos.x, pos.y, pos.z, true);
        }
    }
}