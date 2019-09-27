/*
 * Candle Lib - polygon.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage polygons
 */
 
import { Thread } from 'sphere-runtime';

export default
class Lighting
{
	constructor(x, y, z, color)
	{
		this.color = color;
		
		this.pos = {"x":x, "y":y, "z":z};
	}
	
	findDistance(x, y, z)
	{
	    let distX = v1.x - v2.x;
		let distY = v1.y - v2.y;
		let distZ = v1.z - v2.z;

		return Math.sqrt( distX * distX + distY * distY + distZ * distZ );
	}
}