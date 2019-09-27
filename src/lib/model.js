/*
 * Candle Lib - model.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage groups of polygons in the form of models.
 */

import { Thread } from 'sphere-runtime';
import PointCloud from './pointcloud.js';
import Polygon from './polygon.js';

function bubbleSortModel(arr)
{
	var len = arr.length;
	for (var i = len-1; i>=0; i--){
		for(var j = 1; j<=i; j++){
			if(arr[j-1][1] < arr[j][1]){
				var temp = arr[j-1];
				arr[j-1] = arr[j];
				arr[j] = temp;
			}
		}
	}
}

export default
class Model
{
	constructor(camera, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0)
	{
		// Create a pointcloud and polygon table.
		this.camera = camera;
		this.cloud = new PointCloud();
		this.polydefs = [];
		
		// Positional and orientation data.
		this.pos = {"x":x, "y":y, "z":z};
		this.rot = {"x":rx, "y":ry, "z":rz};
		
		// Rendering mode settings.
		this.mode = {};
		this.mode.wireframe = false;
		this.mode.mixed = false;
		this.mode.zsort = false;
		this.mode.backcull = true;

		this.collider = {
			"xMin" : 0,
			"xMax" : 0,
			"yMin" : 0,
			"yMax" : 0,
			"zMin" : 0,
			"zMax" : 0
		};
	}
	
	addPoint(x, y, z)
	{
		return this.cloud.addPoint(x, y, z);
	}
	
	rotate(x, y, z, reorder = false)
	{
		this.cloud.rotate(x, y, z, this.pos.x, this.pos.y, this.pos.z);
		this.rot = {"x":x, "y":y, "z":z};
		
		
		if(reorder)
		{
			// Update distance of each face, if applicable.
			for(let p = 0; p < this.polydefs.length; p++)
			{
				this.getPolyDist(p);
			}
			// Sort faces
			bubbleSortModel(this.polydefs);
		}
	}
	
	move(x, y, z)
	{
		this.pos = {"x":x, "y":y, "z":z};
	}
	
	definePoly(points, texture, flipped)
	{
		if(points.length == 4)
		{
			let map = new Polygon(this.cloud, points[0], points[1], points[2], points[3], flipped, texture);
			this.polydefs.push([map, null]);
		}
	}
	
	getPolyDist(id)
	{
		let poly = this.polydefs[id][0];
		let p1 = this.cloud.get(poly.p1).pub.z;
		let p2 = this.cloud.get(poly.p2).pub.z;
		let p3 = this.cloud.get(poly.p3).pub.z;
		let p4 = this.cloud.get(poly.p4).pub.z;
		
		let dist = (p1 + p2 + p3 + p4)/4;
		this.polydefs[id][1] = dist;
		return dist;
	}
	
	reorder()
	{
		bubbleSortModel(this.polydefs);
	}

	// Calculates the collision boundaries of the model. coincidentally, this could also be used to calculate the model's dimensions.
	findCollisionBounds() 
	{
		let xMin = 0;
		let xMax = 0;
		let yMin = 0;
		let yMax = 0;
		let zMin = 0;
		let zMax = 0;

		let xCache = [];
		let yCache = [];
		let zCache = [];

		for (let p = 0; p < this.polydefs.length; p++)
		{
			let poly = this.polydefs[p][0]
			let p1 = this.cloud.get(poly.p1);
			let p2 = this.cloud.get(poly.p2);
			let p3 = this.cloud.get(poly.p3);
			let p4 = this.cloud.get(poly.p4);

			//This should probably be really fast, so I'll write it all out manually for now.
			if (p1.pub.x < xMin)
			{
				xMin = p1.pub.x; 
			}

			if (p1.pub.x > xMax)
			{
				xMax = p1.pub.x;
			}

			if (p2.pub.x < xMin)
			{
				xMin = p1.pub.x; 
			}

			if (p2.pub.x > xMax)
			{
				xMax = p1.pub.x;
			}

			if (p3.pub.x < xMin)
			{
				xMin = p1.pub.x; 
			}

			if (p3.pub.x > xMax)
			{
				xMax = p1.pub.x;
			}

			if (p4.pub.x < xMin)
			{
				xMin = p1.pub.x; 
			}

			if (p4.pub.x > xMax)
			{
				xMax = p1.pub.x;
			}



			if (p1.pub.y < yMin)
			{
				yMin = p1.pub.y; 
			}

			if (p1.pub.y > yMax)
			{
				yMax = p1.pub.y;
			}

			if (p2.pub.y < yMin)
			{
				yMin = p1.pub.y; 
			}

			if (p2.pub.y > yMax)
			{
				yMax = p1.pub.y;
			}

			if (p3.pub.y < yMin)
			{
				yMin = p1.pub.y; 
			}

			if (p3.pub.y > yMax)
			{
				yMax = p1.pub.y;
			}

			if (p4.pub.y < yMin)
			{
				yMin = p1.pub.y; 
			}

			if (p4.pub.y > yMax)
			{
				yMax = p1.pub.y;
			}



			if (p1.pub.z < zMin)
			{
				zMin = p1.pub.z; 
			}

			if (p1.pub.z > zMax)
			{
				zMax = p1.pub.z;
			}

			if (p2.pub.z < zMin)
			{
				zMin = p1.pub.z; 
			}

			if (p2.pub.z > zMax)
			{
				zMax = p1.pub.z;
			}

			if (p3.pub.z < zMin)
			{
				zMin = p1.pub.z; 
			}

			if (p3.pub.z > zMax)
			{
				zMax = p1.pub.z;
			}

			if (p4.pub.z < zMin)
			{
				zMin = p1.pub.z; 
			}

			if (p4.pub.z > zMax)
			{
				zMax = p1.pub.z;
			}
		}
		this.collider = {
			"xMin" : xMin,
			"xMax" : xMax,
			"yMin" : yMin,
			"yMax" : yMax,
			"zMin" : zMin,
			"zMax" : zMax
		};
	}

	// Allows you to blit a single polygon, as long as you know it's ID
	// Additionally, you can override textures, useful for select rendering jobs.
	blitPoly(id, x, y, z, texOverride)
	{
		// Grab point info.
		let poly = this.polydefs[id][0];
		let posX = x + this.pos.x;
		let posY = y + this.pos.y;
		let posZ = z + this.pos.z;

		let p1 = this.cloud.get(poly.p1).flatten(this.camera, posX, posY, posZ);
		let p2 = this.cloud.get(poly.p2).flatten(this.camera, posX, posY, posZ);
		let p3 = this.cloud.get(poly.p3).flatten(this.camera, posX, posY, posZ);
		let p4 = this.cloud.get(poly.p4).flatten(this.camera, posX, posY, posZ);
		
		// Grab or assign a texture.
		let texture = null;
		if(texOverride == undefined)
		{
			texture = this.polydefs[id][0].texture;
		} else {
			texture = texOverride;
		}
		
		// Textured render code.
		if(!this.mode.wireframe || this.mode.mixed)
		{
			this.camera.drawPoly([p1, p2, p3, p4], {"texture":texture, "flipped":poly.flipped}, this.mode);
		}
		
		// Wireframe render code.
		if(this.mode.wireframe || this.mode.mixed)
		{
			Line(p1.x, p1.y, p2.x, p2.y, CreateColor(255, 255, 255));
			Line(p2.x, p2.y, p3.x, p3.y, CreateColor(255, 255, 255));
			Line(p3.x, p3.y, p4.x, p4.y, CreateColor(255, 255, 255));
			Line(p4.x, p4.y, p1.x, p1.y, CreateColor(255, 255, 255));
		}
	}
	
	blit(x, y, z, reorder = false)
	{
		let xp = x + this.camera.pos.x;
		let yp = y + this.camera.pos.y;
		let zp = z + this.camera.pos.z;
		
		if(reorder)
		{
			this.reorder();
			// Count from 1 to 99.9 FM, The Rock!
		}
		
		for(let p = 0; p < this.polydefs.length; p++)
		{
			this.blitPoly(p, xp, yp, zp);
		}
	}
}