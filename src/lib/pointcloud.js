/*
 * Candle Lib - Vect3.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage groups of points in 3 dimensional space
 */
 
import { Thread } from 'sphere-runtime';
import Vector3 from './vect3.js';

function bubbleSort(obj, arr)
{
	//print(arr);
	let objC = Object.values(obj);
	var len = objC.length;
	for (let i = len-1; i>=0; i--){
		for(var j = 1; j<=i; j++){
			if(objC[j-1][0].pub.z > objC[j][0].pub.z){
				var temp = objC[j-1];
				objC[j-1] = objC[j];
				objC[j] = temp;
			}
		}
	}
	
	for(let i = 0; i < len; i++)
	{
		arr[i] = objC[i][1];
	}
	//print(arr);
	return arr;
}

export default
class PointCloud
{
	constructor()
	{
		this.points = [];
		this.ids = [];
		
		this.rot = {"x":0, "y":0, "z":0};
		this.offset = {"x":0, "y":0, "z":0};
	}
	
	generateID(x, y, z)
	{
		return(x + "&" + y + "&" + z);
	}
	
	addPoint(x, y, z)
	{
		let id = this.generateID(x, y, z);
			
		this.points[id] = [new Vector3(x, y, z), id];
		this.ids.push(id);
		
		let index = this.ids.length - 1;
		if (index < 0)
		{
			index = 0;
		}
		
		return index;
	}
	
	rotate(rx, ry, rz, offX, offY, offZ)
	{
		if(rx != this.rot.x || ry != this.rot.y || rz != this.rot.z)
		{
			for(let p = 0; p < this.ids.length; p++)
			{
				let id = this.ids[p];
			
				this.points[id][0].rotate(rx, ry, rz, {"x":offX,"y":offY,"z":offZ});
			}
		}
	}
	
	reorder()
	{
		bubbleSort(this.points, this.ids);
	}
		
	blit()
	{
		for(let p = 0; p < this.ids.length; p++)
		{
			let id = this.ids[p];
			
			let pos = this.points[id];
			cam.drawPoint(pos.pub.x, pos.pub.y, pos.pub.z);
		}
	}
	
	get(id)
	{
		return this.points[this.ids[id]][0];
	}
	
	getPos(id)
	{
		return this.points[this.ids[id]][0].pub;
	}

	setPos(id, x, y, z)
	{
		this.points[this.ids[id]][0].adjust(x, y, z);
	}
}