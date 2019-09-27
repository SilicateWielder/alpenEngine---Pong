/*
 *  AlpenEngine v0.0.1
 *  (c) 2019 Michael Warner
 * 
 * This was uploaded by request, I've added experimental worldspaces to this version of Alpen.
 * Some things probably may behave weirdly or unpredictably if modified unless you avoid using the worldpsace API.
 */

import { Thread } from 'sphere-runtime';

import FastColors from './colors.js';
import Smath from './smath.js';

import ScalingTex from './scalingtex.js';

import Scene from './worldspace.js';

export default
class MyGame extends Thread
{
	constructor()
	{
		super();  // call the superclass constructor

		//Required for vect3 to work.
		global.smath = new Smath();

		// Create a new space for the rendering engine.
		// It is possible to render without this, but you'll have to implement your own collision detection systems and whatnot.
		// as well as any other systems that the Scene object provides. 
		global.space = new Scene();

		// Load up pong textures.
		global.tRed = new ScalingTex('textures/red.png');
		global.tBlu = new ScalingTex('textures/blue.png');
		global.tWht = new ScalingTex('textures/white.png');
		
		//global.font = new Font("ibm_iso9.rfn");
		/* If you want to use this font You can find it at https://int10h.org/oldschool-pc-fonts/fontlist/
		 * Conversion will need to be done using the old sphere studio (v1.5) or an equivalent tool
		 * Just make sure to comment out the line below. and uncomment the line specifying the font used.
		 */
		global.font = Font.Default;
		
		
		global.fcolors = new FastColors();

		// Field settings.
		global.fieldWidth = 250;
		global.fieldHeight = 180;

		//Define game objects.
		global.ball = {};
		global.ball.px = 1;
		global.ball.py = 1;
		global.ball.vx = 2;
		global.ball.vy = 0;

		global.p1 = {};
		global.p1.px = -fieldWidth - 25;
		global.p1.py = 0;
		global.p1.acc = 1;
		global.p1.off = 0;
		global.p1.score = 0;
		
		global.p2 = {};
		global.p2.px = fieldWidth + 25;
		global.p2.py = 0;
		global.p2.acc = 1;
		global.p2.score = 0;

		// Game logic states
		global.state = {};
		global.state.turn = "PLAYER";

		// AI settings.
		global.maxError = 250;
		global.correction = 10;
		global.correctionDefault = 20;
		global.slipChance = 99;
		
		// Begin generating AI's paddle.
		space.addPoint(-30, -100, -100);
		space.addPoint(-30, 100, -100);
		space.addPoint(30, 100, -100);
		space.addPoint(30, -100, -100);
		
		space.addPoint(-30, -100, 100);
		space.addPoint(-30, 100, 100);
		space.addPoint(30, 100, 100);
		space.addPoint(30, -100, 100);
		space.definePoly([0, 1, 2, 3], tRed);
		space.definePoly([7, 6, 5, 4], tRed);
		space.definePoly([4, 5, 1, 0], tRed);
		space.definePoly([6, 7, 3, 2], tRed);
		space.definePoly([5, 6, 2, 1], tRed);
		space.definePoly([0, 3, 7, 4], tRed);
		global.p1.modelId = space.finalizeModel(0, 0, 0);
		space.getModel(global.p1.modelId).mode.mixed = true;
		space.clearCache();

		// Begin generating Player's paddle.
		space.addPoint(-30, -100, -100);
		space.addPoint(-30, 100, -100);
		space.addPoint(30, 100, -100);
		space.addPoint(30, -100, -100);
		
		space.addPoint(-30, -100, 100);
		space.addPoint(-30, 100, 100);
		space.addPoint(30, 100, 100);
		space.addPoint(30, -100, 100);
		space.definePoly([0, 1, 2, 3], tBlu);
		space.definePoly([7, 6, 5, 4], tBlu);
		space.definePoly([4, 5, 1, 0], tBlu);
		space.definePoly([6, 7, 3, 2], tBlu);
		space.definePoly([5, 6, 2, 1], tBlu);
		space.definePoly([0, 3, 7, 4], tBlu);
		global.p2.modelId = space.finalizeModel(0, 0, 0);
		space.getModel(global.p2.modelId).mode.mixed = true;
		space.clearCache();

		// Begin generating ball.
		space.addPoint(-20, -20, -20);
		space.addPoint(-20, 20, -20);
		space.addPoint(20, 20, -20);
		space.addPoint(20, -20, -20);

		space.addPoint(-20, -20, 20);
		space.addPoint(-20, 20, 20);
		space.addPoint(20, 20, 20);
		space.addPoint(20, -20, 20);
		space.definePoly([0, 1, 2, 3], tWht);
		space.definePoly([7, 6, 5, 4], tWht);
		space.definePoly([4, 5, 1, 0], tWht);
		space.definePoly([6, 7, 3, 2], tWht);
		space.definePoly([5, 6, 2, 1], tWht);
		space.definePoly([0, 3, 7, 4], tWht);
		global.ball.modelId = space.finalizeModel(0, 0 ,0);
		space.getModel(global.ball.modelId).mode.mixed = true;
		space.clearCache();
	}

	on_update()
	{
		//space.camera.rot.x = 15;
		//space.camera.rot.y = 15;
		//space.camera.rot.y += 1;
		// set player's paddle position.
		let paddlePos = Mouse.Default.y - (720 / 2);
		global.p2.py = paddlePos;
		global.ball.px += global.ball.vx;
		global.ball.py += global.ball.vy;

		// Bot paddle tracking.
		if(global.p1.off != global.p1.acc)
		{
			let adjust = (global.p1.acc - global.p1.off)/global.correction;
			global.p1.off += adjust;
		}
		global.p1.py = global.ball.py + global.p1.off;

		// Bot correction adjustment.
		if(Math.random() * 100 > global.slipChance)
		{
			print("adjusting...")
			global.p1.acc += ((Math.random() * 50) - 25);
			global.correction = (Math.random() * 100) + 50;
			print(global.p1.acc);
		};

		// Logic start
		let playerDist = Math.abs(paddlePos - global.ball.py);
		let botDist = Math.abs(global.p1.py - global.ball.py);

		if(global.ball.py >= fieldHeight || global.ball.py <= -fieldHeight)
		{
			global.ball.vy = global.ball.vy * -1;
		}

		//print(global.state.turn);
		if(global.state.turn == "PLAYER")
		{
			//print("ImprovedPLAYERS TURN");
			if (global.ball.px >= fieldWidth)
			{
				//print("HIT");
				if(playerDist <= 100)
				{
					global.ball.vx = global.ball.vx * -1;
					global.ball.vy = (paddlePos/100 * -2);
					global.state.turn = "BOT";

					global.p1.acc = (Math.random() * global.maxError) - (global.maxError/ 2);
					global.correction = correctionDefault;
				} else {
					global.ball.px = 0; global.ball.py = 0;
					global.ball.vx = 2;
					global.ball.vy = Math.random() * 2;
					global.p1.score += 1;

					global.p1.acc = (Math.random() * global.maxError) - (global.maxError/ 2);
					global.correction = correctionDefault;
				}
			}
		} else {
			//print("BOTS TURN");
			if (global.ball.px <= -fieldWidth)
			{
				//print("HIT");
				if(botDist <= 100)
				{
					global.ball.vx = global.ball.vx * -1;
					global.ball.vy = (paddlePos/100 * -2);
					global.state.turn = "PLAYER";

					global.p1.acc = (Math.random() * global.maxError) - (global.maxError/ 2);
					global.correction = correctionDefault;
				} else {
					global.ball.px = 0; global.ball.py = 0;
					global.ball.vx = 2;
					global.ball.vy = Math.random() * 2;
					global.state.turn = "PLAYER";
					global.p2.score += 1;

					global.p1.acc = (Math.random() * global.maxError) - (global.maxError/ 2);
					global.correction = correctionDefault;
				}
			}
		}
		// Logic End.
	}

	on_render()
	{
		// Move all objects to their appropriate position.
		//space.placeModel(global.p1.modelId, global.p1.px, global.p1.py, 0, 0);
		space.getModel(global.p1.modelId).move(p1.px, p1.py, 0);
		space.getModel(global.p2.modelId).move(global.p2.px, global.p2.py, 0);
		space.getModel(global.ball.modelId).move(global.ball.px, global.ball.py, 0);
		//space.placeModel(global.p2.modelId, global.p2.px, global.p2.py, 0, 0);
		//space.placeModel(global.ball.modelId, global.ball.px, global.ball.py, 0);
		
		// Render scene.
		space.blit();
		
		font.drawText(Surface.Screen, 1, 1, "BOT: " + p1.score + " PLAYER: " + p2.score);
	}
}
