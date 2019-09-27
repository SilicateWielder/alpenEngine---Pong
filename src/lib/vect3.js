/*
 * Candle Lib - Vect3.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage points in 3 dimensional space, ported from Candle
 */
 
import { Thread } from 'sphere-runtime';

export default
class Vector3
{
	constructor(x = 0, y = 0, z = 0)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.ratio = 1;
		
		this.pub = {}
		this.pub.x = x;
		this.pub.y = y;
		this.pub.z = z;
		
		this.flat = {};
		this.flat.x = 0;
		this.flat.y = 0;
		
		this.origin = {};
		
		this.rot = {};
		this.rot.x = 0;
		this.rot.y = 0;
		this.rot.z = 0;
	}

	// Rotates a vector
	rotate(rx, ry, rz, origin = {"x":0, "y":0, "z":0})
	{
		if (rx != this.rot.x || ry != this.rot.y || rz != this.rot.z || this.origin != origin)
		{
			this.origin = origin;
			this.rot.x = rx;
			this.rot.y = ry;
			this.rot.z = rz;
			
			let posX = this.x + origin.x;
			let posY = this.y + origin.y;
			let posZ = this.z + origin.z;
			
			// Calculate the ratio for degrees to radians
			let rxa = rx * this.ratio;
			let rya = ry * this.ratio;
			let rza = rz * this.ratio;

			let xca = smath.cos(rxa); //cosa
			let xsa = smath.sin(rxa); //sina
			
			let yca = smath.cos(rya); //cosb
			let ysa = smath.sin(rya); //sinb

			let zca = smath.cos(rza); //cosc
			let zsa = smath.sin(rza); //sinc

			// Rotate around the Y axis.
			let x1 = (yca * posX) - (ysa * posZ);
			let y1 = posY;
			let z1 = (ysa * posX) + (yca * posZ);
			
			// Rotate around the X axis.
			let x2 = x1;
			let y2 = (xca * y1) - (xsa * z1);
			let z2 = (xsa * y1) + (xca * z1);
			
			// Rotate around the Z axis.
			let x3 = (zca * x1) - (zsa * y2);
			let y3 = (zsa * x1) + (zca * y2);
			let z3 = z2;
				
			this.pub.x = x3;
			this.pub.y = y3;
			this.pub.z = z3;
		};
	};

	// Sets the current public positon of an object to it's reference positon.
	makeDefault()
	{
		this.x = this.pub.x;
		this.y = this.pub.y;
		this.z = this.pub.z;
	};

	// Allows adjustment of a vector, reseting any arbitrary values.
	adjust(x, y, z)
	{
		this.pub.x = x;
		this.pub.y = y;
		this.pub.z = z;
		
		this.x = x;
		this.y = y;
		this.z = z;
		
		this.rot.x = 0;
		this.rot.y = 0;
		this.rot.z = 0;
	};

	// Retrieves 2d coordinates of a vector.
	flatten(camera, x, y, z)
	{
		let flatCoords = camera.project(this.pub.x + x, this.pub.y + y, this.pub.z + z);
	
		this.flat.x = flatCoords.x;
		this.flat.y = flatCoords.y;
		
		return({"x":this.flat.x, "y":this.flat.y});
	}

	blit(x, y)
	{
		this.flatten();
		Rectangle(x + this.flat.x, y + this.flat.y, 3, 3, colors.get(255, 0 ,255));
	};
}
