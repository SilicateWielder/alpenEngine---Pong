/*
 * AlpenEngine - camera.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to control rendering of 3d Space
 */
 
import { Thread } from 'sphere-runtime';

import Culler from './culler.js';
import ScalingTex from './scalingtex.js';
import Lighting from './lighting.js';

export default
class Camera
{
	constructor(width = GetScreenWidth(), height = GetScreenHeight(), x, y, z, rx, ry, rz)
	{	
		// Field of view parameter, adjustable.
		this.fov = 900
		
		// Define the position and rotation of the camera
		this.pos = {"x":x, "y":y, "z":z};
		this.rot = {"x":rx, "y":ry, "z":rz};
		
		// Find the origin on the camera.
		this.mid = {};
		this.mid.x = width / 2;
		this.mid.y = height / 2;
		
		this.texData = [];
		this.pntData = [];
		this.linData = [];
	}
	
	move(x, y, z)
	{
		this.pos = {"x":x, "y":y, "z":z};
	}
	
	roll(x, y, z)
	{
		if (x > 0);
		{
			if(this.rot.x + x <= 360)
			{
				this.rot.x += x;
			} else {
				this.rot.x = 361 - (this.rot.x + x);
			}
		}
		
		if (y > 0);
		{
			if(this.rot.y + y <= 360)
			{
				this.rot.y += y;
			} else {
				this.rot.y = 361 - (this.rot.y + y);
			}
		}
		
		if (z > 0);
		{
			if(this.rot.z + z <= 360)
			{
				this.rot.z += z;
			} else {
				this.rot.z = 361 - (this.rot.z + z);
			}
		}
	}
	
	getDist(x, y, z)
	{
		let distance = this.fov / (this.fov + z);
	
		// Ensure that the distance isn't zero, if it is we wake up the I N S E C T S.
		if (distance < 0)
		{
			distance = 0.00001;
		};
		
		return distance;
	}
	
	// Projects 3d coordinates onto a 2d plane.
	project(x, y, z, scale = 0)
	{
		let scaleFactor = scale;
		
		if(scale == 0)
		{
			scaleFactor = this.getDist(x, y, z);
		}
		
		let outputX = (x * scaleFactor) + this.mid.x;
		let outputY = (y * scaleFactor) + this.mid.y;
		
		return({"x":outputX, "y":outputY});
	}
	
	// Draws a dot in 3d space.
	drawPoint(x, y, z)
	{
		let pos = this.project(x, y, z);
		
		Rectangle(pos.x, pos.y, 1, 1, fcolors.create(255, 255, 255));
	}
	
	// Draws a polygon, points are contains in an array listing x y z values in each entry, polydata lists .texture and .flipped information
	// Mode contains mode information such as backcull or zsort in the form of booleans
	drawPoly(points, polydata, mode)
	{
		// Check if renderable.
		let render = true;
		if(mode.backcull)
		{
			render = Culler.backface(points, polydata.flipped);
		}
		
		// If the polygon is flipped, invert the render status.
		if(polydata.flipped && mode.backcull)
		{
			render = !render;
		}
		
		// If renderable, render it!
		if(render)
		{
			polydata.texture.transformBlit(points[0], points[1], points[2], points[3]);
		}
	}
}