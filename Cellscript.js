/*
 * this is your game's Cellscript, used to instruct the Cell compiler how to
 * build your game.  like a Sphere game, the Cellscript is written in
 * JavaScript, however with a different set of functions tailored for compiling
 * and packaging games.
 */


// describe the game we're building.  everything in Sphere.Game gets written to
// the game manifest (game.json) at the end of the build.

Object.assign(Sphere.Game,
{
	// target the Sphere v2 API.
	version: 2,

	// the lowest API level your code requires.  if a game's targeted API level
	// isn't supported by the version of the engine used to run it, an error
	// message will be displayed to let the user know they need to upgrade.
	apiLevel: 1,

	name: "AlpenEngine - Pong",
	author: "Michael Warner",
	summary: "Successor to Candle, an improved 3d graphics library based on the lessons learned from Candle",
	resolution: '1920x720',

	// the SphereFS path of the JavaScript module used to bootstrap the game.
	// if the main module has a callable default export, that export will be
	// called automatically.  if the default export is a class, the class will
	// be instantiated using `new` and `.start()` will be called on the
	// resulting object.
	main: '@/scripts/main.js',
});


// this tells Cell which files to copy from the source tree when packaging the
// game.  see the Cell API documentation for more information.  in general:
//
//     install(destDir, files(filter[, recursive]));
//
// note: path qualifier `@/` is required to specify a file or directory within
//       the game package being built.  in Cell, a bare path, e.g.
//       `path/to/file`, is relative to the location of the Cellscript, not the
//       game's JSON manifest like in Sphere.

install('@/scripts', files('src/*.js'));
install('@/scripts', files('src/lib/*.js'));

install('@/images', files('images/*.jpg', true));
install('@/images/textures', files('images/textures/*.pcx', true));
install('@/images/textures', files('images/textures/*.png', true));

install('@/music',  files('music/*.ogg', true));

install('@/', files('fonts/*.rfn', true));
install('@/',       files('icon.png'));
