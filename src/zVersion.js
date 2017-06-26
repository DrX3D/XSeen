/*
 * XSeen JavaScript Library
 * http://tools.realism.com/...
 *
 * (C)2017 Daly Realiusm, Los Angeles
 * Dual licensed under the MIT and GPL
 *
 */

/*
 * Version Information for XSeen
 */
xseen.generateVersion = function () {
	var Major, Minor, Patch, PreRelease, Release, Date, SpashText;
	Major		= 0;
	Minor		= 4;
	Patch		= 1;
	PreRelease	= '';
	Release		= 14;
	Version		= '';
	Date		= '2017-06-25';
	SplashText	= ["XSeen 3D Language parser.", "XSeen <a href='http://tools.realism.com/specification/xseen' target='_blank'>Documentation</a>."];
/*
 * All X3D and A-Frame pre-defined solids, fixed camera, directional light, Material texture only, glTF model loader with animations, Assets and reuse, Viewpoint, Background, Lighting, Image Texture, [Indexed]TriangleSet, IndexedFaceSet, [Indexed]QuadSet<br>\nNext work<ul><li>Event Model/Animation</li><li>Extrusion</li><li>Navigation</li></ul>",
 *
 * V0.4.0+13 Feature -- events (at least from HTML to XSeen
 * V0.4.1+14 Fix - minor text correction in xseen.node.geometry__TriangulateFix (nodes-x3d_Geometry.js)
 * V0.4.1+15 Modified build.pl to increase compression by removing block comments
 */
	var version = {
		major		: Major,
		minor		: Minor,
		patch		: Patch,
		preRelease	: PreRelease,
		release		: Release,
		version		: '',
		date		: Date,
		splashText	: SplashText
	};
// Using the scheme at http://semver.org/
	version.version = version.major + '.' + version.minor + '.' + version.patch;
	version.version += (version.preRelease != '') ? '-' + version.preRelease : '';
	version.version += (version.release != '') ? '+' + version.release : '';
	return version;
}