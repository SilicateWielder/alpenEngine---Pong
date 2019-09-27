/*
 * AlpenEngine - Vect3.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage points in 3 dimensional space, ported to the Sphere V2 API from Candle.
 */
 
import { Thread } from 'sphere-runtime';

export default
class Smath extends Thread
{
	constructor(precision = 0.5, limit = 360)
	{
		super();  // call the superclass constructor
		
		let ratio = (3.14159265 / 180);
		this.cosIndex = [];
		this.sinIndex = [];
		
		for (let flt = 0; flt <= limit; flt += precision)
		{
			this.cosIndex[flt] = Math.cos(flt * ratio);
			this.sinIndex[flt] = Math.sin(flt * ratio);
		}
		
		print("SMath Calibrated.");
	}
	
	cos(val)
	{
		return(this.cosIndex[val]);
	}
	
	sin(val)
	{
		return(this.sinIndex[val]);
	}
}