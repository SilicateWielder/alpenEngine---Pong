/*
 * AlpenEngine - scalingtex.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage and mipmap textures for candle.
 */

import { Thread } from 'sphere-runtime';

export default
class ScalingTex
{
	constructor(path)
	{
		this.levels = [];
		this.master = LoadImage(path);
	}
	
	transformBlit(p1, p2, p3, p4)
	{
		this.master.transformBlit(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
	}
}