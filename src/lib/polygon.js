/*
 * Candle Lib - polygon.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage polygons
 */
 
import { Thread } from 'sphere-runtime';

export default
class Polygon
{
	constructor(cloud, p1, p2, p3, p4, flipped, texture)
	{
		this.cloud = cloud
		this.texture = texture;
		this.flipped = flipped;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;
	}
	
	findDistance(x, y, z)
	{
		//Do a thing!
	}
}