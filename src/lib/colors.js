/*
 * AlpenEngine - colors.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to more efficiently handle colors
 */
 
import { Thread } from 'sphere-runtime';

export default
class FastColors extends Thread
{
	constructor()
	{
		super();
		
		// Reference color for generating temporary colors.
		this.ref = CreateColor(0, 0, 0, 0);
		
		// Color table
		this.colors = [];
		this.colorsNew = [];
	}
	
	// Create a color and return it
	create(r, g, b, a = 255, type = false)
	{
		let id = r + (g<<8) + (b<<16) + (a<<24);

		if (this.colors[id] == null)
		{
			this.colors[id] = CreateColor(r, g, b, a);
			this.colorsNew[id] = new Color(r, g, b, a);
		}
		
		if(type)
		{
			return this.colorsNew[id];
		} else {
			return this.colors[id];
		}
	}

	// Create a temporary color and return it.
	temp(r, g, b, a = 255)
	{
		this.ref.red = r;
		this.ref.green = g; 
		this.ref.blue = b; 
		this.ref.alpha = a;

		return this.ref;
	}
}
