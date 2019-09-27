import { Thread } from 'sphere-runtime';

export default
class Culler
{
	static backface(poly, backwards = false)
	{
	    let cullable = true;
		let cullVal = -8 // threshold at which to cull a polygon.

		let caseA = (poly[1].x - poly[0].x) * (poly[1].y + poly[0].y);
		let caseB = (poly[2].x - poly[1].x) * (poly[2].y + poly[1].y);
		let caseC = (poly[3].x - poly[2].x) * (poly[3].y + poly[2].y);
		let caseD = (poly[0].x - poly[3].x) * (poly[0].y + poly[3].y);
		let sum = caseA + caseB + caseC + caseD;
		if (sum < cullVal)
		{
			cullable = false;
			
		}
		
		if(cullable && backwards)
		{
			cullable = false;
		}

		return (cullable);
	}
}