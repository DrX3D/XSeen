/*
 *  XSeen V0.8.1+8_29dcffa
 *  Built Mon Aug 19 15:28:19 2019
 *

Dual licensed under the MIT and GPL licenses.

==[MIT]====================================================================
Copyright (c) 2017, Daly Realism

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


==[GPL]====================================================================

XSeen - Declarative 3D for HTML

Copyright (C) 2017, Daly Realism
                                                                       
This program is free software: you can redistribute it and/or modify   
it under the terms of the GNU General Public License as published by   
the Free Software Foundation, either version 3 of the License, or      
(at your option) any later version.                                    
                                                                       
This program is distributed in the hope that it will be useful,        
but WITHOUT ANY WARRANTY; without even the implied warranty of         
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the          
GNU General Public License for more details.                           
                                                                       
You should have received a copy of the GNU General Public License      
along with this program.  If not, see <http://www.gnu.org/licenses/>.


=== COPYRIGHT +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Copyright (C) 2017, Daly Realism for XSeen
Copyright, Fraunhofer for X3DOM
Copyright, Mozilla for A-Frame
Copyright, THREE and Khronos for various parts of THREE.js
Copyright (C) 2017, John Carlson for JSON->XML converter (JSONParser.js)

===  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 */
/*
#        88: ./CameraManager.js
#       248: ./Constants.js
#       438: ./DisplayControl.js
#       825: ./Events.js
#      1413: ./IW.js
#      1466: ./Loader.js
#      1818: ./Logging.js
#      1956: ./onLoad.js
#      2388: ./Tag.js
#      3213: ./XSeen.js
#      3419: tags/$.js
#      3488: tags/animate.js
#      3898: tags/asset.js
#      3926: tags/background.js
#      4284: tags/camera.js
#      4498: tags/cubemap.js
#      4648: tags/fog.js
#      4731: tags/group.js
#      4834: tags/label.js
#      5020: tags/light.js
#      5125: tags/metadata.js
#      5234: tags/model.js
#      5482: tags/scene.js
#      5595: tags/solids.js
#      6650: tags/style3d.js
#      6833: tags/subscene.js
*/
// File: ./CameraManager.js
/*
 * XSeen JavaScript library
 *
 * (c)2018, Daly Realism, Los Angeles
 *
 * Dual licensed under the MIT and GPL
 */

 
/*
 * XSeen Camera Manager.
 * This object is the manager for all XSeen cameras.
 *
 * provides method for the addition and selection of a camera for scene viewing
 *
 *
 *
 */

var XSeen = XSeen || {};
XSeen.CameraManager = {
		'PRIORITY_MINIMUM'	: 0,
		'PRIORITY_DEFAULT'	: 1,
		'FOV'				: 50,		// Vertical field-of-view
		'NearClip'			: 0.1,
		'FarClip'			: 10000,
		'DefinedCameras'	: [],		// Contains references to camera nodes ...[priority][order]
		'CurrentNode'		: null,
		
/*
 * Create or reset the standard XSeen camera from THREE
 */
		'create'			: function (aspectRatio)
					{
						camera = new THREE.PerspectiveCamera( this.FOV, aspectRatio, this.NearClip, this.FarClip );
						return camera;
					},
		'reset'				: function (camera, aspectRatio)
					{
						camera.aspect = aspectRatio;
						camera.far = this.FarClip;
						camera.fov = this.FOV;
						camera.near = this.NearClip;
						camera.updateProjectionMatrix ();
						return camera;
					},
/*
 * Add an XSene camera. This is really a set of parameters defined by the 'camera' tag.
 */
		'add'				: function (camera)
					{
						XSeen.LogVerbose ('Adding camera#' + camera.id + ' to the list');
						if (typeof(this.DefinedCameras[camera._xseen.priority]) == 'undefined') {this.DefinedCameras[camera._xseen.priority] = [];}
						this.DefinedCameras[camera._xseen.priority].push (camera);
						camera._xseen.ndxCamera = this.DefinedCameras[camera._xseen.priority].length - 1;
						camera.setActive = function() {
							camera._xseen.sceneInfo.ViewManager.setActive (this);
						}
						XSeen.LogVerbose ('.. returning from camera.add');
					},

/*
 * Returns the currently available highest priority camera.
 *	This always returns a camera because the DEFAULT camera is always available
 */
		'next'				: function ()
					{
						for (var p=this.DefinedCameras.length-1; p>=this.PRIORITY_MINIMUM; p--) {
							if (typeof(this.DefinedCameras[p]) != 'undefined') {
								for (var ii=0; ii<this.DefinedCameras[p].length; ii++) {
									if (this.DefinedCameras[p][ii]._xseen.available) {return this.DefinedCameras[p][ii];}
								}
							}
						}
						return this.DefinedCameras[this.PRIORITY_MINIMUM][0];	// System default
					},

/*
 * Activate a specific camera
 *	camera - The DOM element for the 'camera' tag to be activated
 *
 *	This method "knows" about the structure of XSeen's Runtime object
 */
		'setActive'			: function (cameraElement)
					{
						if (cameraElement === null) {return;}
						if (this.CurrentNode !== null) {this.CurrentNode._xseen.active = false;}
						cameraElement._xseen.active = true;
						var xRuntime = cameraElement._xseen.sceneInfo;
						this.reset (xRuntime.Camera, xRuntime.Size.aspect);
						
						if (cameraElement._xseen.isStereographic) {
							xRuntime.Renderer = xRuntime.RendererStereo;
							xRuntime.rendererHasControls = false;
							xRuntime.isStereographic = true;
							// Need to add a button to the display to go full screen
						} else {
							xRuntime.Renderer = xRuntime.RendererStandard;
							xRuntime.rendererHasControls = cameraElement._xseen.rendererHasControls;
							xRuntime.isStereographic = false;

							xRuntime.Renderer.setScissorTest( false );
							var size = xRuntime.Renderer.getSize();
							xRuntime.Renderer.setScissor( 0, 0, size.width, size.height );
							xRuntime.Renderer.setViewport( 0, 0, size.width, size.height );
							if (cameraElement._xseen.track == 'orbit') {
								cameraElement._xseen.sceneInfo.CameraControl.enabled = true;	// Enable ORBIT controls access to events
							}
							//xRuntime.Renderer.render( scene, xRuntime.Camera );
							// Need to remove any 'full screen' button
						}
						
						xRuntime.Camera.position.set (
									cameraElement._xseen.attributes.position.x,
									cameraElement._xseen.attributes.position.y,
									cameraElement._xseen.attributes.position.z);
						xRuntime.Camera.lookAt(0,0,0);		// Look at origin. Seems to be required for object type.
						xRuntime.Camera.fov = cameraElement._xseen.attributes.fov;


						// TODO: A number of other things need to be set/changed (tracking, type, etc.)
						xRuntime.useDeviceOrientation = cameraElement._xseen.useDeviceOrientation;
						

						if (!cameraElement._xseen.rendererHasControls) {
							if (xRuntime.useDeviceOrientation) {	// Device controls camera. Set focus point
								if (cameraElement._xseen.track == 'object') {	// tracking scene object
									xRuntime.CameraControl = new THREE.DeviceOrientationControls(cameraElement._xseen.target, true);
								} else {							// tracking environment
									xRuntime.CameraControl = new THREE.DeviceOrientationControls(xRuntime.Camera);
								}

							} else {											// No device orientation control. Use something else
								if (cameraElement._xseen.track == 'orbit') {
									xRuntime.CameraControl = new THREE.OrbitControls( xRuntime.Camera, xRuntime.RendererStandard.domElement );
								} else if (cameraElement._xseen.track == 'trackball') {
									//console.log ('Trackball');
								} else if (cameraElement._xseen.track == 'none') {
									//console.log ('No tracking');
									xRuntime.rendererHasControls = true;
								} else {
									XSeen.LogDebug ('Something else');
								}
							}
						}
						xRuntime.Camera.updateProjectionMatrix();
						XSeen.LogVerbose ('Setting active camera to ' + cameraElement.id);
						this.CurrentNode = cameraElement;
					},
					
		'setNext'			: function ()
					{
						var camera = this.next();
						this.setActive (camera);
						
						XSeen.LogVerbose ('Activating camera ID: ' + camera.id + ' with controls: ' + camera._xseen.sceneInfo.rendererHasControls);
						//this.CurrentNode = camera;
					}
};
// File: ./Constants.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/*
 *	Define various constants for use within XSeen.
 *	Constants include conversion factors and colors (official color names with their hex equivalents)
 *	ColorsCS is the case sensitive (official) version
 *	Colors is the lowercase version
 */

XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;
XSeen.DefineConstants = function () {
	var ColorsCS = new Object(), Colors = new Object();
	ColorsCS = {
		'AliceBlue'			: 0xF0F8FF,
		'AntiqueWhite'		: 0xFAEBD7,
		'Aqua'				: 0x00FFFF,
		'Aquamarine'		: 0x7FFFD4,
		'Azure'				: 0xF0FFFF,
		'Beige'				: 0xF5F5DC,
		'Bisque'			: 0xFFE4C4,
		'Black'				: 0x000000,
		'BlanchedAlmond'	: 0xFFEBCD,
		'Blue'				: 0x0000FF,
		'BlueViolet'		: 0x8A2BE2,
		'Brown'				: 0xA52A2A,
		'BurlyWood'			: 0xDEB887,
		'CadetBlue'			: 0x5F9EA0,
		'Chartreuse'		: 0x7FFF00,
		'Chocolate'			: 0xD2691E,
		'Coral'				: 0xFF7F50,
		'CornflowerBlue'	: 0x6495ED,
		'Cornsilk'			: 0xFFF8DC,
		'Crimson'			: 0xDC143C,
		'Cyan'				: 0x00FFFF,
		'DarkBlue'			: 0x00008B,
		'DarkCyan'			: 0x008B8B,
		'DarkGoldenRod'		: 0xB8860B,
		'DarkGray'			: 0xA9A9A9,
		'DarkGrey'			: 0xA9A9A9,
		'DarkGreen'			: 0x006400,
		'DarkKhaki'			: 0xBDB76B,
		'DarkMagenta'		: 0x8B008B,
		'DarkOliveGreen'	: 0x556B2F,
		'DarkOrange'		: 0xFF8C00,
		'DarkOrchid'		: 0x9932CC,
		'DarkRed'			: 0x8B0000,
		'DarkSalmon'		: 0xE9967A,
		'DarkSeaGreen'		: 0x8FBC8F,
		'DarkSlateBlue'		: 0x483D8B,
		'DarkSlateGray'		: 0x2F4F4F,
		'DarkSlateGrey'		: 0x2F4F4F,
		'DarkTurquoise'		: 0x00CED1,
		'DarkViolet'		: 0x9400D3,
		'DeepPink'			: 0xFF1493,
		'DeepSkyBlue'		: 0x00BFFF,
		'DimGray'			: 0x696969,
		'DimGrey'			: 0x696969,
		'DodgerBlue'		: 0x1E90FF,
		'FireBrick'			: 0xB22222,
		'FloralWhite'		: 0xFFFAF0,
		'ForestGreen'		: 0x228B22,
		'Fuchsia'			: 0xFF00FF,
		'Gainsboro'			: 0xDCDCDC,
		'GhostWhite'		: 0xF8F8FF,
		'Gold'				: 0xFFD700,
		'GoldenRod'			: 0xDAA520,
		'Gray'				: 0x808080,
		'Grey'				: 0x808080,
		'Green'				: 0x008000,
		'GreenYellow'		: 0xADFF2F,
		'HoneyDew'			: 0xF0FFF0,
		'HotPink'			: 0xFF69B4,
		'IndianRed '		: 0xCD5C5C,
		'Indigo '			: 0x4B0082,
		'Ivory'				: 0xFFFFF0,
		'Khaki'				: 0xF0E68C,
		'Lavender'			: 0xE6E6FA,
		'LavenderBlush'		: 0xFFF0F5,
		'LawnGreen'			: 0x7CFC00,
		'LemonChiffon'		: 0xFFFACD,
		'LightBlue'			: 0xADD8E6,
		'LightCoral'		: 0xF08080,
		'LightCyan'			: 0xE0FFFF,
		'LightGoldenRodYellow'	: 0xFAFAD2,
		'LightGray'			: 0xD3D3D3,
		'LightGrey'			: 0xD3D3D3,
		'LightGreen'		: 0x90EE90,
		'LightPink'			: 0xFFB6C1,
		'LightSalmon'		: 0xFFA07A,
		'LightSeaGreen'		: 0x20B2AA,
		'LightSkyBlue'		: 0x87CEFA,
		'LightSlateGray'	: 0x778899,
		'LightSlateGrey'	: 0x778899,
		'LightSteelBlue'	: 0xB0C4DE,
		'LightYellow'		: 0xFFFFE0,
		'Lime'				: 0x00FF00,
		'LimeGreen'			: 0x32CD32,
		'Linen'				: 0xFAF0E6,
		'Magenta'			: 0xFF00FF,
		'Maroon'			: 0x800000,
		'MediumAquaMarine'	: 0x66CDAA,
		'MediumBlue'		: 0x0000CD,
		'MediumOrchid'		: 0xBA55D3,
		'MediumPurple'		: 0x9370DB,
		'MediumSeaGreen'	: 0x3CB371,
		'MediumSlateBlue'	: 0x7B68EE,
		'MediumSpringGreen'	: 0x00FA9A,
		'MediumTurquoise'	: 0x48D1CC,
		'MediumVioletRed'	: 0xC71585,
		'MidnightBlue'		: 0x191970,
		'MintCream'			: 0xF5FFFA,
		'MistyRose'			: 0xFFE4E1,
		'Moccasin'			: 0xFFE4B5,
		'NavajoWhite'		: 0xFFDEAD,
		'Navy'				: 0x000080,
		'OldLace'			: 0xFDF5E6,
		'Olive'				: 0x808000,
		'OliveDrab'			: 0x6B8E23,
		'Orange'			: 0xFFA500,
		'OrangeRed'			: 0xFF4500,
		'Orchid'			: 0xDA70D6,
		'PaleGoldenRod'		: 0xEEE8AA,
		'PaleGreen'			: 0x98FB98,
		'PaleTurquoise'		: 0xAFEEEE,
		'PaleVioletRed'		: 0xDB7093,
		'PapayaWhip'		: 0xFFEFD5,
		'PeachPuff'			: 0xFFDAB9,
		'Peru'				: 0xCD853F,
		'Pink'				: 0xFFC0CB,
		'Plum'				: 0xDDA0DD,
		'PowderBlue'		: 0xB0E0E6,
		'Purple'			: 0x800080,
		'RebeccaPurple'		: 0x663399,
		'Red'				: 0xFF0000,
		'RosyBrown'			: 0xBC8F8F,
		'RoyalBlue'			: 0x4169E1,
		'SaddleBrown'		: 0x8B4513,
		'Salmon'			: 0xFA8072,
		'SandyBrown'		: 0xF4A460,
		'SeaGreen'			: 0x2E8B57,
		'SeaShell'			: 0xFFF5EE,
		'Sienna'			: 0xA0522D,
		'Silver'			: 0xC0C0C0,
		'SkyBlue'			: 0x87CEEB,
		'SlateBlue'			: 0x6A5ACD,
		'SlateGray'			: 0x708090,
		'SlateGrey'			: 0x708090,
		'Snow'				: 0xFFFAFA,
		'SpringGreen'		: 0x00FF7F,
		'SteelBlue'			: 0x4682B4,
		'Tan'				: 0xD2B48C,
		'Teal'				: 0x008080,
		'Thistle'			: 0xD8BFD8,
		'Tomato'			: 0xFF6347,
		'Turquoise'			: 0x40E0D0,
		'Violet'			: 0xEE82EE,
		'Wheat'				: 0xF5DEB3,
		'White'				: 0xFFFFFF,
		'WhiteSmoke'		: 0xF5F5F5,
		'Yellow'			: 0xFFFF00,
		'YellowGreen'		: 0x9ACD32,
	};
/*
	ColorsCS.forEach (function(key, value) {
		Colors{key.toLowerCase()} = value;
	});
 */
	var key, value;
	for (const key in ColorsCS) {
		Colors[key.toLowerCase()] = ColorsCS[key];
	}
	return {
			'Deg2Rad'	: Math.PI / 180,
			'Rad2Deg'	: 180.0 / Math.PI,
			'ColorsCS'	: ColorsCS,
			'Colors'	: Colors,
			};		
}
// File: ./DisplayControl.js
/**
 * Handles creation and action of User Interface controls for display changes that require
 * user input/action. This includes FullScreen and VR.
 *
 * Some of the designs can be overridden by adding user-defined method by calling XSeen.DisplayControl.UserButton (tbd).
 * The user-defined method is called with one arguments - an HTML 'div' element that is the button to be
 * displayed. No child elements may be added as these methods set innerHTML according to the request, device, and
 * current state. See 'stylizeElement' for the list of styles that are set/defined.
 *
 * @author DrxR / http://xseen.org
 *
 *  Copied, extracted, and inspired by previous
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Based on @tojiro's vr-samples-utils.js
 *
 *	Downloaded 2017-11-02 @13:31
 *	Redeveloped for XSeen 2018-06-15
 */

XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;
XSeen.DisplayControl = {
	
/*
 * Primary entry for handling buttons. This is only called when the device supports the requested
 *	functionality. If an HTML element is supplied, that is modified rather than a new element being created.
 *	The text associated with this element is always appropriate for the requested functionality. This can be
 *	modified prior to adding the element to the HTML document.
 */
	'buttonCreate'			: function (buttonType, node, button) {
		var button = document.createElement( 'div' );
		//button.style.display = 'none';
		button.innerHTML = "Requesting '"  + buttonType + "'";
		button.style.width += 6 + buttonType.length/2 + 'em';
		this.stylizeElement( button );
		if (buttonType == 'fullscreen') {
			this.buttonFullScreen (button, node);
		} else if (buttonType == 'vr') {
			this.buttonVR (button, node);
		}
		
		button._checkButtonActive = this._checkButtonActive;
		button._checkButtonActive (button);

		return button;
	},
	
	// Requested UX does not exist (within this interface/API)
	'buttonNotSupported'	: function (buttonType, button) {
		var response = document.createElement( 'div' );
		this.stylizeElement( response );
		response.innerHTML = buttonType.toUpperCase() + ' is not supported';
		response.style.width = '13em'
		response.style.cursor = 'default';
		return response;
	},
	
	// Of the button is active, handle the ':hover' pseudo-class
	'_checkButtonActive'	: function (button) {
		if (button.dataset._active != 'false') {
			button.onmouseenter = function(event) {
					event.currentTarget.style.opacity = 1.0;
				};
			button.onmouseleave = function(event) {
					event.currentTarget.style.opacity = 0.5;
				};

// Button no longer active, un-define event handlers
		} else {
			button.onmouseenter = null;
			button.onmouseleave = null;
			button.style.opacity = 0.5;
		}
	},

	
/*
 * Code for creating stylized button. This can be overridden
 * Many of these parameters are sized for the XSeen image. They need to remain coordinated
 * Only text color is supported for CusorOver (hover)
 * The width of this element changes depending on the inserted text
 */
	'stylizeElement'	: function (button) {
		button.style.backgroundColor	= '#212214';
		button.style.height				= '24px';
		button.style.backgroundImage	= 'url(https://XSeen.org/Logo/xseen-symbol-color.svg)';
		button.style.backgroundRepeat	= 'no-repeat';
		button.style.paddingLeft		= '70px';
		button.style.borderRadius		= '4px';
		//button.style.width				= '6em';
		button.style.cursor				= 'pointer';
		button.style.fontFamily			= 'Arial,Helvetica,"sans serif"';
		button.style.fontSize			= '18px';
		button.style.textAlign			= 'center';
		button.style.opacity			= 0.5;
		//button.dataset._colorHighlight	= '#fff';			// on CursorOver (hover)
		button.dataset._colorDefault	= '#aaa';			// default color
		button.dataset._active			= false;			// button not active
		button.style.color				= button.dataset._colorDefault;
		button.style.position			= 'fixed';
		//button.style.bottom				= '66px';
		button.style.top				= '80%';
		button.style.left				= '45%';
	},

// Add features necessary to make the transition to VR	
	'buttonVR'				: function (button, node) {
		
		showEnterVR = function (button, display ) {
			button.innerHTML		= "Enter VR";
			button.style.width		= '7em';
			button.style.cursor		= 'pointer';
			button.dataset._active	= true;			// button active
			button._checkButtonActive (button);		

/*
 * Set up click event handler for entering or exiting VR
 * When clicked, if in VR, the system will exit.
 * If not in VR, then it will set up everything to do so.
 *
 * renderer is the THREE (or some other) renderer object with the following elements
 * renderer.domElement is the Canvas element
 * renderer.vr is the VR element (needs .vr.setDevice() method)
 */
			
			if (display && button) {	// Display & button defined, so go ahead and create event handler
				button.onclick = function(ev) {
					XSeen.LogVerbose ('Currently Presenting VR: |' + display.isPresenting + '|');
					display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: renderer.domElement } ] );
					renderer.vr.setDevice( display );
					XSeen.LogVerbose ('VR state changed');
				};
			}
		}

		showVRNotFound = function () {
			button.innerHTML		= "VR Not Found";
			button.style.width		= '7em';
			button.style.cursor		= 'default';
			button.dataset._active	= false;			// button active
			button._checkButtonActive (button);			

			button.onmouseenter = null;
			button.onmouseleave = null;
			button.onclick = null;
			//renderer.vr.setDevice( null );
		}

/*
 * Define event handlers for various VR display events
 *
 *	'vrdisplayconnect'			The browser connects to a VR device (show Enter)
 *	'vrdisplaydisconnect'		A VR device disconnects from the browser (show Not Found)
 *	'vrdisplaypresentchange'	The presentation state of a VR device changes (show Enter/Exit as appropriate)
 */
		window.addEventListener( 'vrdisplayconnect', function ( event ) {
			showEnterVR( event.display );		// Problematic because need to locate 'button'
		}, false );

		window.addEventListener( 'vrdisplaydisconnect', function ( event ) {
			showVRNotFound();
		}, false );

		window.addEventListener( 'vrdisplaypresentchange', function ( event ) {
			button.innerHTML = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';	// See above
		}, false );

/*
 * Determine if system is currently capable of going into VR.
 * If so, display enter button. If not, display not available
 *
 */ 
		navigator.getVRDisplays()
			.then( function ( displays ) {
				if (true ||  displays.length > 0 ) {
					XSeen.LogVerbose ("Showing 'Enter VR'");
					button.dataset._active	= true;			// button active
					showEnterVR(button, null);
					return true;

				} else {
					showVRNotFound ();
					XSeen.LogVerbose ("Showing 'VR Not Found'");
					return false;
				}
			} );
		return button;

	},
	
/*
 *	Add full screen button to display. Certain characteristics are set.
 *
 *	Parameters:
 *		button	A shadow-DOM HTML button that will be used as the 'Enter/Exit' full screen button. This
 *				includes display placement.
 *		node	The HTML tag to go full-screen. Only this tag and its children will be visible
 *		turnOffFull	An optional boolean that indicates that button should not be visible during full-screen. D=false
 */
	'buttonFullScreen'		: function (button, node, turnOffFull) {
		turnOffFull = (typeof(turnOffFull) == 'undefined') ? false : turnOffFull;
		turnOffFull = true;
		button.innerHTML		= "Enter FullScreen";
		button.style.width		= '9em';
		button.dataset._active	= true;			// button active
		button._fullScreenNode 	= node;
		button._offWhenFull		= turnOffFull;
		node._requestFullscreen	= this._requestFullscreen;
		node._exitFullscreen	= this._exitFullscreen;
		node._fullscreenButton	= button;
/*
 * Defined below
		document.documentElement._isFullScreen		= function () {
			var fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
			if (typeof(fullScreenElement) != 'undefined') {return true;}
			return false;
		};
*/
		document.documentElement._fullScreenElement	= function () {
			return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
		};
		

/*
 * Create event listener for button click. 
 * The polyfill document function (document..._isFullScreen()) determines what to do
 */
		button.addEventListener( 'click', function ( event ) {
			var e = document.documentElement._fullScreenElement();
			if (document.documentElement._isFullScreen()) {
				event.currentTarget._fullScreenNode._exitFullscreen.call(document);
			} else {
				event.currentTarget._fullScreenNode._requestFullscreen();
				document.documentElement._XSeenButton = event.currentTarget;	// Save the button for changing the label
			}
		}, false );
/*
 * Catch the fullscreen event (browser-specific) and make the necessary changes
 */
		document.addEventListener( this._fullscreenEventName, function ( event ) {
			if ( document.documentElement._isFullScreen() ) {
				// Check ._XSeenButton._offWhenFull to see if button needs to be not displayed
				if (document.documentElement._XSeenButton._offWhenFull) {
					document.documentElement._XSeenButton.style.display = 'hidden';
				}
				document.documentElement._XSeenButton.innerHTML = 'Exit FullScreen';
				if (XSeen.Runtime._deviceCameraElement != 0) {		// Connect camera
					XSeen.IW.connectCamera (XSeen.Runtime._deviceCameraElement);
				}
			
			} else {	// Exit from full screen
				document.documentElement._XSeenButton.style.display = 'block';
				document.documentElement._XSeenButton.innerHTML = 'Enter FullScreen';
				document.documentElement._XSeenButton = null;
				if (XSeen.Runtime._deviceCameraElement != 0) {		// Disconnect camera
					XSeen.IW.disconnectCamera (XSeen.Runtime._deviceCameraElement);
				}
			}
		}, false );
	},

/*
 * Polyfill for browser differences for handling full screen requests, events, and elements
 */
	'_requestFullscreen'	: document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen,
	'_exitFullscreen'		: document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen,
	'_fullscreenEventName'	: 
			(typeof(document.documentElement.requestFullscreen)			!= 'undefined') ? 'fullscreenchange' :
			(typeof(document.documentElement.webkitRequestFullscreen)	!= 'undefined') ? 'webkitfullfullscreenchange' :
			(typeof(document.documentElement.mozRequestFullScreen)		!= 'undefined') ? 'mozfullscreenchange' :
			(typeof(document.documentElement.msRequestFullscreen)		!= 'undefined') ? 'msfullscreenchange' : '',
	'_supportFullscreen'	: (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) ? true : false,
	
/*
 * Determine if the device supports the request
 */
	'_deviceSupportsType'	: function (buttonType) {
		if (buttonType == 'fullscreen') {
			return this._supportFullscreen;
			
		} else if (buttonType == 'vr') {
			if ( 'getVRDisplays' in navigator ) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	},
	
/*
 * Creates and returns HTML element. If the device supports the requested change, then the necessary
 *		Event handlers are created to execute the action on user-initiated requests
 *		If the requested action is not supported, an appropriate HTML element is returned without event handlers.
 *
 *	Parameters:
 *		type		The type of requested action. All values are case insensitive. The only supported values are:
 *				'fullscreen'	Set the display full screen
 *				'vr'			Set the display to VR mode
 *		node		The HTML document element to go full screen
 *		renderer	The rendering object. This is required for type='vr' and ignored for other types.
 *		button		An optional user-created HTML element. If present, then this is modified to supply the appropriate 
 *					innerHTML value. If not present or not an HTML element with innerHTML field, then one will be created.
 */
	'createButton'			: function (type, node, renderer, button) {
		var buttonType, response;
		buttonType = type.toLowerCase();
		if (this._deviceSupportsType(buttonType)) {	// Device supports requested feature (VR or FullScreen)
			response = this.buttonCreate (buttonType, node, button);
		
		} else {								// Device does not support requested feature (VR or FullScreen)
			response = this.buttonNotSupported (buttonType, button);
		}
		return response;
	},
};

/*
 * Developmental methods for handling button events external to XSeen
 *	All defined in XSeen. This may not be the best place for these definitions, but
 *	their function relates to the processing defined here (DisplayControl).
 *	These functions depend on successful and correct definition of XSeen.DisplayControl
 *
 *	isFullScreen	- returns true or false
 *	goFullScreen	- requests full screen mode. Event handler, no change to buttons
 *	exitFullScreen	- exits from full screen mode. Event handler, no change to buttons
 */
document.documentElement._isFullScreen		= function () {
	var fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
	if (typeof(fullScreenElement) != 'undefined') {return true;}
	return false;
};
document.documentElement._requestFullScreen =
						document.documentElement.requestFullscreen || 
						document.documentElement.webkitRequestFullscreen || 
						document.documentElement.mozRequestFullScreen || 
						document.documentElement.msRequestFullscreen;
//document.documentElement._requestFullScreen =
//						document.documentElement.mozRequestFullScreen;
document.documentElement._exitFullscreen =
						document.exitFullscreen || 
						document.webkitExitFullscreen || 
						document.mozCancelFullScreen || 
						document.msExitFullscreen;


/*
 * Define XSeen methods to handle full screen interactions
 */
XSeen.nameFullScreenEvent =
			(typeof(document.documentElement.requestFullscreen)			!= 'undefined') ? 'fullscreenchange' :
			(typeof(document.documentElement.webkitRequestFullscreen)	!= 'undefined') ? 'webkitfullfullscreenchange' :
			(typeof(document.documentElement.mozRequestFullScreen)		!= 'undefined') ? 'mozfullscreenchange' :
			(typeof(document.documentElement.msRequestFullscreen)		!= 'undefined') ? 'msfullscreenchange' : '';
XSeen.isFullScreen = function() {return document.documentElement._isFullScreen();}
XSeen.goFullScreen = function(fullScreenNode) {
	if (fullScreenNode === null) fullScreenNode = XSeen.Runtime.RootTag;
	document.addEventListener( XSeen.nameFullScreenEvent, function ( event ) {
		if (XSeen.Runtime._deviceCameraElement != 0) {
			if ( XSeen.isFullScreen() ) {
				XSeen.IW.connectCamera (XSeen.Runtime._deviceCameraElement);	// Connect camera
			} else {
				XSeen.IW.disconnectCamera (XSeen.Runtime._deviceCameraElement);	// Disconnect camera
			}
		}
	}, false );
	_requestFullScreen = 
						fullScreenNode.requestFullscreen || 
						fullScreenNode.webkitRequestFullscreen || 
						fullScreenNode.mozRequestFullScreen || 
						fullScreenNode.msRequestFullscreen;
	_requestFullScreen.call(fullScreenNode);
};
XSeen.exitFullScreen = function(fullScreenNode) {
	if (fullScreenNode === null) fullScreenNode = XSeen.Runtime.RootTag;
	if (document.exitFullscreen !== null) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen !== null) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen !== null) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen !== null) {
		document.msExitFullscreen();
	}
};
// File: ./Events.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 
/*
 * XSeen events.
 * This object is the manager for all XSeen events. Individual nodes may handle events directed to
 * the node (e.g., change an attribute's value).
 *
 *
 * provides method for the creation of events and the general-purpose handler for the XSEEN tag
 * The General Purpose handler mostly captures the event and regenerates a new XSeen event
 *
 *
 *	Note: Cursor events on objects are not automatically generated by the system as they would be
 *		for "regular" HTML objects. It is necessary to cast a ray into the scene and see which objects
 *		(if any) it hits. The closest object to the viewer that allows tracking is used in the event
 *
 * This class supports the creation of the following events
 *	Beginning of each animation frame
 *	Change to the display size
 *	Change to the scene graph (tags & attributes)
 *	An object that intersects the ray from the observer through the scene
 *	User "button" click
 *
 */
 
/*
 * New translation of HTML events to XSeen events
 #	Treat all "touch" (mousedown, finger, etc.) events the same. The same goes
 #	for "untouch" (mouseup,...). 
 #	Is it worthwhile to treat all touch events as a single 'event' type?
 #	That would require user code to handle all touch events, not just "click" or "touchstart"
 #	with a resultant impact on performance; however, since XSeen handles all of those that may
 #	not be significant.
 #
 #	Since HTML separates all of them, do the same; except treat mouse* as a single-touch
 #	equivalent of touch*.
 #	click & dblclick are a little different. They don't have 'touch*' equivalents.
 #	All screen interaction events are HTML5 touch* events and include the following:
 #	* Camera detail (orientation, position, FOV, etc.)
 #	* Screen position
 #	* All event payloads need to contain intersected object details IFF the ray implied 
 #		by the touch intersects an object. Otherwise, the object details are null.
 #	 - Object details are:
 #		- Specific element
 #		- Group element (need to understand this better)
 #		- Hit point (coordinates)
 #		- Object/element (?) world position
 #		- Geometry & appearance details (color, triangle, texture coordinates, normal)
 
 *	HTML5					XSeen (all prefixed with 'xseen-')
 *	 mousedown				 touchstart
 *	 touchstart				 touchstart
 *	 mousemove				 touchmove
 *	 touchmove				 touchmove
 *	 mouseup				 touchend
 *	 touchend				 touchend
 *	 touchcancel			 touchcancel (?)
 *	 click					 touchtap
 *	 dblckick				 touchdbltap
 *	 deviceorientation		 deviceorientation
 *							 devicemode (portrait or landscape)
 */
 
var XSeen = XSeen || {};
XSeen.Events = {
		'MODE_NAVIGATE'		: 1,
		'MODE_SELECT'		: 2,
		'mode'				: 1,
		'inNavigation'		: function () {return (this.mode == this.MODE_NAVIGATION) ? true : false;},
		'inSelect'			: function () {return (this.mode == this.MODE_SELECT) ? true : false;},
		'redispatch'		: false,
		'object'			: {},
		'tag'				: {},
		'isEventsEnabled'	: true,
		'disableEventHandling' : function () {		// Remove all mouse/touch event listeners
									XSeen.LogVerbose ('Disabling XSeen cursor handlers');
									XSeen.Runtime.RootTag.removeEventListener ('mousemove', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('touchmove', XSeen.Events.xseen, true);

									XSeen.Runtime.RootTag.removeEventListener ('mouseover', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('mouseout', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('mousedown', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('mouseup', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('click', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('dblclick', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('touchstart', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('touchend', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.removeEventListener ('touchcancel', XSeen.Events.xseen, true);

									this.isEventsEnabled = false;
									return XSeen.Runtime.RootTag;
							},
		'enableEventHandling' : function () {		// Add initial mouse/touch event listeners
									XSeen.LogVerbose ('Enabling XSeen cursor handlers');
									XSeen.Runtime.RootTag.addEventListener ('mouseover', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('mouseout', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('click', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('dblclick', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('touchstart', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('touchend', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('touchcancel', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('mousedown', XSeen.Events.xseen, true);
									XSeen.Runtime.RootTag.addEventListener ('mouseup', XSeen.Events.xseen, true);
									this.isEventsEnabled = true;
							},
		'loadStart'			: function (loadType, node) {
								var newEv = new CustomEvent('xseen-loadstart', XSeen.Events.propertiesLoad('start', loadType));
								node.dispatchEvent(newEv);
							},
		'loadComplete'		: function (loadType, node) {
								var newEv = new CustomEvent('xseen-loadcomplete', XSeen.Events.propertiesLoad('complete', loadType));
								node.dispatchEvent(newEv);
							},
		'loadProgress'		: function (loadType, node, progressEvent) {
								var eventMsg;
								var extra = {
												'lengthComputable'	: progressEvent.lengthComputable,
												'loaded'			: progressEvent.loaded,
												'total'				: progressEvent.total,
											};
								if (progressEvent.lengthComputable) {
									eventMsg = ': ' + (100 * progressEvent.loaded / progressEvent.total) + '%';
								} else {
									eventMsg = '';
								}
								eventMsg = 'Load progress on ' + node.localName + '#' + node.id + eventMsg;
								XSeen.LogInfo (eventMsg);
								var newEv = new CustomEvent('xseen-loadprogress', XSeen.Events.propertiesLoad('progress', loadType, extra));
								node.dispatchEvent(newEv);
							},
		'loadFail'		: function (loadType, node) {
								var newEv = new CustomEvent('xseen-loadfail', XSeen.Events.propertiesLoad('fail', loadType));
								node.dispatchEvent(newEv);
							},

		'eventProperties'	: function (ev) {
								var properties, type;
								type = ev.type.substr(0,5);
								if (type == 'mouse') {
									properties = XSeen.Events._cursor(ev);
								} else {
									properties = XSeen.Events._touch(ev);
								}
								return properties;
							},
		'_cursor'			: function (ev) {
								var cX=0, cY=0, sX=0, sY=0;
								if (typeof(ev.clientX) != 'undefined' && !isNaN(ev.clientX)) {
									cX = ev.clientX;
									cY = ev.clientY;
									sX = ev.screenX;
									sY = ev.screenY;
								}
								var properties = {
										'detail':		{					// This object contains all of the XSeen data
												'originalType':	ev.type,
												'deviceOrientation': {	// Device orientation from the browser
														'pitch': 	XSeen.Events.device.pitch,
														'roll':		XSeen.Events.device.roll,
														'yaw':		XSeen.Events.device.yaw,
														},
												'points':	[{
														'clientX'		: cX,
														'clientY'		: cY,
														'force'			: (ev.type == 'mouseup') ? 0 : 1,			// Default is full-force
														'identifier'	: -1,			// -1 for mouse to deconflict with 'touch'
														'movementX'		: ev.movementX || 0,
														'movementY'		: ev.movementY || 0,
														'offsetX'		: ev.offsetX || 0,
														'offsetY'		: ev.offsetY || 0,
														'pageX'			: ev.pageX || 0,
														'pageY'			: ev.pageY || 0,
														'radiusX'		: 0.0,		// Unknown quantity
														'radiusY'		: 0.0,		// Unknown quantity
														'rotationAngle'	: 0.0,		// Unknown quantity
														'screenX'		: sX,
														'screenY'		: sY,
														'_cursorScreen'	: new THREE.Vector2(
																			 cX * XSeen.Runtime.Size.iwidth  * 2 - 1,
																			-cY * XSeen.Runtime.Size.iheight * 2 + 1),
												}],
												'getObject'		: function () {			// TODO: Should use a prototype function here!
													XSeen.Events.raycaster.setFromCamera(this.points[0]._cursorScreen, XSeen.Runtime.Camera);
													var hitGeometryList = XSeen.Events.raycaster.intersectObjects (XSeen.Runtime.selectable, true);
													if (hitGeometryList.length != 0) {
														return XSeen.Events._object(hitGeometryList[0]);
													} else {
														return {};
													}
												},
												'ctrlKey':	ev.ctrlKey,
												'shiftKey':	ev.shiftKey,
												'altKey': 	ev.altKey,
												'metaKey':	ev.metaKey,
												'button':	ev.button,
												'buttons':	ev.buttons,
											},
										'bubbles':		ev.bubbles,
										'cancelable':	ev.cancelable,
										'composed':		ev.composed,
									};
								return  properties;
							},
		'_touch'		: function (ev) {
								var properties = {
										'detail':		{					// This object contains all of the XSeen data
												'originalType':	ev.type,
												'deviceOrientation': {	// Device orientation from the browser
														'pitch': 	XSeen.Events.device.pitch,
														'roll':		XSeen.Events.device.roll,
														'yaw':		XSeen.Events.device.yaw,
														},
												'points':	[],
												'getObject'		: function () {			// TODO: Should use a prototype function here!
													XSeen.Events.raycaster.setFromCamera(this.points[0]._cursorScreen, XSeen.Runtime.Camera);
													var hitGeometryList = XSeen.Events.raycaster.intersectObjects (XSeen.Runtime.selectable, true);
													if (hitGeometryList.length != 0) {
														return XSeen.Events._object(hitGeometryList[0]);
													} else {
														return {};
													}
												},
												'ctrlKey':	ev.ctrlKey,
												'shiftKey':	ev.shiftKey,
												'altKey': 	ev.altKey,
												'metaKey':	ev.metaKey,
												'button':	ev.button,
												'buttons':	ev.buttons,
											},
										'bubbles':		ev.bubbles,
										'cancelable':	ev.cancelable,
										'composed':		ev.composed,
									};
								for (ii=0; ii<ev.touches.length; ii++) {
									properties.detail.points[ii] = XSeen.Events._populateTouch (ev.touches[ii]);
								}
								return  properties;
							},
		'_populateTouch'	: function (touchPoint) {
								var cX=0, cY=0, sX=0, sY=0;
								if (typeof(touchPoint.clientX) != 'undefined' && !isNaN(touchPoint.clientX)) {
									cX = touchPoint.clientX;
									cY = touchPoint.clientY;
									sX = touchPoint.screenX;
									sY = touchPoint.screenY;
								}
								point = {
									'clientX'		: cX,
									'clientY'		: cY,
									'force'			: touchPoint.force,
									'identifier'	: touchPoint.identifier,
									'movementX'		: touchPoint.movementX || 0,
									'movementY'		: touchPoint.movementY || 0,
									'offsetX'		: touchPoint.offsetX,
									'offsetY'		: touchPoint.offsetY,
									'pageX'			: touchPoint.pageX,
									'pageY'			: touchPoint.pageY,
									'radiusX'		: touchPoint.radiusX,
									'radiusY'		: touchPoint.radiusY,
									'rotationAngle'	: touchPoint.rotationAngle,
									'screenX'		: sX,
									'screenY'		: sY,
									'_cursorScreen'	: new THREE.Vector2(
														 cX * XSeen.Runtime.Size.iwidth  * 2 - 1,
														-cY * XSeen.Runtime.Size.iheight * 2 + 1),
										};
								return point;
							},
		'_object'			: function (hitObject) {
								var object3D, tag;
								tag = hitObject.object.userData;
								if (typeof(tag) != 'undefined' && typeof(tag.root) != 'undefined') tag = tag.root;
								object3D = {
										'originator'			: tag,
										'picker'				: tag._xseen.pickGroup,
										'name'					: hitObject.object.name,
										'distance'				: hitObject.distance,
										'target'				: hitObject,
										'hitPosition'			: {			// Touch point on target
														'x': hitObject.point.x,
														'y': hitObject.point.y,
														'z': hitObject.point.z,
																},
										'normal'				: {
														'x': hitObject.face.normal.x,
														'y': hitObject.face.normal.y,
														'z': hitObject.face.normal.z,
																},
										'uv'					: {
														'x': 0.0,		// hitObject.uv.x,
														'y': 0.0,		// hitObject.uv.y,
																},
										'targetWorldPosition'	: hitObject.object.getWorldPosition(),
										'pickerWorldPosition'	: tag._xseen.pickGroup._xseen.tagObject.getWorldPosition(),
										'cameraNormal'			: {		// Where the camera is pointing
														'x': 0,
														'y': 0,
														'z': -1,
																},
										'cameraPosition'		: tag._xseen.sceneInfo.Camera.getWorldPosition(),
								};
								return object3D;
							},

		'raycaster'			: new THREE.Raycaster(),
		'cursorScreen'		: new THREE.Vector2(),
		'device'			: {'absolute':true, 'pitch':0, 'roll':0, 'yaw':0},
		'Translate'			: {
								'UNKNOWN'		: {event:'xseen-unknown', type:'unknown', source:'unknown'},
								'mousedown'		: {event:'xseen-touchstart', type:'down'},
								'mouseup'		: {event:'xseen-touchend', type:'up'},
								'mousemove'		: {event:'xseen-touchmove', type:'move'},
								'mouseover'		: {event:'xseen-hover', type:'hover'},
								'click'			: {event:'xseen-touchtap', type:'click'},
								'dblclick'		: {event:'xseen-touchdbltap', type:'click2'},
								'touchstart'	: {event:'xseen-touchstart', type:'start'},
								'touchend'		: {event:'xseen-touchend', type:'end'},
								'touchcancel'	: {event:'xseen-touchcancel', type:'start'},
								'touchmove'		: {event:'xseen-touchmove', type:'move'},
								// touchtap, touchdbltap, touchlongtap?
								'deviceorientation'	: {event:'xseen-deviceorientation', type:'change'},
								'devicemode'		: {event:'xseen-devicemode', type:'change'},
								},
	

/*
 * General XSeen event handler. All XSeen events get processed here during the CAPTURE phase
 *	The main types of events are mousedown, mouseup, and mousemove. All click events are proceeded by mousedown
 *
 *	If the cursor is used for navigation and selection, then a mousedown event can switch the mode to selection 
 *	(MODE_SELECT). A mouseup event will switch the mode to navigation (MODE_NAVIGATE). If event mode is locked
 *	then cursor events do not change the mode.
 *
 *	The mode is switched to selection if the cursor is over a selectable object on mousedown.
 *	The mode is switched to navigation on mouseup.
 *	The mousemove event does not change the mode.
 *
 *	TODO: Locked Mode
 *
 */
		'xseen'				: function (ev)
					{
						var xEvents = XSeen.Events;
						var Runtime = ev.currentTarget._xseen.sceneInfo;
						if (ev.type.substr(0,5) == 'touch') {
							//console.log (ev.type + ': for ' + ev.changedTouches.length + ' touch points');
							//console.log (ev.changedTouches);
						} else {
							//console.log (ev.type + ' event');
							//console.log(ev);
						}
/*
 *	Brand new (2019-03-26) direction.
 *	All events are like HTML/DOM events.
 *	Mouse events are single-point Touch events
 *	No tracking of all touch points
 *	No finding the object - that is a separate call details.getObject([id])
 *	It is necessary to convert mouse events to touch events. 
 *		Need to figure out what to do with various key presses (Ctrl, Alt, ...)
 *		Mouse events
 *	Move listeners are created on call to details.trackObject([id])
 *	Redispatch causes a DOM event to be redispatched as an XSeen one
 *	Redispatched events are swallowed
 *
 *	TODO:
 *	* Potential issue with using mouse/touch for navigation as the event is never propagated
 */
						XSeen.LogVerbose ('Events:: handling event by type: ' + ev.type + ' with device navigation: ' + XSeen.Runtime.useDeviceOrientation);
						if (XSeen.Runtime.useDeviceOrientation) {
						if (ev.type == 'mousedown' || ev.type == 'touchstart') {
							var newEv = new CustomEvent('xseen-touch', xEvents.eventProperties(ev));
							//console.log ("Dispatching 'xseen-touch' on 'scene' tag");
							//console.log (newEv);
							XSeen.Runtime.RootTag.dispatchEvent(newEv);
							//console.log ('Mouse down. Dispatch xseen-touch and stop propagation');
							ev.stopPropagation();		// No propagation beyond this tag
							if (this.isEventsEnabled) {
								//console.log ('Commented out MOVE Listener in Events.js');
								//XSeen.Runtime.RootTag.addEventListener ('mousemove', XSeen.Events.xseen, true);
								//XSeen.Runtime.RootTag.addEventListener ('touchmove', XSeen.Events.xseen, true);
							}
						}
						if (ev.type == 'mouseup' || ev.type == 'touchend' || ev.type == 'touchcancel') {
							var newEv = new CustomEvent('xseen-release', xEvents.eventProperties(ev));
							XSeen.Runtime.RootTag.dispatchEvent(newEv);
							//console.log ('Mouse up. Dispatch xseen-release and stop propagation');
							ev.stopPropagation();		// No propagation beyond this tag
							XSeen.Runtime.RootTag.removeEventListener ('mousemove', XSeen.Events.xseen, true);
							XSeen.Runtime.RootTag.removeEventListener ('touchmove', XSeen.Events.xseen, true);
						}
						if (ev.type == 'mousemove' || ev.type == 'touchmove') {
							//console.log (ev);
							var newEv = new CustomEvent('xseen-move', xEvents.eventProperties(ev));
							XSeen.Runtime.RootTag.dispatchEvent(newEv);
							//console.log ('Mouse move. Dispatch xseen-move and stop propagation');
							ev.stopPropagation();		// No propagation beyond this tag
						}
						}
					},


/*
 *	Events for device state changes
 *	Mostly this is deviceorientation events
 */
		'propertiesDevice'	: function (ev)
					{
						//XSeen.LogVerbose ('Creating event detail for |' + ev.type + '|');
						var properties = {
								'detail':		{					// This object contains all of the XSeen data
										'type':			XSeen.Events.Translate[ev.type].type,
										'originalType':	ev.type,
										'deviceOrientation': {	// Device orientation from the browser
														'pitch': 	XSeen.Events.device.pitch,
														'roll':		XSeen.Events.device.roll,
														'yaw':		XSeen.Events.device.yaw,
													},
												},
								'bubbles':		ev.bubbles,
								'cancelable':	ev.cancelable,
								'composed':		ev.composed,
							};
						return  properties;
					},

		'propertiesRenderFrame'	: function (Runtime)
					{
						var properties = {
								'detail':		{					// This object contains all of the XSeen data
										'type'			: 'renderframe',
										'originalType'	: 'renderframe',
										'originator'	: Runtime.RootTag,			// Reference to scene object
										'name'			: Runtime.RootTag.name,		// Name of scene object
										'currentTime'	: Runtime.currentTime,		// Current time at start of frame rendering
										'deltaTime'		: Runtime.deltaTime,		// Time since last frame
										'frameNumber'	: Runtime.frameNumber,		// Number of frame about to be rendered
										'Runtime'		: Runtime					// Reference to Runtime object
												},
								'bubbles':		true,
								'cancelable':	true,
								'composed':		true,
							};
						return  properties;
					},

		'propertiesReadyGo'	: function (Runtime, state)
					{
						var properties = {
								'detail':		{					// This object contains all of the XSeen data
										'type'			: state,	// State of this event (initialize or render)
										'originalType'	: state,
										'originator'	: Runtime.RootTag,			// Reference to scene object
										'name'			: Runtime.RootTag.name,		// Name of scene object
										'currentTime'	: Runtime.currentTime,		// Current time at start of frame rendering
										'deltaTime'		: Runtime.deltaTime,		// Time since last frame
										'Runtime'		: Runtime					// Reference to Runtime object
												},
								'bubbles':		true,
								'cancelable':	true,
								'composed':		true,
							};
						return  properties;
					},

		'propertiesLoad'	: function (state, loadType, extra)
					{
						var properties = {
								'detail':		{									// This object contains all of the XSeen data
										'type'			: loadType,						// What asset was changed
										'originalType'	: loadType,
										'state'			: state,						// Loading state (start, complete, progress, fail)
										//'originator'	: XSeen.Runtime,				// Reference to tag requesting event
										'name'			: 'TBD: name',					// Name of scene object
										'currentTime'	: XSeen.Runtime.currentTime,	// Current time at start of frame rendering
										'deltaTime'		: XSeen.Runtime.deltaTime,		// Time since last frame
										'Runtime'		: XSeen.Runtime					// Reference to Runtime object
												},
								'bubbles':		true,
								'cancelable':	true,
								'composed':		true,
							};
						for (var xta in extra) {
							properties.detail[xta] = extra[xta];
						}
						return  properties;
					},

		'propertiesAssetChanged'	: function (Runtime, assetType)
					{
						var properties = {
								'detail':		{							// This object contains all of the XSeen data
										'type'			: assetType,		// What asset was changed
										'originalType'	: assetType,
										'originator'	: Runtime,					// Reference to tag requesting event
										'name'			: 'TBD: name',				// Name of scene object
										'currentTime'	: Runtime.currentTime,		// Current time at start of frame rendering
										'deltaTime'		: Runtime.deltaTime,		// Time since last frame
										'Runtime'		: Runtime					// Reference to Runtime object
												},
								'bubbles':		true,
								'cancelable':	true,
								'composed':		true,
							};
						return  properties;
					},
};
/*
 *	The phone's coordinate system has bad breakpoints. The calculations here
 *	convert everything to a RHS with Y-Up with breakpoints at the nadir and zenith.
 *	This assumes that the phone is held landscape. Portrait orientation needs to
 *	be further examined. Most phones are set to auto-rotate so that the top of the
 *	application display is at the current top of the screen.
 *
 *	ev.* units are degrees
 *	XSeen.Events.device units are radians
 */
window.addEventListener('deviceorientation', function(ev) {
	XSeen.Events.device.absolute	= ev.absolute;
	//XSeen.Events.device.alpha		= ev.alpha * 0.0174533;
	//XSeen.Events.device.beta		= ev.beta * 0.0174533;
	//XSeen.Events.device.gamma		= ev.gamma * 0.0174533;
	if (ev.gamma >= 180) {			// phone looking up. 0 is zenith
		XSeen.Events.device.yaw			= ev.alpha * 0.0174533;
		XSeen.Events.device.roll		= ev.beta * 0.0174533;
		XSeen.Events.device.pitch		= (ev.gamma-180) * 0.0174533;
	} else if (ev.gamma >= 0) {			// phone looking up. 0 is zenith
		XSeen.Events.device.yaw			= ev.alpha * 0.0174533;
		XSeen.Events.device.roll		= ev.beta * 0.0174533;
		XSeen.Events.device.pitch		= ev.gamma * 0.0174533;
	} else {
		XSeen.Events.device.yaw			= (180+ev.alpha) * 0.0174533;
		XSeen.Events.device.roll		= ev.beta * 0.0174533;
		XSeen.Events.device.pitch		= (180+ev.gamma) * 0.0174533;
	}

	var newEv = new CustomEvent(XSeen.Events.Translate[ev.type].event, XSeen.Events.propertiesDevice(ev));
	ev.currentTarget.dispatchEvent(newEv);
	XSeen.Runtime.RootTag.dispatchEvent(newEv);
	var rpy = '(' + XSeen.Events.device.roll + ', ' + XSeen.Events.device.pitch + ', ' + XSeen.Events.device.yaw + ')';
	XSeen.LogRidiculous ("Created '" + XSeen.Events.Translate[ev.type].event + "' event [RPY: " + rpy + ']');
	//ev.stopPropagation();		// Allow propagation beyond this tag
	});
/*
Events

Events are created for all user interactions and changes to the DOM scene graph
Unless there is already a system event name (mouseover, click, etc.), all events are Custom
All nodes create event handlers for the following:
  1) Attribute changes
  2) Children changes
  3) Changes to all style nodes used
Changes to styles that have run-time impact (those with non-empty 'selector' value) are pushed to the node

For example a Group (Transform) node defines an event handler for (https://developer.mozilla.org/en-US/docs/Web/Events)
  1) changes to any attribute value
	DOMAttrModified
  2) changes to children
	DOMNodeInserted
	DOMNodeRemoved
	DOMSubtreeModified
  3)[1] for style elements (nodes)
  
In addition the XSEEN node also receives events for all 
 * mouse/cursor/pointer(?) motions
 * clicks & presses
 * full-screen
 * keyboard
 * window/element resize
 
Node events are handled with the 'events' method that is automatically created during node definition.

The event structure contains the initiating node/action and a reference to the target node

It is the responsibility of the node to make all necessary changes. If the event is ignored, then the node should
pass on the event. If it is fully handled, then it should capture it.
 */
// File: ./IW.js
/**
 * Handles polyfill for Immersive Web features
 *
 * @author DrxR / http://xseen.org
 *
 *
 *	Developed for XSeen 2010-02-21
 */

XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;
XSeen.IW = {
	
/*
 * Handle connecting and disconnecting the device camera
 */
 
 //	'e' is [almost] always a 'background' tag DOM element
	'connectCamera'		: function (e) {
			var constraints = {video: {facingMode: {exact: "environment"}}};
			var constraints = {video: {facingMode: "environment"}};
			if (e._xseen.videoState != 'defined') {
				console.log ('Camera/video not correctly configured. Current state: ' + e._xseen.videoState);
				return;
			}
			function handleSuccess(stream) {
				e._xseen.video.srcObject = stream;
				e._xseen.video.play();
				e._xseen.videoState = 'running';
				console.log ('Camera/video (' + stream.id + ') engaged and connected to display.');
				console.log (stream);
			}
			function handleError(error) {
				//console.error('Reeeejected!', error);
				console.log ('Device camera not available -- ignoring');
				e._xseen.videoState = 'error';
			}
			navigator.mediaDevices.getUserMedia(constraints).
				then(handleSuccess).catch(handleError);
	},

// From https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
	'disconnectCamera'		: function (e) {
			if (e._xseen.videoState == 'running') {
				e._xseen.video.srcObject.getTracks().forEach (function(mediaTrack) {
						mediaTrack.stop();
				});
				e._xseen.video.srcObject = null;
				e._xseen.videoState = 'defined';
				console.log ('Disconnecting device camera');
			}
	},
};
// File: ./Loader.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 
/*
 * XSeen loader.
 * This object is the manager for all XSeen loading operations.
 *
 *
 *
 */

var XSeen = XSeen || {};

// Base code from https://www.abeautifulsite.net/parsing-urls-in-javascript
XSeen.parseUrl = function (url) {
		var parser = document.createElement('a'),
		searchObject = {},
        queries, split, i, pathFile, path, file, extension;
		// Let the browser do the work
		parser.href = url;
		// Convert query string to object
    	queries = parser.search.replace(/^\?/, '').split('&');
    	for( i = 0; i < queries.length; i++ ) {
			split = queries[i].split('=');
			searchObject[split[0]] = split[1];
		}
		pathFile = parser.pathname.split('/');
		file = pathFile[pathFile.length-1];
		pathFile.length --;
		path = '/' + pathFile.join('/');
		extension = file.split('.');
		extension = extension[extension.length-1];
    	return {
        	protocol:		parser.protocol,
        	host:			parser.host,
        	hostname:		parser.hostname,
        	port:			parser.port,
        	pathname:		parser.pathname,
			path:			path,
			file:			file,
			extension:		extension,
        	search:			parser.search,
        	searchObject:	searchObject,
        	hash:			parser.hash
    		};
};

XSeen.isImage = function (url) {
		var u = XSeen.parseUrl (url);
		var ext = u.extension.toLowerCase();
		if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif') {return true;}
		return false;
};

XSeen.Loader = {
						// define internal variables
	'urlQueue'			: [],
	'urlNext'			: -1,
	'MaxRequests'		: 3,
	'totalRequests'		: 0,
	'totalResponses'	: 0,
	'requestCount'		: 0,
	'lmThat'			: this,
	'manager'			: new THREE.LoadingManager(),
	'loadersComplete'	: true,
	'ContentType'		: {
							'jpg'	: 'image',
							'jpeg'	: 'image',
							'gif'	: 'image',
							'txt'	: 'text',
							'html'	: 'html',
							'htm'	: 'html',
							'xml'	: 'xml',
							'json'	: 'json',
							'dae'	: 'collada',
							'gltf'	: 'gltf',
							'glb'	: 'gltfLegacy',
							'obj'	: 'obj',
							'x3d'	: 'x3d',
						},
	'ContentLoaders'	: {},
	'internalLoader'	: function (url, success, failure, progress, userdata, type)
		{
			this.urlQueue.push( {'url':url, 'type':type, 'hint':hint, 'userdata':userdata, 'success':success, 'failure':failed, 'progress':progress} );
			this.loadNextUrl();
		},
		
/*
 * Standardized reporting of loading
 */
	'Reporting'		: function (ev)
		{
			var msg = 'Loading of ' + ev.detail.type + ': ' + ev.detail.state;
			if (ev.detail.lengthComputable && ev.detail.total != 0) {
				msg += ' (' + 100 * ev.detail.loaded / ev.detail.total + '% [' + ev.detail.loaded + ' of ' + ev.detail.total + '])';
			}
			XSeen.LogInfo (msg);
			//console.log (ev);
		},

		
/*
 * Asynchronously loads a texture cube and saves the result
 *	Arguments:
 *		pathUrl		The URL to the directory. This may be empty.
 *		filenames	An array of six URLs/filenames - one for each cube face. The order is 
 *					+X, -X, +Y, -Y, +Z, -Z. If pathUrl is non-empty, then it is prepended 
 *					to each of these elements. If an element is empty (''), or the entire array 
 *					is undefined; then the face name (px, nx, py, ny, pz, nz) is used. 
 *					If 'pathUrl' and 'filesnames' are undefined, then no texture is loaded.
 *		filetypes	The type of the image file. It can either be a single value or an array of six values.
 *					Each value must start with the character after the file name (e.g., '.').
 *					It is appended to the URL for each face.
 *		Success		User-provided call-back. This is called when all textures are successfully loaded.
 *					The function is called with one argument - the texture cube.
 *		cube		Where the loaded texture cube is stored
 *		dirtyFlag	Set when the texture is loaded so the rendering system can incorporate the result
 */
	'TextureCube'		: function (pathUri, filenames, filetypes, Success)
		{
			var urlTypes=Array(6), urls=Array(6), textureCube;
			var _Success = function (data) {
				var texture = data.cube, dirty;
				if (typeof(data.dirty) !== undefined) {dirty = dirtyFlag;}
				return function (textureCube) {
					texture = textureCube;
					if (typeof(dirty) !== 'undefined') {dirty = true;}
					//console.log ('Successful load of texture cube.');
				}
			};
			var _Progress = function (a) {
				console.log ('Load PROGRESS for cubemap');
				//console.log (a);
				XSeen.Events.loadProgress ('cubemap', a.target);
			};
			var _Failure = function (a) {
				XSeen.LogError ('Load FAILURE for cubemap');
				console.log (a);
				XSeen.Events.loadFail ('cubemap', a.target);
			};

			if (typeof(filetypes) == 'string') {
				urlTypes = [filetypes, filetypes, filetypes, filetypes, filetypes, filetypes];
			} else if (filetypes.length == 6) {
				urlTypes = filetypes;
			} else {
				return;
			}
			if (pathUri == '' && (filenames.length != 6 ||
					(filesnames[0] == '' || filesnames[1] == '' || filesnames[2] == '' || filesnames[3] == '' || filesnames[4] == '' || filesnames[5] == ''))) {return;}
			urls[0] = pathUri + ((filenames.length >= 1 && filenames[0] != '') ? filenames[0] : 'px') + urlTypes[0];
			urls[1] = pathUri + ((filenames.length >= 2 && filenames[1] != '') ? filenames[1] : 'nx') + urlTypes[1];
			urls[2] = pathUri + ((filenames.length >= 3 && filenames[2] != '') ? filenames[2] : 'py') + urlTypes[2];
			urls[3] = pathUri + ((filenames.length >= 4 && filenames[3] != '') ? filenames[3] : 'ny') + urlTypes[3];
			urls[4] = pathUri + ((filenames.length >= 5 && filenames[4] != '') ? filenames[4] : 'pz') + urlTypes[4];
			urls[5] = pathUri + ((filenames.length >= 6 && filenames[5] != '') ? filenames[5] : 'nz') + urlTypes[5];

			//console.log('Loading cube-map texture...');
			//console.log (urls);
			var msg = 'Loading textcube from\n';
			for (var ii=0; ii<=5; ii++) {
				msg += ' [' + ii + '] ' + urls[ii] + '\n';
			}
			XSeen.LogVerbose (msg);

			textureCube = new THREE.CubeTextureLoader(XSeen.Loader.manager)
									.load (urls, Success, _Progress, _Failure);
		},

//var lmThat = this;

/*
 *	Sets up for loading an external resource. 
 *	The resource is loaded from a FIFO queue
 *	Loading happens asynchronously. The Loader parameter
 *	MaxRequests determines the maximum number of simultaneous requests
 *
 *	Parameters:
 *		url			The URL of the resource
 *		hint		A hint to the loader to help it determine which specific loader to use. Most of the
 *					time the file extension is sufficient to determine the specific loader; however, some
 *					file extensions may be used for incompatible file formats (e.x., glTF V1.0, V1.1, and V2.0).
 *					The hint should contain the version number without 'V'.
 *		success		The callback function to call on successful load
 *			The remaining arguments are optional. If any are present, then following process is used
 *			One argument ==> userdata
 *			Two arguments ==> failure, progress
 *			Three arguments ==> failure, progress, userdata
 *		failure		The callback function to call on when the loading fails
 *		progress	The callback function to call while the loading is occurring
 *		userdata	A object to be included with all of the callbacks.
 */
	'load'		: function (url='', hint='', success, optArg1, optArg2, optArg3)
		{
			var uri = XSeen.parseUrl (url);
			var type = (typeof(this.ContentType[uri.extension]) === 'undefined') ? this.ContentType['txt'] : this.ContentType[uri.extension];
			var MimeLoader = this.ContentLoaders[type];
			if (MimeLoader.needHint === true && hint == '') {
				XSeen.LogError ('Hint required to load content type ' + type);
				return false;
			}
			
			if (MimeLoader.needHint) {
				if (type == 'gltf') {
					if (hint == '') {hint = 'Current';}
					type += hint;
					MimeLoader = this.ContentLoaders[type];
				}		// Other types go here
			}
			
			var _userdata, _failure, _progress;
			if (arguments.length < 4) {
				_userdata = {};
				_failure = XSeen.Loader._Failure;
				_progress = XSeen.Loader._Progress;
			} else if (arguments.length == 4) {
				_userdata = optArg1;
				_failure = XSeen.Loader._Failure;
				_progress = XSeen.Loader._Progress;
			} else if (arguments.length == 5) {
				_userdata = {};
				_failure = optArg1;
				_progress = optArg2;
			} else if (arguments.length >= 6) {
				_failure = optArg1;
				_progress = optArg2;
				_userdata = optArg3;
			}

			if (typeof(MimeLoader.loader) === 'undefined') {
				this.internalLoader (url, success, _failure, _progress, _userdata, type);
			} else {
				MimeLoader.loader.load (url, success, _progress, _failure);
				XSeen.Loader.loadersComplete = false;
			}
		},
	
	'_Progress'	: function (ev)
		{
			//console.log (ev);
			XSeen.Events.loadProgress ('content', XSeen.Runtime.RootTag, ev);
		},
	'_Failure'	: function (a)
		{
			//console.log (a);
			XSeen.Events.loadFail ('content', XSeen.Runtime.RootTag);
		},



// TODO: These are copied from previous Loader. Need to make sure they still work & meet the right needs		
	'success'	: function (response, string, xhr)
		{
			if (typeof(xhr._loadManager.success) !== undefined) {
				xhr._loadManager.success (response, xhr._loadManager.userdata, xhr);
			}
		},
	'progress'	: function (xhr, errorCode, errorText)
		{
			if (typeof(xhr._loadManager.progress) !== undefined) {
				xhr._loadManager.progress (xhr, xhr._loadManager.userdata, errorCode, errorText);
			}
		},
	'failure'	: function (xhr, errorCode, errorText)
		{
			if (typeof(xhr._loadManager.failure) !== undefined) {
				xhr._loadManager.failure (xhr, xhr._loadManager.userdata, errorCode, errorText);
			}
		},

	'requestComplete'	: function (event, xhr, settings)
		{
			this.lmThat.requestCount --;
			this.lmThat.totalResponses++;
			this.lmThat.loadNextUrl();
		},

	'loadNextUrl'		: function ()
		{
			if (this.requestCount >= this.MaxRequests) {return; }
			if (this.urlNext >= this.urlQueue.length || this.urlNext < 0) {
				this.urlNext = -1;
				for (var i=0; i<this.urlQueue.length; i++) {
					if (this.urlQueue[i] !== null) {
						this.urlNext = i;
						break;
					}
				}
				if (this.urlNext < 0) {
					this.urlQueue = [];
					return;
				}
			}

			this.requestCount ++;
			var details = this.urlQueue[this.urlNext];
			var settings = {
							'url'		: details.url,
							'dataType'	: details.type,
							'complete'	: this.requestComplete,
							'success'	: this.success,
							'error'		: this.failure
							};
			if (settings.dataType == 'json') {
				settings['beforeSend'] = function(xhr){xhr.overrideMimeType("application/json");};
			}
			this.urlQueue[this.urlNext] = null;
			this.urlNext ++;
			var x = jQuery.get(settings);		// Need to change this... Has impact throughout class
			x._loadManager = {'userdata': details.userdata, 'requestType':details.type, 'success':details.success, 'failure':details.failure};
			this.totalRequests++;
		},
};

XSeen.Loader.onLoad = function() {
	var mgr = XSeen.Loader.manager;
	XSeen.Loader.ContentLoaders = {
							'image'		: {'loader': null, needHint: false, },
							'text'		: {'loader': null, needHint: false, },
							'html'		: {'loader': null, needHint: false, },
							'xml'		: {'loader': null, needHint: false, },
							'json'		: {'loader': null, needHint: false, },
							'gltf'		: {'loader': null, needHint: 2, },
							'collada'	: {'loader': new THREE.ColladaLoader(mgr), needHint: false, },
							'obj'		: {'loader': new THREE.OBJLoader2(mgr), needHint: false, },
							'x3d'		: {'loader': new THREE.ColladaLoader(mgr), needHint: false, },
							'gltfCurrent'	: {'loader': new THREE.GLTFLoader(mgr), needHint: false, }, 
							'gltfLegacy'	: {'loader': new THREE.LegacyGLTFLoader(mgr), needHint: false, }, 
						};
	//console.log ('Created ContentLoaders object');
	mgr.onLoad = function() {XSeen.Loader.loadersComplete = true;}
};
XSeen.Loader.loadingComplete = function() {
	if (XSeen.Loader.urlQueue.length == 0 && XSeen.Loader.loadersComplete) return true;
	return false;
}
if (typeof(XSeen.onLoadCallBack) === 'undefined') {
	XSeen.onLoadCallBack = [];
}
XSeen.onLoadCallBack.push (XSeen.Loader.onLoad);

// File: ./Logging.js
/*
 * XSeen JavaScript Library
 * http://tools.realism.com/...
 *
 * (C)2017 Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 *
 * 
 */
if (typeof(XSeen) === 'undefined') {var XSeen = {};}
if (typeof(XSeen.definitions) === 'undefined') {XSeen.definitions = {};}

/*
 *	Logging object for handling all logging of messages
 *
 *	init is used to initialize and return the object. 
 */
 
XSeen.definitions.Logging = {
	'levels'	: ['Ridiculous', 'Verbose', 'Debug', 'Info', 'Load', 'Warn', 'Error'],
	'Data'		: {
					'Levels' : {
						'ridiculous': {'class':'xseen-log xseen-logInfo', 'level':8, label:'+++'},
						'verbose'	: {'class':'xseen-log xseen-logInfo', 'level':7, label:'VERBOSE'},
						'debug'		: {'class':'xseen-log xseen-logInfo', 'level':5, label:'DEBUG'},
						'info'		: {'class':'xseen-log xseen-logInfo', 'level':4, label:'INFO'},
						'load'		: {'class':'xseen-log xseen-logLoad', 'level':3, label:'LOAD'},
						'warn'		: {'class':'xseen-log xseen-logInfo', 'level':2, label:'WARN'},
						'error'		: {'class':'xseen-log xseen-logInfo', 'level':1, label:'ERROR'},
						'force'		: {'class':'xseen-log xseen-logInfo', 'level':0, label:'FORCE'},
					},
					'maximumLevel'		: 9,
					'consoleLevel'		: 'Info',
					'defaultLevel'		: 'Error',
					'active'			: false,
					'init'				: false,
					'maxLinesLogged'	: 10000,
					'lineCount'			: 0,
					'logContainer'		: null,
				},
	'init'		: function (show, element) {

		// 	If initialized, return this
		if (this.Data.init) {return this; }
	
		// Setup container
		if (document.getElementById('XSeenLog') === null) {
			this.Data.logContainer = document.createElement("div");
			this.Data.logContainer.id = "xseen_logdiv";
			this.Data.logContainer.setAttribute("class", "xseen-logContainer");
			this.Data.logContainer.style.clear = "both";
			element.parentElement.appendChild (this.Data.logContainer);
		} else {
			this.Data.logContainer = document.getElementById('XSeenLog');
			this.Data.logContainer.classList.add ("xseen-logContainer");
		}
		if (show) {
			//this.Data.logContainer.style.display = 'block';
			this.LogOn();
		} else {
			this.Data.logContainer.style.display = 'none';
		}
		this.Data.init = true;
		return this;
	},
	
	'LogOn'		: function () {
					this.Data.active = true;
					this.Data.logContainer.style.display = 'block';
				},
	'LogOff'	: function () {this.active = false;},

	'logLog'	: function (message, level) {
		if (!this.Data.init) {return this; }
		if (this.Data.active) {
			var innerText = this.Data.Levels[level].label + ": " + message;
			if (this.Data.Levels[level].level <= this.Data.maximumLevel) {
			// if level not in this.levels, then set to this.Data.defaultLevel
				var node = document.createElement("p");
				node.setAttribute("class", this.Data.Levels[level].class);
				node.innerHTML = this.Data.Levels[level].label + ": " + message;
				this.Data.logContainer.insertBefore(node, this.Data.logContainer.firstChild);
				this.Data.lineCount++;
			}
			if (this.Data.Levels[level].level <= this.Data.consoleLevel) {
				console.log (innerText);
			}
			if (this.Data.lineCount >= this.Data.maxLinesLogged) {
				message = "Maximum number of log lines (=" + this.Data.maxLinesLogged + ") reached. Deactivating logging...";
				this.Data.maximumLevel = 9;
				//this.Data.active = false;
			}
		}
		return this;
	},

	'logRidiculous'	: function (string) {this.logLog (string, 'ridiculous');},
	'logVerbose'	: function (string) {this.logLog (string, 'verbose');},
	'logDebug'		: function (string) {this.logLog (string, 'debug');},
	'logInfo'		: function (string) {this.logLog (string, 'info');},
	'logWarn'		: function (string) {
		this.logLog (string, 'warn');
		console.log ('Warning: ' + string);
	},
	'logError'	: function (string) {
		this.logLog (string, 'error');
		console.error ('*** Error: ' + string);
	},
	'logLoad'	: function (ev) {				// This is really an event handler and belongs in Events.js
		var node = document.createElement("p");
		var that = XSeen.definitions.Logging;
		node.setAttribute("class", that.Data.Levels['load'].class);
		node.innerHTML = that.Data.Levels['load'].label + ": " + ev.detail.state + ' for ' + ev.target.localName + '#' + ev.target.id;
		that.Data.logContainer.insertBefore(node, that.Data.logContainer.firstChild);
	},
	
	'initLoad'	: function (root) {
		root.addEventListener ('xseen-loadstart', this.logLoad, true);
		root.addEventListener ('xseen-loadcomplete', this.logLoad, true);
		root.addEventListener ('xseen-loadfail', this.logLoad, true);
	},
	'setLoggingLevel'	: function(newLevel, root) {
		if (typeof (this.Data.Levels[newLevel]) != 'undefined') {
			this.Data.maximumLevel = this.Data.Levels[newLevel].level;
			if (this.Data.maximumLevel >= this.Data.Levels['load'].level) this.initLoad(root);
			if (this.Data.maximumLevel >= this.Data.Levels['error'].level) this.LogOn();
			this.logLog ('Setting logging to ' + newLevel, 'force');
		}
	},
	'setConsoleLevel'	: function(newLevel) {
		if (typeof (this.Data.Levels[newLevel]) != 'undefined') {
			this.Data.consoleLevel = this.Data.Levels[newLevel].level;
			if (this.Data.consoleLevel >= this.Data.Levels['error'].level) this.LogOn();
			this.logLog ('Setting console logging to ' + newLevel, 'force');
		}
	},
}
// File: ./onLoad.js
/*
 * XSeen JavaScript Library
 * http://tools.realism.com/...
 *
 * (C)2017 Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 *
 * 
 */
 
var XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;

XSeen.Convert = {
	'fromString'	: function (v, t)
	{
		if (t == 'boolean') {
			if (v == '' || v == 'f' || v == '0' || v == 'false') {return false;}
			return true;
		}
		return v;
	},
};

/*
 * Partially designed to process all scenes; however, only the first one is actually processed
 */
XSeen.onLoad = function() {
	loadExternal = function(url, domElement) {
                                       // Method for adding userdata from https://stackoverflow.com/questions/11997234/three-js-jsonloader-callback
                                       //
			var xseenCode = '';
        	loadExternalSuccess = function (userdata) {
                	var e = userdata.e;
					return function (response) {
							XSeen.LogDebug ('Loading of external XSeen complete');
							var parser = new DOMParser();
							var xmlDoc = parser.parseFromString(response,"text/xml");
							var rootNode = xmlDoc.getElementsByTagName('xr-scene');
							if (rootNode === null) {rootNode = xmlDoc.getElementsByTagName('x-scene');}
							var nodes = rootNode[0].children;
							while (nodes.length > 0) {
								XSeen.LogVerbose ('Adding external node: ' + nodes[0].nodeName);
								e.appendChild(nodes[0]);
							}
					}
			};

			var loader = new THREE.FileLoader();
			loader.load (url, 
						loadExternalSuccess({'e':domElement}),
						// onProgress callback
						function ( xhr ) {
							XSeen.LogInfo('External source loader: ' + (xhr.loaded / xhr.total * 100) + '% loaded' );
						},
						// onError callback
						function ( err ) {
							XSeen.LogWarn ('Response Code: ' + err.target.status);
							XSeen.LogWarn ('Response URL: ' + err.target.responseURL);
							XSeen.LogWarn ('Response Text\n' + err.target.responseText);
							XSeen.LogError ('External source loader: An error happened' );
						}
			);
	};
	
	var sceneOccurrences, ii;
	if (typeof(XSeen._Scenes) === 'undefined') {XSeen._Scenes = [];}

	sceneOccurrences = document.getElementsByTagName (XSeen.Constants.tagPrefix + XSeen.Constants.rootTag);
	if (sceneOccurrences.length == 0) {sceneOccurrences = document.getElementsByTagName (XSeen.Constants.tagPrefixAlt + XSeen.Constants.rootTag);}
	for (ii=0; ii<sceneOccurrences.length; ii++) {
		if (typeof(sceneOccurrences[ii]._xseen) === 'undefined') {
			XSeen._Scenes.push(sceneOccurrences[ii]);
		}
	}
	if (XSeen._Scenes.length < 1) {return;}
	XSeen.Runtime.RootTag = XSeen._Scenes[0];
	XSeen.Runtime.Attributes = [];

	var allowedAttributes, defaultValues, value, attributeCharacteristics;
	allowedAttributes = ['src', 'showlog', 'showstat', 'showprogress', 'cubetest'];
	defaultValues = {'src':'', 'showlog':false, 'showstat':false, 'showprogress':false, 'cubetest':false};
	attributeCharacteristics = {
								'src'	: {
									'name'		: 'src',
									'default'	: '',
									'type'		: 'string',
									'case'		: 'sensitive' ,
										},
		// Sets the operation mode. AR ==> (transparent, fullscreen) & allows use of device camera
								'mode'	: {
									'name'		: 'mode',
									'default'	: 'vr',
									'type'		: 'string',
									'case'		: 'insensitive' ,
									'enumeration': ['ar', 'vr'],
										},
		// Turns off XSeen button creation (FullScreen, VR)
								'_no-xseen-buttons' : {
									'name'		: '_no-xseen-buttons',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
								'_debug'	: {
									'name'		: '_debug',
									'default'	: 'none',
									'type'		: 'string',
									'case'		: 'insensitive' ,
									'enumeration': ['', 'url', 'none', 'load', 'info', 'verbose', 'debug', 'warn', 'error'],
										},
								'showstat'	: {
									'name'		: 'showstat',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
								'showprogress'	: {
									'name'		: 'showprogress',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
								'transparent'	: {
									'name'		: 'transparent',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
								'fullscreen'	: {
									'name'		: 'fullscreen',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
								'fullscreenid'	: {
									'name'		: 'fullscreenid',
									'default'	: '',
									'type'		: 'string',
									'case'		: 'sensitive' ,
										},
		// TESTing mode only
								'cubetest'	: {
									'name'		: 'cubetest',
									'default'	: 'false',
									'type'		: 'boolean',
									'case'		: 'insensitive' ,
										},
		// Deprecated
								'usecamera'	: {						// deprecated
									'name'		: 'usecamera',
									'default'	: 'false',
									'type'		: 'boolean',
										},
								};
								
	Object.getOwnPropertyNames(attributeCharacteristics).forEach (function (prop) {
		value = XSeen.Runtime.RootTag.getAttribute(attributeCharacteristics[prop].name);
		if (value == '' || value === null || typeof(value) === 'undefined') {value = attributeCharacteristics[prop].default;}
		console.log ('STARTUP: Checking XSEEN attribute: ' + prop + '; with value: ' + value);
		if (value != '') {
			if (attributeCharacteristics[prop].case != 'sensitive') {
				XSeen.Runtime.Attributes[attributeCharacteristics[prop].name] = XSeen.Convert.fromString (value.toLowerCase(), attributeCharacteristics[prop].type);
			} else {
				XSeen.Runtime.Attributes[attributeCharacteristics[prop].name] = XSeen.Convert.fromString (value, attributeCharacteristics[prop].type);
			}
		}
	});

	// Define a few equivalences
//	XSeen.Logging = XSeen.definitions.Logging.init (XSeen.Runtime.Attributes['showlog'], XSeen.Runtime.RootTag);
	XSeen._debugLogging = (XSeen.Runtime.Attributes._debug == '' || XSeen.Runtime.Attributes._debug == 'none') ? false : true;
	XSeen.Logging = XSeen.definitions.Logging.init (XSeen._debugLogging, XSeen.Runtime.RootTag);
	XSeen.Logging.setLoggingLevel (XSeen.Runtime.Attributes._debug, XSeen.Runtime.RootTag);
	XSeen.Logging.setConsoleLevel (XSeen.Runtime.Attributes._debug);
	XSeen.LogRidiculous	= function (string) {XSeen.Logging.logRidiculous (string);}
	XSeen.LogVerbose	= function (string) {XSeen.Logging.logVerbose (string);}
	XSeen.LogDebug		= function (string) {XSeen.Logging.logDebug (string);}
	XSeen.LogInfo		= function (string) {XSeen.Logging.logInfo (string);}
	XSeen.LogWarn		= function (string) {XSeen.Logging.logWarn (string);}
	XSeen.LogError		= function (string) {XSeen.Logging.logError (string);}

	if (!(typeof(XSeen.Runtime.Attributes.src) == 'undefined' || XSeen.Runtime.Attributes.src == '')) {
		XSeen.LogDebug ('*** external SRC file specified ... |'+XSeen.Runtime.Attributes.src+'|');
		loadExternal (XSeen.Runtime.Attributes.src, XSeen.Runtime.RootTag);
	}

	

/*
 * Setup/define various characteristics for the runtime or display
 *
 * IF AR mode is requested, make sure device has sufficient capabilities before entering; otherwise, ignore request
 *
 * Define Renderer and StereoRenderer
 *	This was formerly in XSeen, but moved here to support a transparent
 *	background request either by style or explicit attribute
 */
	var Renderer;
	if (XSeen.Runtime.Attributes.mode == 'ar') {
		XSeen.Runtime.mediaAvailable = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);	// flag for device media availability
		if (XSeen.Runtime.mediaAvailable) {
			XSeen.Runtime.allowAR = true;
			XSeen.Runtime.Attributes.transparent = true;
			XSeen.Runtime.Attributes.fullscreen = true;
		} else {
			XSeen.Runtime.allowAR = false;
		}
		// TODO: A permission/notification screen may be needed here
	} else {
		XSeen.Runtime.mediaAvailable = false;
		XSeen.Runtime.allowAR = false;
	}

	if (XSeen.Runtime.Attributes.transparent) {
		XSeen.Runtime.isTransparent = true;
	} else {
		XSeen.Runtime.isTransparent = false;
	}
	if (XSeen.Runtime.isTransparent) {
		Renderer = new THREE.WebGLRenderer({'alpha':true,});		// Sets transparent WebGL canvas
	} else {
		Renderer = new THREE.WebGLRenderer();
	}
	XSeen.Runtime.RendererStandard	= Renderer;
	XSeen.Runtime.RendererStereo	= new THREE.StereoEffect(Renderer);
	XSeen.Runtime.Renderer			= XSeen.Runtime.RendererStandard;
	Renderer = null;
	
	XSeen.Runtime.Size = XSeen.updateDisplaySize (XSeen.Runtime.RootTag);	// TODO: test
	XSeen.Runtime.Renderer.setSize (XSeen.Runtime.Size.width, XSeen.Runtime.Size.height);

	XSeen.Runtime.Camera = XSeen.Runtime.ViewManager.create (XSeen.Runtime.Size.aspect);
	XSeen.Runtime.SceneDom = XSeen.Runtime.Renderer.domElement;
	XSeen.Runtime.RootTag.appendChild (XSeen.Runtime.SceneDom);
//	document.body.appendChild (XSeen.Runtime.SceneDom);
	

	if (XSeen.Runtime.mediaAvailable && XSeen.Runtime.isTransparent) {
	} else {
		XSeen.LogVerbose ('Device Media support is not available or NOT requested ('+XSeen.Runtime.isTransparent+')');
	}

	
	// Set up display characteristics, especially for VR
	if (navigator.getVRDisplays) {
		navigator.getVRDisplays()
			.then( function ( displays ) {
				if ( displays.length > 0 ) {
					XSeen.Runtime.isVrCapable = true;
				} else {
					XSeen.Runtime.isVrCapable = false;
				}
			} );
	}
/*
 * Stereo camera effect and device orientation controls are set on each camera
 */
	//XSeen.Runtime.hasDeviceOrientation = (window.orientation) ? true : false;
	XSeen.Runtime.hasDeviceOrientation = (window.DeviceOrientationEvent) ? true : false;
	XSeen.Runtime.hasVrImmersive = XSeen.Runtime.hasDeviceOrientation;
	
/*
 * Handle debug settings.
 *	Most are done through event handlers to a specific output target
 */
	var _debug = XSeen.Runtime.Attributes._debug;
	if (_debug == 'url') {
		let params = new URLSearchParams(document.location.search.substring(1));
		_debug = params.get("xseen_debug") || '';
	}
	if (_debug != '') {
		XSeen.Logging.setLoggingLevel (_debug, XSeen.Runtime.RootTag);
		XSeen.Logging.setConsoleLevel (_debug);
	}

/*
 * Create XSeen default elements
 *	Default camera by adding a first-child node to xr-scene
 *		<xr-camera position='0 0 10' type='perspective' track='orbit' priority='0' active='true' />
 *	Splash screen
 *		<img src='logo.svg' width='100%'>
 */
	var defaultCamera = "<xr-camera id='XSeen__DefaultCamera' position='0 0 10' type='perspective' track='orbit' priority='0' active='true' /></xr-camera>";
	var tmp = document.createElement('div');
	tmp.innerHTML = defaultCamera;
	XSeen.Runtime.RootTag.prepend (tmp.firstChild);
	var splashScreen = '<div id="XSeen-Splash"><img src="https://XSeen.org/Resources/logo.svg" width="'+XSeen.Runtime.Size.width/2+'"><div><div class="spinner">&ohbar;</div>&nbsp;Loading</div></div>';
	console.log (splashScreen);
	tmp.innerHTML = splashScreen;
	XSeen.Runtime.RootTag.prepend (tmp.firstChild);
	
// Set up control screen (FullScreen / Splitscreen / VR) buttons
	if (!XSeen.Runtime.Attributes['_no-xseen-buttons'] && XSeen.Runtime.Attributes.fullscreen) {
		fullscreenElement = XSeen.Runtime.RootTag;
		if (XSeen.Runtime.Attributes.fullscreenid != '') {
			var ele = document.getElementById(XSeen.Runtime.Attributes.fullscreenid);
			if (ele !== null) fullscreenElement = ele;
		}
		var fs_button = XSeen.DisplayControl.buttonCreate ('fullscreen', fullscreenElement, null);
		var result = fullscreenElement.appendChild (fs_button);
	}

	
// Introduce things
	//XSeen.Logging.logInfo ("XSeen version " + XSeen.Version.version + ", " + "Date " + XSeen.Version.date);
	XSeen.LogInfo ("XSeen version " + XSeen.Version.version + ", " + "Date " + XSeen.Version.date);
	XSeen.LogInfo (XSeen.Version.splashText);
	
// Load all other onLoad methods
	for (var ii=0; ii<XSeen.onLoadCallBack.length; ii++) {
		XSeen.onLoadCallBack[ii]();
	}
	
// Create XSeen event listeners
//	*move events are not included because they are added after the initiating event (touchstart/mousedown)
	XSeen.Events.enableEventHandling();


/*
 * Define event handlers for content loading
 *	These uniformly handle the display of asynchronous loading of all content
 */
XSeen.Runtime.RootTag.addEventListener('xseen-loadstart', XSeen.Loader.Reporting);
XSeen.Runtime.RootTag.addEventListener('xseen-loadcomplete', XSeen.Loader.Reporting);
XSeen.Runtime.RootTag.addEventListener('xseen-loadprogress', XSeen.Loader.Reporting);
XSeen.Runtime.RootTag.addEventListener('xseen-loadfail', XSeen.Loader.Reporting);



// Create event to indicate the XSeen has fully loaded. It is dispatched on the 
//	<xr-scene> tag but bubbles up so it can be caught.
	var newEv = new CustomEvent('xseen-initialize', XSeen.Events.propertiesReadyGo(XSeen.Runtime, 'initialize'));
	XSeen.Runtime.RootTag.dispatchEvent(newEv);
	return;
}
	

/*
 * All initializations complete. Start parsing scene
 */
XSeen.onLoadStartProcessing = function() {

	if (typeof(XSeen.Runtime.RootTag._xseen) === 'undefined') {
		XSeen.Runtime.RootTag._xseen = {					// Duplicated from Tag.js\%line202
									'children'		: [],	// Children of this tag
									'Metadata'		: [],	// Metadata for this tag
									'tmp'			: [],	// tmp working space
									'attributes'	: [],	// attributes for this tag
									'animate'		: [],	// animatable attributes for this tag
									'animation'		: [],	// array of animations on this tag
									'properties'	: [],	// array of properties (active attribute values) on this tag
									'class3d'		: [],	// 3D classes for this tag
									'sceneInfo'		: XSeen.Runtime,	// Runtime data added to each tag
									};
	}
// Parse the HTML tree starting at scenesToParse[0]. The method returns when there is no more to parse
	//XSeen.Parser.dumpTable();
	XSeen.LogVerbose ('Starting Parse...');
	XSeen.Parser.Parse (XSeen.Runtime.RootTag, XSeen.Runtime.RootTag);
	
	var newEv = new CustomEvent('xseen-go', XSeen.Events.propertiesReadyGo(XSeen.Runtime, 'render'));
	XSeen.Runtime.RootTag.dispatchEvent(newEv);

	return;
};


// Determine the size of the XSeen display area

XSeen.updateDisplaySize = function (sceneRoot) {
	var MinimumValue = 50;
	var size = Array();
	size.width = sceneRoot.offsetWidth;
	size.height = Math.floor(sceneRoot.offsetHeight -5);	// Firefox requires 5 less for an unknown reason
	if (size.width < MinimumValue) {
		var t = sceneRoot.getAttribute('width');
		if (t < MinimumValue) {t = MinimumValue;}
		size.width = t;
	}
	if (size.height < MinimumValue) {
		var t = sceneRoot.getAttribute('height');
		if (t < MinimumValue) {t = MinimumValue;}
		size.height = t;
	}
	size.iwidth = 1.0 / size.width;
	size.iheight = 1.0 / size.height;
	size.aspect = size.width * size.iheight;
	XSeen.LogDebug ('Display size: ' + size.width + ' x ' + size.height);
	return size;
};

/*
 * Return a frame of camera data
 *
 *	If the camera is running (XSeen.Runtime._deviceCameraElement._xseen.videoState  defined and == 'running')
 *	return an ImageData object from a canvas read operation. This does not interfere with the usual 3D display
 *
 *	If the camera is not running, then return null
 */
XSeen.getVideoFrame = function() {
	if (XSeen.Runtime._deviceCameraElement !== null &&
		XSeen.Runtime._deviceCameraElement != 0 &&
		typeof(XSeen.Runtime._deviceCameraElement._xseen.videoState) != 'undefined' &&
		XSeen.Runtime._deviceCameraElement._xseen.videoState == 'running') {
			var qrImage, canvas, context, height, width;
			canvas = document.createElement('canvas');
			context = canvas.getContext('2d');

			video = (jQuery)('xr-scene video')[0];
			if (video.length == 0) {video = (jQuery)('x-scene video')[0];}
			height = video.height;
			width = video.width;
			canvas.width = width;
			canvas.height = height;
			//sh = Math.floor(height/4);
			//sw = Math.floor(width/4);
			//eh = Math.floor(3*height/4);
			//ew = Math.floor(3*width/4);
			sh = 0;
			sw = 0;
			eh = height;
			ew = width;
			context.drawImage(video, 0, 0 );
			var dataUrl = canvas.toDataURL('image/png');
			//return dataUrl;
			qrImage = context.getImageData(sw, sh, ew, eh);
			
			return qrImage;
		}
};

// File: ./Tag.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 
/*
 * XSeen.tags.<name> is the definition of <name>
 * All internal variables are stored in ._internal
 *
 * These are intended to be development support routines. It is anticipated that in
 * production systems the array dump (_dumpTable) would be loaded. As a result, it is necessary
 * to have a routine that dumps out the Object so it can be captured and saved. A routine
 * or documentation on how to load the Object would also be good. 
 *
 * Attributes are added with the .defineAttribute method. It takes its values from the argument list
 * or an object passed as the first argument. The properties of the argument are:
 *	name - the name of the field. This is converted to lowercase before use
 *	datatype - the datatype of the field. There must be a method in XSeen.types by this name
 *	defaultValue - the default value of the field to be used if the field is not present or incorrectly defined.
 *					If this argument is an array, then it is the set of allowed values. The first element is the default.
 *	enumerated - the list of allowed values when the datatype only allows specific values for this field (optional)
 *	animatable - Flag (T/F) indicating if the field is animatable. Generally speaking, enumerated fieles are not animatable
 */

var XSeen = XSeen || {};
XSeen.Tags = {
	'_setSpace'		: function (object, spaceAttributes) {
						//if (1 === 1) return;
						if (object.isObject3D) {
							if (typeof(spaceAttributes.position) !== 'undefined') {
								object.position.x = spaceAttributes.position.x;
								object.position.y = spaceAttributes.position.y;
								object.position.z = spaceAttributes.position.z;
							}
							if (typeof(spaceAttributes.rotation) !== 'undefined') {
								object.setRotationFromQuaternion (spaceAttributes.rotation);
							}
							if (typeof(spaceAttributes.scale) !== 'undefined') {
								object.scale.x = spaceAttributes.scale.x;
								object.scale.y = spaceAttributes.scale.y;
								object.scale.z = spaceAttributes.scale.z;
							}
						}
					},
};
XSeen.Parser = {
	'Table'			: {},
	'_prefix'		: 'xr-',
	'_prefixAlt'	: 'x-',
	'AttributeObserver'	: new MutationObserver(function(list) {
							for (var mutation of list) {
								var value = XSeen.Parser.reparseAttr (mutation.target, mutation.attributeName);
								var localName = mutation.target.localName;
								var handler = XSeen.Parser.Table[localName].eventHandlers.mutation.handler;
								handler (mutation.target, mutation.attributeName, value);
							}
						}),
/*
 * Observer for tag/child changes/additions
 */
	'ChildObserver'	: new MutationObserver(function(list) {
				for (var mutation of list) {
					//console.log ('Child mutation element');
					mutation.addedNodes[0]._xseen = {
									'children'          : [],   // Children of this tag
                                    'Metadata'          : [],   // Metadata for this tag
                                    'tmp'               : [],   // tmp working space
                                    'attributes'		: [],   // attributes for this tag
                                    'animate'           : [],   // animatable attributes for this tag
                                    'animation'         : [],   // array of animations on this tag
                                    'properties'    	: [],   // array of properties (active attribute values) on this tag
                                    'class3d'           : [],   // 3D classes for this tag
                                    'parseComplete' 	: false,        // tag has been completely parsed
                                    'sceneInfo'         : mutation.target._xseen.sceneInfo,     // Runtime...
					};
					XSeen.Parser.Parse (mutation.addedNodes[0], mutation.target);
					if (mutation.target.localName == 'xr-scene' || mutation.target.localName == 'x-scene') {
						XSeen.Tags.scene.addScene();			// Not the most elegant way to do this... :-(
						XSeen.Runtime.ViewManager.setNext();	// Update the camera
					}
				}
			}),


	'TypeInfo'		: {
						'string'	: {'isNumeric':false, 'arrayAllowed':false, parseElements:false, numElements:1, },
						'boolean'	: {'isNumeric':false, 'arrayAllowed':false, parseElements:false, numElements:1, },
						'integer'	: {'isNumeric':false, 'arrayAllowed':true, parseElements:true, numElements:1, },
						'color'		: {'isNumeric':true, 'arrayAllowed':false, parseElements:true, numElements:-1, },
						'float'		: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:1, },
						'vec2'		: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:2, },
						'vec3'		: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:3, },
						'xyz'		: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:3, },
						'vec4'		: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:4, },
						'rotation'	: {'isNumeric':true, 'arrayAllowed':false, parseElements:true, numElements:-1, },
						'vector'	: {'isNumeric':true, 'arrayAllowed':true, parseElements:true, numElements:0, },
					},

	'defineTag' : function (tagObj, init, fin, events)
		{
			if (arguments.length != 1) {
				tagObj = {
						'name'		: tagObj,
						'init'		: init,
						'fin'		: fin,
						'events'	: events};		// Removed 'tick'
			}
			var tag = {
				'tag'			: XSeen.Parser._prefix + tagObj.name.toLowerCase(),
				'init'			: tagObj.init,
				'fin'			: tagObj.fin,
				'events'		: tagObj.events,
//				'tick'			: tagObj.tick,
				'attributes'	: [],
				'attrIndex'		: [],
				'eventHandlers'	: [],
				'addSceneSpace'	: function ()
					{
						var v = this
							.defineAttribute ({'name':'position', dataType:'xyz', 'defaultValue':{x:0, y:0, z:0}})
							.defineAttribute ({'name':'rotation', dataType:'rotation', 'defaultValue':[0,0,0]})
							.defineAttribute ({'name':'rotate-x', dataType:'float', 'defaultValue':0})
							.defineAttribute ({'name':'rotate-y', dataType:'float', 'defaultValue':0})
							.defineAttribute ({'name':'rotate-z', dataType:'float', 'defaultValue':0})
							.defineAttribute ({'name':'scale', dataType:'xyz', 'defaultValue':{x:1, y:1, z:1}});
						return v;
					},
				'defineAttribute'	: function (attrObj, dataType, defaultValue)
					{
						if (arguments.length != 1) {
							attrObj = {
										'name'				: attrObj,
										'dataType'			: dataType,
										'defaultValue'		: defaultValue,
										'isCaseInsensitive'	: true,
										'isAnimatable'		: null,
										'enumeration'		: [],
										'isArray'			: false,
									};
						}
						//console.log ('Data type of ' + attrObj.name + ' is ' + attrObj.dataType);
						if (typeof(attrObj.isAnimatable) == 'undefined') {
							attrObj.isAnimatable = (XSeen.Parser.TypeInfo[attrObj.dataType].isNumeric) ? true : false;
						}
						if (typeof(attrObj.elementCount) == 'undefined') {
							attrObj.elementCount = XSeen.Parser.TypeInfo[attrObj.dataType].numElements;
						} else {
							attrObj.elementCount = Math.max (XSeen.Parser.TypeInfo[attrObj.dataType].numElements, attrObj.elementCount);
						}
						var name = attrObj.name.toLowerCase();
						attrObj.enumeration = (typeof(attrObj.enumeration) == 'object') ? attrObj.enumeration : [];
						attrObj.isCaseInsensitive = (typeof(attrObj.isCaseInsensitive) !== 'undefined') ? attrObj.isCaseInsensitive : false;
						if (attrObj.dataType != 'string') {
							attrObj.isCaseInsensitive = true;
						} else {
							attrObj.isArray = false;
						}
						this.attributes.push ({
								'attribute'			: name,
								'type'				: attrObj.dataType,
								'default'			: attrObj.defaultValue,
								'enumeration'		: attrObj.enumeration,
								'elementCount'		: attrObj.elementCount,
								'isCaseInsensitive'	: attrObj.isCaseInsensitive,
								'isAnimatable'		: (typeof(attrObj.isAnimatable) !== null) ? attrObj.isAnimatable : false,
								'isEnumerated'		: (attrObj.enumeration.length == 0) ? false : true,
								'isArray'			: (typeof(attrObj.isArray) !== null) ? attrObj.isArray : false,
								'clone'				: this.cloneAttribute,
								'setAttrName'		: this.setAttrName,
								});
						this.attributes[name] = this.attributes[this.attributes.length-1];
						this.attrIndex[name] = this.attributes.length-1;
						return this;
					},

			// TODO: expand as more events are added
				'addEvents'	: function (handlerObj)
					{
						if (typeof(handlerObj.mutation) !== 'unknown' && typeof(handlerObj.mutation[0].attributes) !== 'unknown') {
							this.eventHandlers['mutation'] = {
																'options'	: {'attributes':true},
																'handler'	: handlerObj.mutation[0].attributes,
															};
						}
						return this;
					},

				'addTag'	: function () {
						XSeen.Parser.Table[this.tag] = this;
						//console.log ('** Adding ' + this.tag + ' to parsing table');
					},

				'cloneAttribute'	: function () {
					var newAttrObject = {
								'attribute'			: this.name,
								'type'				: this.type,
								'default'			: this.default,
								'enumeration'		: [],
								'isCaseInsensitive'	: this.isCaseInsensitive,
								'isAnimatable'		: this.isAnimatable,
								'isEnumerated'		: this.isEnumerated,
								'isArray'			: this.isArray,
								'clone'				: this.clone,
								'setAttrName'		: this.setAttrName,
					};
					for (var i=0; i<this.enumeration.length; i++) {
						newAttrObject.enumeration.push(this.enumeration[i]);
					}
					if (Array.isArray(this.default)) {
						newAttrObject.default = [];
						for (var i=0; i<this.default.length; i++) {
							newAttrObject.default.push(this.default[i]);
						}
					}
					return newAttrObject;
				},
				'setAttrName'	: function(newName) {
					this.attribute = newName;
					return this;
				},
			};
			return tag;
		},
		
	'getTag' : function (tagName)
		{
			if (typeof(tagName) == 'undefined' || tagName == '') {return null;}
			var tag = XSeen.Parser._prefix + tagName;
			if (typeof(XSeen.Parser.Table[tag]) == 'undefined') {return null;}
			return XSeen.Parser.Table[tag];
		},
		
// TODO: Debug element parse method
/*
 * This is called recursively starting with the first <xr-scene> tag
 */
	'Parse'	: function (element, parent)
		{
			var tagName = element.localName.toLowerCase();		// Convenience declaration
			if (tagName.substring(0,2) == XSeen.Parser._prefixAlt) {	// This logic assumes tagPrefixAlt is 2 characters
				tagName = XSeen.Parser._prefix + tagName.substring(2);
			}
			console.log ('Found ' + tagName);
			/*
			 *	If tag name is unknown, then print message; otherwise,
			 *	if element._xseen is defined, then node has already been parsed so ignore; otherwise,
			 *	Create all XSeen additions un element._xseen
			 *	Parse provided attributes
			 *	Redefine DOM methods for accessing attributes
			 */
			var tagEntry;
			if (typeof(XSeen.Parser.Table[tagName]) == 'undefined') {
				XSeen.LogDebug("Unknown node: " + tagName + '. Skipping all children.');
				//console.log ("DEBUG: Unknown node: " + tagName + '. Skipping all children.');
				return;
			} else if (element._xseen.parseComplete) {	// tag already parsed. Display message and ignore tag
				XSeen.LogDebug("Tag already parsed: " + tagName + '. Skipping all children.');
				//console.log ("DEBUG: Tag already parsed: " + tagName + '. Skipping all children.');
			} else {
				tagEntry = XSeen.Parser.Table[tagName];
				if (typeof(element._xseen) == 'undefined') {
					element._xseen = {
									'children'		: [],	// Children of this tag
									'Metadata'		: [],	// Metadata for this tag
									'tmp'			: [],	// tmp working space
									'attributes'	: [],	// attributes for this tag
									'animate'		: [],	// animatable attributes for this tag
									'animation'		: [],	// array of animations on this tag
									'properties'	: [],	// array of properties (active attribute values) on this tag
									'class3d'		: [],	// 3D classes for this tag
									'parseComplete'	: false,	// tag has been completely parsed
									};
				}
				element.makeActive = function(color) {
											obj3 = this._xseen.tagObject;
											if (typeof(obj3.children) != 'undefined' && typeof(obj3.children[0]) != 'undefined') obj3 = obj3.children[0];
											var boundingBox = new THREE.BoxHelper (obj3, color);
											var localTransform = new THREE.Matrix4();
											localTransform.getInverse(this._xseen.tagObject.matrixWorld);
											boundingBox.applyMatrix(localTransform);
											this._xseen.tagObject.add(boundingBox);
											return boundingBox;
										};
				element.makeInactive = function(boundingBox) {
											this._xseen.tagObject.remove(boundingBox);
											return {};
										};
				element.deltaRotateY = function(angle) {
											var q = new THREE.Quaternion();
											q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angle);
											element._xseen.tagObject.applyQuaternion(q);
										};
				element.getValue = function (attribute) {
											return element._xseen.attributes[attribute];
										};
				XSeen.Parser.ChildObserver.observe (element, {'childList':true});
				
				this.parseAttrs (element, tagEntry);
				//console.log ('Calling node: ' + tagName + '. Method: ' + tagEntry.init + ' (e,p)');
				//console.log('Calling node: ' + tagName + '. Method: init');
				XSeen.LogVerbose('Calling node: ' + tagName + '. Method: init');
				tagEntry.init (element, parent);
			}

			// Parse all of the children in order
			for (element._xseen.parsingCount=0; element._xseen.parsingCount<element.childElementCount; element._xseen.parsingCount++) {
				element.children[element._xseen.parsingCount]._xseen = {
									'children'		: [],	// Children of this tag
									'Metadata'		: [],	// Metadata for this tag
									'tmp'			: [],	// tmp working space
									'attributes'	: [],	// attributes for this tag
									'animate'		: [],	// animatable attributes for this tag
									'animation'		: [],	// array of animations on this tag
									'properties'	: [],	// array of properties (active attribute values) on this tag
									'class3d'		: [],	// 3D classes for this tag
									'parseComplete'	: false,	// tag has been completely parsed
									'sceneInfo'		: element._xseen.sceneInfo,	// Runtime...
									};
				this.Parse (element.children[element._xseen.parsingCount], element);
			}

			if (typeof(tagEntry) !== 'undefined') {
				element.addEventListener ('XSeen', tagEntry.events);
				//XSeen.LogInfo('Calling node: ' + tagName + '. Method: fin');
				tagEntry.fin (element, parent);
				if (typeof(element._xseen.tmp.meta) !== 'undefined' && element._xseen.tmp.meta.length != 0) {
					element._xseen.Metadata = element._xseen.tmp.meta;
					element._xseen.tmp.meta = [];
				}
				//XSeen.LogInfo('Return from node: ' + tagName + '. Method: fin');
				if (typeof(tagEntry.eventHandlers.mutation) !== 'undefined') {
					XSeen.Parser.AttributeObserver.observe (element, tagEntry.eventHandlers.mutation.options);
				}
				element._xseen.parseComplete = true;
			}
		},

/*
 *	Parse all defined attributes. The collection of classes is handled prior to the parsing
 *	of any attributes.
 *
// TODO: Handle ._xseen.rulesets in attribute parsing. Only applies if tag has attribute 'class3d' with a value
//			of an ID that is in the ruleset Object.
//	TODO: Expand the ruleset array to an object and provide a reverse lookup by ID to array index.
 *		StyleRules = {ruleset:[], idLookup:[]}
 *		where ruleset[idLookup['id']] is the ruleset defined by 'id'
 */

	'parseAttrs'	: function (element, tagObj)
		{
			element._xseen.parseAll = false;
			var classt = element.getAttribute('class3d');					// Get list of class3d (really IDs)
			var classes3d = (classt === null) ? [] : classt.split(' ');		// and split it (if defined)
			for (var ii=0; ii<classes3d.length; ii++) {						// Attaching all referenced class definitions to tag
				element._xseen.class3d.push (element._xseen.sceneInfo.StyleRules.idLookup[classes3d[ii]]);
				//element._xseen.sceneInfo.mutation.useClass3d (element, classes3d[ii]);
			}
			tagObj.attributes.forEach (function (attr, ndx, wholeThing)
				{
					var value = this.parseAttr (attr, element, element._xseen.class3d);
					if (value == 'XSeen.parse.all') {
						element._xseen.parseAll = true;
					} else {
						element._xseen.attributes[attr.attribute] = value;
						if (attr.isAnimatable) {element._xseen.animate[attr.attribute] = null;}
					}
				}, this);
		},
		
// TODO: Debug/Test reparseAttr method -- used for runtime changes to declarations
	'reparseAttr'	: function (ele, attributeName)
		{
			if (typeof(XSeen.Parser.Table[ele.localName]) === 'undefined') {return null;}
			var tagObj = XSeen.Parser.Table[ele.localName];
			if (typeof(tagObj.attributes[attributeName]) === 'undefined') {return null; }
			var attr = tagObj.attributes[attributeName];
			var value = XSeen.Parser.parseAttr (attr, ele, ele._xseen.class3d);
			return value;
		},
	'parseAttr'		: function (attr, ele, class3d)			// Parse an individual attribute
		{
			var classValue = this.getClassAttributeValue (attr.attribute, class3d)
			var value = ele.getAttribute(attr.attribute);
			if (value === null || value == '') {value = classValue;}
			//var valueParser = XSeen.Parser.Types[attr.type];
			if (attr.isArray) {
/*
 * TODO: Add another field to indicate if the value is an array. 'type' contains to be the basic data type in the array
 *	The return 'value' is an array of elements each of which is type 'type'
 *	Need to think how to parse the string to get the desired results
 *	Changes also needed above to accept the new input field 'isArray' (boolean)
 *
 *	1) Preprocessing value by removing all of the following characters: (),[]
 *	and converting all white space to a single space (this may apply to all value parsing)
 *	2) Get # of components array element
 *	3) Parse each array element individually, storing the parsed value into an array
 *	4) Not sure how to handle an parse (character sequence) error
 *	5) JavaScript Regex parser can split a string into elements <regex>.split(<string>)
 *		[+-]?\d* for decimal integers
 *		[+-]?\d*\.?\d* for floating point (non-exponential)
 *		[+-]?\d*\.?\d*[eE][+-]\d+ for floating point (exponential)
 *	  Need hex and octal integers. Does not support non-numeric color or rotation formats 
 *	Method for (2) can return an array containing the component grouping for parsing
 *	It needs the value data type and value string
 *
 */
/*
				function getElementsFromArray (ea, ndx, increment) {
					var ev = [];
					for (var ii=ndx; ii<ndx+increment; ii++) {
						ev.push(ea[ii]);
					}
					return ev;
				}
 */
				// Illegal datatype for an array. Return default
				if (!XSeen.Parser.TypeInfo[attr.type].arrayAllowed || attr.elementCount < 1) {
					if (value == '') {value = attr.default;}
					return value;
				}
				if (typeof(value) == 'undefined' || value === null || value.length == 0) {return value; }

				// Pass entire elementArray into <dataType> parser. It returns the parsed object
				// Somehow need to get #elements per parsed value XSeen.Parser.TypeInfo[<dataType>].numElements
				// Need to do something similar for regular elements. Perhaps check datatype,
				//	if string then call _elementSplit; otherwise use it
				valueArray = XSeen.Parser.parseArrayValue (value, attr.elementCount, attr.type, attr.default);
				return valueArray;
/*
				var elementArray = XSeen.Parser.Types._elementSplit (value);
				var increment = attr.elementCount;
				var collectionCount = increment / XSeen.Parser.TypeInfo[attr.type].numElements;
				var ndx = 0;
				var valueArray=[], elementValues=[], tmp;
				while (ndx < elementArray.length) {
					tmp = [];
					for (var jj=0; jj<collectionCount; jj++) {
						elementValues = getElementsFromArray (elementArray, ndx, XSeen.Parser.TypeInfo[attr.type].numElements);
						ndx += XSeen.Parser.TypeInfo[attr.type].numElements;
						tmp.push (XSeen.Parser.Types[attr.type](elementValues, attr.default, false, attr.enumeration));
					}
					if (collectionCount == 1) {
						valueArray.push (tmp[0]);
					} else {
						valueArray.push (tmp);
					}
					//ndx += increment;
				}
				return valueArray;
 */
 
			} else {
				//value = XSeen.Parser.Types[attr.type] (value, attr.default, attr.caseInsensitive, attr.enumeration);
				value = XSeen.Parser.Types[attr.type] (value, attr.default, attr.caseInsensitive, attr.enumeration);
			}
			return value;
		},
	'getClassAttributeValue' : function (attribute, classList)
		{
			var classValue = null;
			if (classList === null) {return classValue;}
			for (var ii=0; ii<classList.length; ii++) {
				for (var jj=0; jj<classList[ii].declaration.length; jj++) {
					if (classList[ii].declaration[jj].property == attribute) {
						classValue = classList[ii].declaration[jj].value;
					}
				}
			}
			return classValue;
		},

/*
 * Pass entire elementArray into <dataType> parser. It returns the parsed object
 * Somehow need to get #elements per parsed value XSeen.Parser.TypeInfo[<dataType>].numElements
 * Need to do something similar for regular elements. Perhaps check datatype,
 * if string then call _elementSplit; otherwise use it
 */
	'parseArrayValue'	: function (attrValue, elementCount, attrType, attrDefault)
		{
			function getElementsFromArray (ea, ndx, increment) {
				var ev = [];
				for (var ii=ndx; ii<ndx+increment; ii++) {
					ev.push(ea[ii]);
				}
				return ev;
			}

			var elementArray = XSeen.Parser.Types._elementSplit (attrValue);
			var numElements = XSeen.Parser.TypeInfo[attrType].numElements;
			var collectionCount = elementCount / numElements;
			var totalElements = elementArray.length;
			var ndx = 0;
			var valueArray=[], elementValues=[], tmp;
			while (ndx < totalElements) {
				tmp = [];
				for (var jj=0; jj<collectionCount; jj++) {
					elementValues = getElementsFromArray (elementArray, ndx, numElements);
					ndx += numElements;
					tmp.push (XSeen.Parser.Types[attrType](elementValues, attrDefault, false, ''));
				}
				if (collectionCount == 1) {
					valueArray.push (tmp[0]);
				} else {
					valueArray.push (tmp);
				}
			}
			return valueArray;
		},


/*
 *	Returns all of the available information about a specified field in a given tag. The
 *	property 'good' indicates that everything was found and could be handled. If 'good' is FALSE, then
 *	something went wrong or is missing.
 */
	'getAttrInfo' : function (tagName, attrName) {
		var attrInfo = {'good': false, 'tagExists': false, 'attrExists': false};
		if (typeof(tagName) === 'undefined' || tagName == '' || typeof(attrName) === 'undefined' || attrName == '') {return attrInfo;}
		var tagName = tagName.toLowerCase();
		if (typeof(XSeen.Parser.Table[tagName]) === 'undefined') {
			return attrInfo;
		}		// TODO: Need to convert all following from node => tag; field => attribute; and use new structures
		attrInfo.tagExists = true;
		var tag = XSeen.Parser.Table[tagName];
		var attrName = attrName.toLowerCase();
		if (typeof(tag.attrIndex[attrName]) === 'undefined') {
			return attrInfo;
		}
		attrInfo.attrExists = true;
		var attribute = tag.attributes[tag.attrIndex[attrName]];
		attrInfo.tag			= tag;
		attrInfo.attribute		= attribute;
		attrInfo.handlerName	= tag.event;
		attrInfo.dataType		= attribute.type;
		attrInfo.default		= attribute.default;
		attrInfo.elementCount	= attribute.elementCount;
		attrInfo.good = true;
		return attrInfo;
	},

// Utility methods for dealing with the entire parse table
	'dumpTable'	: function ()
		{
			var jsonstr = JSON.stringify ({'tags': XSeen.Parser.Table}, null, '  ');
			console.log('Node parsing table (' + XSeen.Parser.Table.length + ' tags)\n' + jsonstr);
			return jsonstr;
		},

// TODO: Write load function
	'loadTable'	: function (jsonstr)
		{
			var jsonstr = JSON.stringify ({'tags': XSeen.Parser.Table}, null, '  ');
			XSeen.Parser.Table = [];
		},
		
/*
 * DataType handlers. This convert from the user HTML to internal structure
 *	New types can be added in XSeen.Parser.Types.<new-name> = function (<attribute-value-string>, <attribute-default>, <value-caseInsensitive>, <attribute-enumeration-array>)
 *	The value returned is the parsed value in the requested datatype.
 *
 *	Only the string methods use 'insensitive'. Color is always converted to lower case.
 *	None of the vector or boolean methods use 'enumeration'
 */
	'Types'	: {
		'_checkEnumeration'	: function (value, def, enumeration)
			{
				for (var ii=0; ii<enumeration.length; ii++) {
					if (value == enumeration[ii]) {return value;}
				}
				if (enumeration.length == 0) {return value;}
				return def;
			},
/*
 *	Splits a string on white space, comma, paranthese, brackets; after triming for same
 *	Designed for a serialized collection of numeric values as a vector.
 *	Output is the array of split values
 */
		'_elementSplit'	: function(string) 
			{
				myRe = /[\s,\(\[\]\)]+/;
				return string.replace(/^[\s,\(\[\]\)]+|[\s,\(\[\]\)]+$/g, '').split (myRe);
			},

		'_splitArray'	: function (value, def, minCount)
			{
				if (typeof(value) == 'object') {
					return (value.length < minCount) ? def : value;
				}
				//console.log('Splitting |'+value+'|');
				var arrayValue = value.split(' ');
				if (arrayValue.length < minCount) {return def;}
				return arrayValue;
			},

		'string'	: function(value, def, insensitive, enumeration) 
			{
				if (insensitive) {value = value.toLowerCase();}
				if (value === null) {return def;}
				return this._checkEnumeration (value, def, enumeration);
			},
		'integer'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				if (Number.isNaN(value)) {return def};
				return Math.round(this._checkEnumeration (value, def, enumeration));
			},
		'float'		: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				if (Number.isNaN(value)) {return def};
				return this._checkEnumeration (value, def, enumeration)-0;
			},
		'vec2'		: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				//console.log('vec2 need to split |'+value+'|');
				var arrayValue = this._splitArray (value, def, 2);
				var retValue = [this.float(arrayValue[0], def[0], false, []),
								this.float(arrayValue[1], def[1], false, [])];
				return retValue;
			},
		'vec3'		: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				//console.log('vec3 need to split |'+value+'|');
				var arrayValue = this._splitArray (value, def, 3);
				var retValue = [this.float(arrayValue[0], def[0], false, []),
								this.float(arrayValue[1], def[1], false, []),
								this.float(arrayValue[2], def[2], false, [])];
				return retValue;
			},
		'xyz'		: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				var arrayValue = this._splitArray (value, def, 3);
				var retValue = {x:this.float(arrayValue[0], def[0], false, []),
								y:this.float(arrayValue[1], def[1], false, []),
								z:this.float(arrayValue[2], def[2], false, [])};
				return retValue;
			},
		'vec4'		: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				var arrayValue = this._splitArray (value, def, 4);
				var retValue = [this.float(arrayValue[0], def[0], false, []),
								this.float(arrayValue[1], def[1], false, []),
								this.float(arrayValue[2], def[2], false, []),
								this.float(arrayValue[3], def[3], false, [])];
				return retValue;
			},
		'vector'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				var arrayValue = this._splitArray (value, def);
				return arrayValue;
			},
		'boolean'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) return def;
				if (value === '') return def;
				var svalue = value.toLowerCase();
				if (svalue == '') return def;
				if (svalue == 'f' || svalue == 'false' || svalue == '0') return false;
				var ivalue = Boolean (value);
				return ivalue;
			},
		'vecToFloat3'	: function (value, def)
			{
				var retValue = [
					this.float(value[0], def[0], false, []),
					this.float(value[1], def[1], false, []),
					this.float(value[2], def[2], false, []),
				];
				return retValue;
			},
		'vecToXYZ'	: function (value, def)
			{
				var retValue = {
					'x':this.float(value[0], def.x, false, []),
					'y':this.float(value[1], def.y, false, []),
					'z':this.float(value[2], def.z, false, []),
				};
				return retValue;
			},
		'rotation2Quat'	: function (value)		// Converts axis-angle (vec4) to quaternion
			{
				var quat = new THREE.Quaternion();
				quat.setFromAxisAngle (new THREE.Vector3(value[0], value[1], value[2]), value[3]);
				return quat;
			},

/*
 * Color parsing order
 *	<integer>; Integer [0-16777215]. Key integer within range.
 *	#HHHHHH	24-bit hex value indicating color. Key '#'
 *	rgba(r g b a): where r,g,b are either byte-integers [0,255] or percent [0%-100%]; and a is [0.0-1.0] Key 'rgba(' and '%'
 *	rgb(r g b): where r,g,b are either byte-integers [0,255] or percent [0%-100%]. Key 'rgb(' and '%'
 *	f3(r g b): where r,g,b are fraction color values [0,1]. Key 'f3('
 *	f4(r g b a): where r,g,b are fraction color values [0,1]; and a is [0.0-0.1] Key 'f4(' 
 *	hsla(h,s,l,a): where h is [0-360], s&l are [0-100%]. Key 'hsla('
 *	hsl(h,s,l): where h is [0-360], s&l are [0-100%]. Key 'hsl('
 *	<color-name>: One of the 140 predefined HTML color names. This is enumerable (but not yet)
 *	<default used>
 */
		'color'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				value = value.trim().toLowerCase();
				if (!Number.isNaN(value) && Math.round(value) == value && (value-0 <= 16777215) && (value-0 >= 0)) {return this.colorIntRgb(value);}

				if (value.substring(0,1) == '#') {
					value = '0x' + value.substring(1,value.length) - 0;
					if (Number.isNaN(value) || value < 0 || value > 16777215) {return def;}
					return this.colorIntRgb(value);
				}
				
				if (value.substring(0,3) == 'rgb') {
					XSeen.LogWarn("RGB[A] color not yet implemented");
					console.log ("WARN: RGB[A] color not yet implemented");
				}
				if (value.substring(0,3) == 'hsl') {
					XSeen.LogWarn("HSL[A] color not yet implemented");
					console.log ("WARN: HSL[A] color not yet implemented");
				}
				if (value.substring(0,3) == 'f3(') {
					XSeen.LogWarn("HSL[A] color not yet implemented");
					console.log ("WARN: HSL[A] color not yet implemented");
					if (value.substring(value.length-1,value.length) != ')') {
						XSeen.LogWarn ("WARN: Illegal syntax for f3 color -- no closing ')'");
						console.log ("WARN: Illegal syntax for f3 color -- no closing ')'");
					} else {
						var colorString = value.substring(3,value.length-1);
						var colors = colorString.split(' ');
						return {'r':colors[0], 'g':colors[1], 'b':colors[2]};
					}
				}
				if (value.substring(0,3) == 'f4(') {
					XSeen.LogWarn("F4 color not yet implemented");
					console.log ("WARN: F4 color not yet implemented");
				}
				
				if (typeof(XSeen.CONST.Colors[value]) === 'undefined') {return def;}
				return this.colorIntRgb(XSeen.CONST.Colors[value]);	// TODO: add check on enumeration
				//return def;
			},
		'colorIntRgb' : function (colorInt)
			{
				var r = (colorInt & 0xff0000) >>> 16;
				var g = (colorInt & 0x00ff00) >>> 8;
				var b = (colorInt & 0x0000ff);
				return {'r':r/255., 'g':g/255., 'b':b/255.};
			},
		'colorRgbInt' : function (color)
			{
				if (typeof (color) !== 'object') return 0;
				var colorInt =	(Math.round(color.r*255) << 16) |
								(Math.round(color.g*255) << 8) |
								(Math.round(color.b*255));
				return colorInt;
			},

/*
 * Rotation parsing order
 *	e(rx ry rz): Euler rotation about (in local order) X, Y, and Z axis
 *	q(x y z w): Quaternion with 4 components
 *	h(x y z t): Homogeneous rotation of 't' about the vector [x, y, z]
 *	The default is e(). The 'e' and parantheses are optional. Case and spacing are important.
 *	The return value is always a quaternion
 *
 *	Only the following formats are implementated:
 *	1) Euler rotation without 'e(' and ')'
 *	2) Euler rotation with 'e(' and ')'
 *	3) Homogeneous (axis-angle) rotation with 'h(' and ')'
 */
		'rotation'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {value = def;}
				if (value == '') {value = def;}
				var eulerAngles, processed = false;
				var quat = new THREE.Quaternion();

				if (typeof(value) == 'string') {
					if (value.substring(0,2) == 'h(') {
						processed = true;
						value = value.substring(2,value.length-1);
						var axisAngle = this.vec4 (value, def, true, [0, 1, 0, 0]);
						quat = this.rotation2Quat (axisAngle);
						
					} else if (value.substring(0,2) == 'q(') {
						console.log ('WARN: No support yet for quaternion form of rotation');
						value = def;
						eulerAngles = this.vec3 (value, def, true, []);
	
					} else if (value.substring(0,2) == 'e(') {
						value = value.substring(2,value.length-1);
						eulerAngles = this.vec3 (value, def, true, []);

					} else {
						eulerAngles = this.vec3 (value, def, true, []);
					}
					
				} else {
					eulerAngles = value;
				}
				if (!processed) {
					var euler = new THREE.Euler();
					euler.fromArray (eulerAngles);
					quat.setFromEuler (euler);
				}
				return quat;
			},

	},		// End of 'Types' object
		
};
// File: ./XSeen.js
/*
 * XSeen JavaScript Library
 * http://tools.realism.com/...
 *
 * (C)2017 Daly Realism, Los Angeles
 * Some pieces may be
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 *

 * NEXT: 
 Rewrite code for handling cubemap images to support both x-cubemap and solid geometry nodes
 Investigate failure of device mode tracking when in portrait mode
 
 *TODO:
 *	Fix viewing controls when AR requested but not capable
 *	Spherical harmonics environment map lighting
 *	Update to latest THREE and various libraries (V0.9)
 *	Audio (V0.9)
 * 	WebRTC?
 *	Create event for parsing complete (xseen-parsecomplete). This potentially starts animation loop
 *	Resolve CAD positioning issue
 *	Additional PBR
 *	Fix for style3d (see embedded TODO)
 *	Editor
 *	Events (add events as needed)
 *	Labeling (add space positioning)
 *	Fog needs mutation functionality
 *	Scene camera needs fixing when multiple cameras with different controls are in use
 *	Add Orthographic camera
 XX	Create event to start animation loop (xseen-readyanimate). This happens after multi-pass parsing is complete.
 XX	Check background image cube for proper orientation (done See starburst/[p|n][x|y|z].jpg)
 XX Create XSeen logo
 XX Stereo camera automatically adds button to go full screen. Add "text" attribute to allow custom text.
 * 
 */

XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;
XSeen.Constants = {
					'_Major'		: 0,		// Creates version as Major.Minor.Patch
					'_Minor'		: 8,
					'_Patch'		: 1,
					'_PreRelease'	: '',		// Sets pre-release status (usually Greek letters)
					'_Release'		: 8,		// Release proceeded with '+'
					'_Version'		: '',
					'_RDate'		: '2019-08-19',
					'_SplashText'	: ["XSeen 3D Language parser.", "XSeen <a href='https://xseen.org/index.php/documentation/' target='_blank'>Documentation</a>."],
					'tagPrefix'		: 'xr-',
					'tagPrefixAlt'	: 'x-',
					'rootTag'		: 'scene',
					};
XSeen.CONST = XSeen.DefineConstants();
XSeen.Time =  {
					'start'		: (new Date()).getTime(),
					'now'		: (new Date()).getTime(),
				};
// Using the scheme at http://semver.org/
XSeen.Version = {
			'major'			: XSeen.Constants._Major,
			'minor'			: XSeen.Constants._Minor,
			'patch'			: XSeen.Constants._Patch,
			'preRelease'	: XSeen.Constants._PreRelease,
			'release'		: XSeen.Constants._Release,
			'version'		: XSeen.Constants._Major + '.' + XSeen.Constants._Minor + '.' + XSeen.Constants._Patch,
			'date'			: XSeen.Constants._RDate,
			'splashText'	: XSeen.Constants._SplashText,
			};
XSeen.Version.version += (XSeen.Version.preRelease != '') ? '-' + XSeen.Version.preRelease : '';
XSeen.Version.version += (XSeen.Version.release != '') ? '+' + XSeen.Version.release : '';

// Holds the list of onLoad callbacks
if (typeof(XSeen.onLoadCallBack) === 'undefined') {
	XSeen.onLoadCallBack = [];
}

// Holds all of the parsing information
XSeen.parseTable = [];

// Data object for Runtime
// Stereo viewing effect from http://charliegerard.github.io/blog/Virtual-Reality-ThreeJs/
//var StereoRenderer = new THREE.StereoEffect(Renderer);
XSeen.Runtime = {
			'currentTime'			: 0,			// Current time at start of frame rendering
			'deltaTime'				: 0,			// Time since last frame
			'frameNumber'			: 0,			// Number of frame about to be rendered
			'Time'					: new THREE.Clock(),
			'Renderer'				: {},			// Active renderer in current use.
			'RendererStandard'		: {},			// One of these two renderers are used. 'onLoad' declares 
			'RendererStereo'		: {},			// these and 'camera' chooses which one
			'Camera'				: {},			// Current camera in use
			'CameraControl'			: {},			// Camera control to be used in Renderer for various types
			'DefinedCameras'		: [],			// Array of defined cameras
			'ViewManager'			: XSeen.CameraManager,
			'Mixers'				: [],			// Internal animation mixer array
			'perFrame'				: [],			// List of methods with data to execute per frame
			'Animate'				: function() {	// XSeen animation loop control
										//console.log ('Rendering loop, isStereographic: ' + XSeen.Runtime.isStereographic);
										if (XSeen.Runtime.isStereographic) {
											requestAnimationFrame (XSeen.Runtime.Animate);
											XSeen.RenderFrame();
										} else {
											XSeen.Runtime.Renderer.animate (XSeen.RenderFrame);
										}
									},
			'TweenGroups'			: [],
			'Resize'				: function () {
										if (!XSeen.Runtime.isStereographic) {
											XSeen.Runtime.Size = XSeen.updateDisplaySize (XSeen.Runtime.RootTag);
											XSeen.Runtime.Camera.aspect = XSeen.Runtime.Size.width / XSeen.Runtime.Size.height;
											XSeen.Runtime.Camera.updateProjectionMatrix();
											XSeen.Runtime.Renderer.setSize (XSeen.Runtime.Size.width, XSeen.Runtime.Size.height)
										}
									},
			'rulesets'				: [],			// Style ruleset array structure
			'StyleRules'			: {				// Collection of style rulesets
				'ruleset'	: [],					// Specific ruleset
				'idLookup'	: []	},				// Cross-reference into 'rulesets' by 'id'
			'selectable'			: [],			// Selectable geometry elements
			'_deviceCameraElement'	: 0,			// Element for camera connection. May be deprecated
			'isVrCapable'			: false,		// WebVR ready to run && access to VR device 
			'hasDeviceOrientation'	: false,		// device has Orientation sensor
			'hasVrImmersive'		: false,		// hasDeviceOrientation && stereographic capable (=== TRUE)
			'useDeviceOrientation'	: false,		// display is using device's Orientation sensor
			'isStereographic'		: false,		// currently running stereographic display (not VR)
			'rendererHasControls'	: false,		// Renderer has built-in motion controls
			'isProcessingResize'	: false,		// semaphore for resizing processing
			'mediaAvailable'		: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),	// flag for device media availability
			'isTransparent'			: false,		// flag for XSeen transparent background
			'allowAR'				: false,		// flag for allowing AR (does not presume camera permission)
			};										// Need place-holder for xR scene (if any -- tbd)
			
XSeen.RenderFrame = function()
	{
		if (XSeen.Runtime.isProcessingResize) {return;}		// Only do one thing at a time

		if (XSeen.Runtime.frameNumber == 0) {		// TODO: Replace with 'dirty' flag. May not need loadingComplete
			if (XSeen.Loader.loadingComplete()) {	//	Code needs to set Runtime.nodeChange whenever nodes are added/removed
				XSeen.Tags.scene.addScene();
				document.getElementById('XSeen-Splash').style.display = 'none';
				console.log ('***Rendering first frame');
			} else {
				return;
			}
		}
		XSeen.Runtime.deltaTime = XSeen.Runtime.Time.getDelta();
		XSeen.Runtime.currentTime = XSeen.Runtime.Time.getElapsedTime();
		XSeen.Runtime.frameNumber ++;

		var newEv = new CustomEvent('xseen-render', XSeen.Events.propertiesRenderFrame(XSeen.Runtime));
		XSeen.Runtime.RootTag.dispatchEvent(newEv);
		
/*
 *	Do various subsystem updates. Order is potentially important. 
 *	First position/orient camera & frame size so any calculations done on that use the new position
 *	Mixes handle internal (within model) animations
 *	Tween handles user-requested (in code) animations
 */
		XSeen.Update.Camera (XSeen.Runtime);
		XSeen.Update.Mixers (XSeen.Runtime);
		XSeen.Update.Tween (XSeen.Runtime);
		if (XSeen.Runtime.frameNumber > 1) XSeen.Update.Ticks (XSeen.Runtime);

		XSeen.Runtime.Renderer.render( XSeen.Runtime.SCENE, XSeen.Runtime.Camera );
	};
	
XSeen.Update = {
	'Tween'		: function (Runtime)
		{
			TWEEN.update();
			if (typeof(Runtime.TweenGroups) != 'undefined') {
				for (var ii=0; ii<Runtime.TweenGroups.length; ii++) {
					Runtime.TweenGroups[ii].update();
				}
			}
		},
	'Mixers'	: function (Runtime)
		{
			if (typeof(Runtime.Mixers) === 'undefined') return;
			for (var i=0; i<Runtime.Mixers.length; i++) {
				Runtime.Mixers[i].update(Runtime.deltaTime);
			}
		},
	'Ticks'		: function (Runtime)
		{
			for (var i=0; i<Runtime.perFrame.length; i++) {
				Runtime.perFrame[i].method (Runtime, Runtime.perFrame[i].userdata);
			}

		},
	'Camera'	: function (Runtime)
		{
			if (!Runtime.rendererHasControls) {
				Runtime.CameraControl.update();
			}
		},
	}

// Run the 'onLoad' method when the page is fully loaded
window.document.addEventListener('DOMContentLoaded', XSeen.onLoad);

//window.document.addEventListener('DOMContentLoaded', XSeen.onLoadStartProcessing);
window.document.addEventListener('xseen-initialize', XSeen.onLoadStartProcessing);
// File: tags/$.js
// General Tag support functions

XSeen.Tags._changeAttribute = function (e, attributeName, value) {
			//console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;

// Set standard reference for base object based on stored type
				var baseMaterial, baseGeometry, baseMesh, baseType='';
				if (e._xseen.tagObject.isMesh) {
					baseMaterial	= e._xseen.tagObject.material;
					baseGeometry	= e._xseen.tagObject.geometry;
					baseMesh		= e._xseen.tagObject;
					baseType		= 'mesh';
				} else if (e._xseen.tagObject.isMaterial) {
					baseMaterial	= e._xseen.tagObject;
					baseType		= 'material';
				} else if (e._xseen.tagObject.isGeometry) {
					baseGeometry	= e._xseen.tagObject;
					baseType		= 'geometry';
				} else if (e._xseen.tagObject.isGroup) {
					baseMesh		= e._xseen.tagObject;
					baseType		= 'group';
				}
					
				if (attributeName == 'color') {				// Different operation for each attribute
					baseMaterial.color.setHex(value);	// Solids are stored in a 'group' of the tagObject
					baseMaterial.needsUpdate = true;
				} else if (attributeName == 'env-map') {				// Different operation for each attribute
					//console.log ('Changing envMap to |' + value + '|');
					e._xseen.properties.envMap = XSeen.Tags.Solids._envMap(e, value);
				} else if (attributeName == 'metalness') {
					//console.log ('Setting metalness to ' + value);
					baseMaterial.metalness = value;
				} else if (attributeName == 'roughness') {
					//console.log ('Setting roughness to ' + value);
					baseMaterial.roughness = value;
				} else if (attributeName == 'position') {
					//console.log ('Setting position to ' + value);
					baseMesh.position.x = value.x;
					baseMesh.position.y = value.y;
					baseMesh.position.z = value.z;
				} else if (attributeName == 'rotation') {
					//console.log ('Setting rotation to ' + value);
					if (typeof(value.w) != 'undefinedd') {
						baseMesh.setRotationFromQuaternion (value);
					} else {
						baseMesh.rotation.x = value.x;
						baseMesh.rotation.y = value.y;
						baseMesh.rotation.z = value.z;
					}
				} else if (attributeName == 'material') {
					var ele = document.getElementById (value);
					if (typeof(ele) != 'undefined') {
						console.log ('Changing to asset material: ' + value);
						e._xseen.tagObject.material = ele._xseen.tagObject;
					} else {
						console.log ('No material asset: |'+value+'|');
					}
				} else if (attributeName == 'visible') {
					baseMesh.visible = value;
				} else {
					XSeen.LogWarn('No support for updating ' + attributeName);
				}
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}
};
// File: tags/animate.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 *
 */

 // Tag definition code for animate

/*
 * <animate ...> tag with <key> child
 *	animate defines overall properties. It is possible to define animation without key.
 *	'key' provides the individual key frames. If the only key frames are the beginning and end,
 *	it is not necessary to use <key> children.
 *
 *	If duration attribute is '0' (or converts to it or is blank), then the value of <key duration> is used
 *	to compute the total duration (>0)
 *	The value of 'when' is the fraction [0,1] where that key frame occurs. keys with when <0 or when >1 are ignored
 *
 *	Each key may describe the animation curve and ease-in/out from when it starts for its duration.
 */

XSeen.Tags.animate = {
	'cnv'	: {		/* Insures that the correct case is used */
			'style' : {'in':'In', 'out':'Out', 'inout': 'InOut'},
			'type': {'linear':'Linear', 'quadratic':'Quadratic', 'sinusoidal':'Sinusoidal', 'exponential':'Exponential', 'elastic':'Elastic', 'bounce':'Bounce'},
			},
	'_easeCheck' : function (direction, type, store)
		{
			direction = (type != 'linear' && direction == '') ? 'inout' : direction;
			if (direction != '') {
				type = (type == 'linear') ? 'quadratic' : type;
				direction = XSeen.Tags.animate.cnv.style[direction];
				type = XSeen.Tags.animate.cnv.type[type];
			} else {
				direction = 'None';
				type = 'Linear';
			}
			store.easing = direction;
			store.easingtype = type;
		},
	_getTo: function (e, attrObject, toAttribute)
		{
			var to, interpolation, startingValue;
			to = XSeen.Parser.parseAttr(attrObject, e, []);	// Parsed data  -- need to convert to THREE format
			if (attrObject.type == 'float') {
				interpolation = TWEEN.Interpolation.Linear;
				to = XSeen.Parser.Types.float(to, 0.0, false, []);
				startingValue = 0;	// TODO: Only should be 0 if cannot get value from object
				XSeen.LogInfo("Interpolating field '" + toAttribute + "' as float.");

			} else if (attrObject.type == 'vec3') {
				interpolation = TWEEN.Interpolation.Linear;
				to = XSeen.Parser.Types.vecToXYZ(to, {'x':0,'y':0,'z':0});
				XSeen.LogInfo("Interpolating field '" + toAttribute + "' as 3-space.");

			} else if (attrObject.type == 'xyz') {				// No parsing necessary
				interpolation = TWEEN.Interpolation.Linear;
				XSeen.LogInfo("Interpolating field '" + toAttribute + "' as 3-space (no parse).");

			} else if (attrObject.type == 'color') {
				interpolation = XSeen.Tags.animate.Interpolator.color;
				if (typeof(to) == 'string') {to = new THREE.Color (XSeen.Parser.Types.color(to));}
				XSeen.LogInfo("Interpolation field '" + toAttribute + "' as color.");

			} else if (attrObject.type == 'vec4' || attrObject.type == 'rotation') {
				interpolation = XSeen.Tags.animate.Interpolator.slerp;
				//to = XSeen.types.Rotation2Quat(to);
				XSeen.LogInfo("Interpolation field '" + toAttribute + "' as rotation.");

			} else {
				XSeen.LogInfo("Field '" + toAttribute + "' not converted to THREE format. No animation performed.");
				return {'to':null, 'interpolation':null};
			}
			return {'to':to, 'interpolation':interpolation};
		},

	/*
	 *	The attribute maps to internal variables as follows (e._xseen):
	 *	delay ==> .delay -- Initial delay of animation
	 *	duration <= 0 ==> .keyFraction = false
	 *	duration > 0 ==> .keyFraction = true
	 *	duration ==> .duration (must be >= 0;otherwise ==0)
	 *	yoyo ==> .yoyo
	 *	repeat ==> .repeat (>= 0), Infinity (<0)
	 *	easing ==> .easing
	 *	easingType ==> .easingType
	 *	key[keyFrame_1{}, keyFrame_2{}, keyFrame_3{}, ...]
	 *
	 *	Each 'key' child provides the following
	 *	if !.keyFraction, then p._xseen.duration += e._xseen.duration
	 *	if .keyFraction && (when < 0 || when > 1) then ignore tag
	 *	p._xseen.key.push ({duration:, easing:, easingType, to:}) 
	 */
	'init'	: function (e,p) 
		{
			if (e._xseen.attributes.duration > 0) {
				e._xseen.keyFraction = true;
			} else {
				e._xseen.keyFraction = false;
				e._xseen.attributes.duration = 0;
			}
			XSeen.Tags.animate._easeCheck (e._xseen.attributes.easing, e._xseen.attributes.easingtype, e._xseen.attributes);
			e._xseen.key = [];
			
//	Save parent attribute object for requested field
			var toAttribute = e._xseen.attributes.attribute;
			var attributes = XSeen.Parser.Table[p.localName.toLowerCase()].attributes;
			e._xseen.attrObject = attributes[toAttribute].clone().setAttrName('to');	// Parse table entry for 'toAttribute'
			e._xseen.tagObject = new TWEEN.Group();
			
//	Revise code below here
/*
			var interpolator = e._xseen.attributes.interpolator;	// Not used (yet?)
			
			var attributes = XSeen.Parser.Table[p.localName.toLowerCase()].attributes;
			var attrIndex = XSeen.Parser.Table[p.localName.toLowerCase()].attrIndex;
			var toAttribute = e._xseen.attributes.attribute;
			var toAttrIndex = attrIndex[toAttribute];
			if (typeof(attributes[toAttrIndex]) === 'undefined') {
				XSeen.LogInfo("Field '" + toAttribute + "' not found in parent (" + p.localName.toLowerCase() + "). No animation performed.");
				return;
			}
			var attrObject = attributes[toAttrIndex].clone().setAttrName('to');	// Parse table entry for 'toAttribute'
 */
		},

	'fin'	: function (e,p)
		{
			//console.log ('Check e._xseen.key for correct values');

			var duration = e._xseen.attributes.duration * 1000;	// TEMP: Convert to milliseconds
			var delay = e._xseen.attributes.delay * 1000;		// Convert to milliseconds
			//TEMP//var duration = e._xseen.attributes.duration * 1000;	// Convert to milliseconds
			var yoyo = e._xseen.attributes.yoyo;
			var repeat = (e._xseen.attributes.repeat < 0) ? Infinity : e._xseen.attributes.repeat;
			
/*
 * Convert 'to' to the datatype of 'field' and set interpolation type.
 *	interpolation is the type of interpolator (space, color space, rotational space)
 *	startingValue is the initial value of the field to be interpolated. The interpolation will update this field
 *		during animation. If the scene field needs a setter method, then use a local value. 
 *
 * TODO: Make sure local value is not overwritten on subsequent calls
 *	Really have no idea how to do this. Would like to have field.sub-field cause all sorts of 
 *	neat things to happen from a user perspective. I am not seeing how to do this for a general case.
 *	May need to handle things separately for each animation type.
 */
			var interpolation, startingValue;
			var attrObject = e._xseen.attrObject;
			var toAttribute = e._xseen.attributes.attribute;
			//console.log ('Check for keyframes ... count: ' + e._xseen.key.length);
			if (e._xseen.key.length == 0) {		// Block handles no key frames
				var target = XSeen.Tags.animate._getTo (e, e._xseen.attrObject, e._xseen.attributes.attribute);
				if (target.to === null) {return; }
			
/*
 * Method when attribute value is handled via setter
 *	The attribute is a function rather than an object. The function handles the
 *	computation of the interpolant and updating of results. It is the argument
 *	of the .onUpdate method of Tween. The function takes the TweenData object as 
 *	an argument and updates the necessary field.
 */

				var fieldTHREE, useUpdate, tween, startingValue;
				if (typeof(p._xseen.animate[toAttribute]) == 'function') { 
					fieldTHREE = p._xseen.attributes[toAttribute];		// THREE field for animation
					var setter = {'from':fieldTHREE, 'current':fieldTHREE, 'attribute':toAttribute};
					useUpdate = true;
					tween = new TWEEN.Tween (setter, e._xseen.tagObject)
										.to({'current':target.to}, duration)
										.onUpdate(p._xseen.animate[toAttribute]);
					startingValue = fieldTHREE;

				} else {
					fieldTHREE = p._xseen.animate[toAttribute];			// THREE field for animation
																// TODO: The 'animate' array needs to be populated
																//	with the field in the tag object
																//	(._xseen.tagObject) that uses this label.
																//	The population MUST be done in the tag method
																//	as it is the only place it is defined. There is
																//	a problem if the object is not yet build :-(
					useUpdate = false;
					tween = new TWEEN.Tween(fieldTHREE, e._xseen.tagObject).to(target.to, duration);
					startingValue = fieldTHREE.clone();
				}
				e._xseen.initialValue = startingValue;

			
				tween	.delay(delay)
						.repeatDelay(0)
						.repeat(repeat)
						.interpolation(target.interpolation)
						.yoyo(yoyo);
				var easingType = e._xseen.attributes.easingtype;
				var easing = e._xseen.attributes.easing;
				if (easing != '') {
					tween.easing(TWEEN.Easing[easingType][easing]);
				}
				e._xseen.animating = tween;
				p._xseen.animation.push (tween);
				e._xseen.sceneInfo.TweenGroups.push (e._xseen.tagObject);
				tween.start();
/*
 *	Handle key frames.
 *	Use the provided keys (e._xseen.key[]) to construct TWEEN animations
 *	Each key creates one TWEEN. All Tweens are chained togeter (in order)
 *	Many <animate> attributes are ignored: interpolator, easing, easingtype, yoyo
 *	duration now contains the total duration of the animation, but it (the total) is also ignored
 *	repeat is either on (-1) or not (anything else). If it is on, then a chain is created from the last Tween to the first
 *
 *	TODO: At this time only deal with direct animation of THREE properties. 
 */
			} else {
				var fieldTHREE = p._xseen.animate[toAttribute];			// THREE field for animation
				var startingValue = fieldTHREE.clone();
				e._xseen.initialValue = startingValue;

				var tween0, tweenP, tween;
				tween0 = new TWEEN.Tween(fieldTHREE, e._xseen.tagObject);
				tween0	.to(e._xseen.key[0].to, duration)
						.delay(delay)
						.repeatDelay(0)
						.interpolation(e._xseen.key[0].interpolation)
						.easing(TWEEN.Easing[e._xseen.key[0].easingType][e._xseen.key[0].easing]);
				tweenP = tween0;
				for (var ii=1; ii<e._xseen.key.length; ii++) {
					tween = new TWEEN.Tween(fieldTHREE, e._xseen.tagObject);
					tween	.to(e._xseen.key[ii].to, duration)
							.delay(delay)
							.repeatDelay(0)
							.interpolation(e._xseen.key[ii].interpolation)
							.easing(TWEEN.Easing[e._xseen.key[ii].easingType][e._xseen.key[ii].easing]);
					tweenP.chain(tween);
					tweenP = tween;
				}
				if (repeat === Infinity) {
					//console.log ('test');
					tween.chain(tween0);
				}
				tween0.start();
				e._xseen.animating = e._xseen.tagObject;
				p._xseen.animation.push (e._xseen.tagObject);
				e._xseen.sceneInfo.TweenGroups.push (e._xseen.tagObject);
			}

/*
 *	TODO: This section needs to be thought through. It may not apply or need to be changed if animation a 
 *	field of an attribute
 *
 * Put animation-specific data in node (e._xseen) so it can be accessed on events (through 'XSeen.Tags.animate')
 *	This includes initial value and field
 *	All handlers (goes into .handlers)
 *	TWEEN object
 */
			//console.log ('Close up shop for animate...');
			e._xseen.handlers = {};
			e._xseen.handlers.setstart = XSeen.Tags.animate.setstart;
			e._xseen.handlers.setstop = XSeen.Tags.animate.setstop;
			e._xseen.handlers.setpause = XSeen.Tags.animate.setpause;
			e._xseen.handlers.setresetstart = XSeen.Tags.animate.setresetstart;
		},

	'event'	: function (ev, attr)
		{
			//console.log ('Handling event ... for ' + attr);
		},


	'setstart'	: function (ev)
		{
			//console.log ('Starting animation');
			XSeen.Tags.animate.destination._xseen.animating.start();
		},
	'setstop'	: function (ev) 
		{
			//console.log ('Stopping animation');
			XSeen.Tags.animate.destination._xseen.animating.stop();
		},
/*
 * TODO: Update TWEEN to support real pause & resume. 
 *	Pause needs to hold current position
 *	Resume needs to restart the timer to current time so there is no "jump"
 */
	'setpause'	: function (ev) 
		{
			//console.log ('Pausing (really stopping) animation');
			XSeen.Tags.animate.destination._xseen.animating.stop();
		},
	'setresetstart'	: function (ev) 	// TODO: Create seperate 'reset' method
		{
			//console.log ('Reset and start animation');
			XSeen.Tags.animate.destination._xseen.animatingField = XSeen.Tags.animate.destination._xseen.initialValue;
			XSeen.Tags.animate.destination._xseen.animating.start();
		},

/*
 * Various interpolator functions for use with different data types
 * All are designed to be used within TWEEN and take two arguments
 *	v	A vector of way points (key values) that define the interpolated path
 *	k	The interpolating factor that defines how far along the path for the current result
 *
 * Functions
 *	slerp - Linear in quaterian space (though not yet)
 *	color - Linear in color space (currently HSL as used by THREE)
 *
 */
	'Interpolator'	: {
		'slerp'	: function (v,k)
			{
				var m = v.length - 1;
				var f = m * k;
				var i = Math.floor(f);
	
				if (k < 0) {
					return v[0].slerp(v[1], f);
				}

				if (k > 1) {
					return v[m].slerp(v[m-1], m-f);
				}

				return v[i].slerp (v[i + 1 > m ? m : i + 1], f-i);
			},
		'color' : function (v,k)
			{
				var m = v.length - 1;
				var f = m * k;
				var i = Math.floor(f);
				var fn = this.slerpCompute;		// TODO: not sure this is needed
	
				if (k < 0) {
					return v[0].lerp(v[1], f);
				}
				if (k > 1) {
					return v[m].lerp(v[m-1], m-f);
				}
				return v[i].lerp (v[i + 1 > m ? m : i + 1], f - i);
			},
	},
};

XSeen.Tags.key = {
	/*
	 *	Each 'key' child provides the following
	 *	if !.keyFraction, then p._xseen.duration += e._xseen.duration
	 *	if .keyFraction && (when < 0 || when > 1) then ignore tag
	 *	p._xseen.key.push ({duration:, easing:, easingType, to:}) 
	 */
	'init'	: function (e,p) 
		{
			if (!(p.nodeName == 'XR-ANIMATE' || p.nodeName == 'X-ANIMATE')) {return; }
			var duration = e._xseen.attributes.duration;
			if (!p._xseen.keyFraction) {
				if (duration <= 0) {return; }
				p._xseen.attributes.duration += duration;
			} else {
				if (duration <= 0 || duration > 1) {return; }
				duration *= p._xseen.attributes.duration;
			}
			XSeen.Tags.animate._easeCheck (e._xseen.attributes.easing, e._xseen.attributes.easingtype, e._xseen.attributes);
			var target = XSeen.Tags.animate._getTo (e, p._xseen.attrObject, p._xseen.attributes.attribute);
			p._xseen.key.push ({duration:duration, to:target.to, interpolation:target.interpolation, easing:e._xseen.attributes.easing, easingType:e._xseen.attributes.easingtype}) 
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr)
		{
			//console.log ('Handling event ... for ' + attr);
		},
};



// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'animate',
						'init'	: XSeen.Tags.animate.init,
						'fin'	: XSeen.Tags.animate.fin,
						'event'	: XSeen.Tags.animate.event
//						'tick'	: XSeen.Tags.animate.tick
						})
		.defineAttribute ({'name':'attribute', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'to', dataType:'vector', 'defaultValue':[]})
		.defineAttribute ({'name':'delay', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'duration', dataType:'float', 'defaultValue':0.0})	// 0.0 ==> key time in seconds
		.defineAttribute ({'name':'repeat', dataType:'integer', 'defaultValue':0})

		.defineAttribute ({'name':'interpolator', dataType:'string', 'defaultValue':'position', enumeration:['position', 'rotation', 'color'], isCaseInsensitive:true})
		.defineAttribute ({'name':'easing', dataType:'string', 'defaultValue':'', enumeration:['', 'in', 'out', 'inout'], isCaseInsensitive:true})
		.defineAttribute ({'name':'easingtype', dataType:'string', 'defaultValue':'linear', enumeration:['linear', 'quadratic', 'sinusoidal', 'exponential', 'elastic', 'bounce'], isCaseInsensitive:true})
		.defineAttribute ({'name':'yoyo', dataType:'boolean', 'defaultValue':false})

		.defineAttribute ({'name':'start', dataType:'boolean', 'defaultValue':true})		// incoming event
		.defineAttribute ({'name':'stop', dataType:'boolean', 'defaultValue':true})			// incoming event
		.defineAttribute ({'name':'resetstart', dataType:'boolean', 'defaultValue':true})	// incoming event
		.defineAttribute ({'name':'pause', dataType:'boolean', 'defaultValue':true})		// incoming event
		.addTag();
XSeen.Parser.defineTag ({
						'name'	: 'key',
						'init'	: XSeen.Tags.key.init,
						'fin'	: XSeen.Tags.key.fin,
						'event'	: XSeen.Tags.key.event
						})
		.defineAttribute ({'name':'to', dataType:'vector', 'defaultValue':[]})
		.defineAttribute ({'name':'duration', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'easing', dataType:'string', 'defaultValue':'', enumeration:['', 'in', 'out', 'inout'], isCaseInsensitive:true})
		.defineAttribute ({'name':'easingtype', dataType:'string', 'defaultValue':'linear', enumeration:['linear', 'quadratic', 'sinusoidal', 'exponential', 'elastic', 'bounce'], isCaseInsensitive:true})
		.addTag();
// File: tags/asset.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.asset = {
	'init'	: function (e, p) 
		{
		},
	'fin'	: function (e, p) 
		{
		},
	'event'	: function (ev, attr) {},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'asset',
						'init'	: XSeen.Tags.asset.init,
						'fin'	: XSeen.Tags.asset.fin,
						'event'	: XSeen.Tags.asset.event
						})
		.addTag();
// File: tags/background.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

/*
 * Single TODO to encompass all work
 *xx	1. Create function for determining source type (none, single image (image extension), image directory)
 *	2. Add attribute for image extension/type for use with (1)/directory
 *	3. Create function for determining background type based on supplied value. (1), and camera environment.
 *	4. Functions from (1) and (3) are used in the _changeAttribute method
 *	5. Update _changeAttribute to fully handle changes to all attributes (except geometry)
 *	6. Add color attribute to supersede skycolor
 *	7. Deprecate skycolor (not supported on change of attribute)
 */ 

XSeen.Tags.background = {
	'_changeAttribute'	: function (e, attributeName, value) {
			// TODO: add handling of change to 'backgroundiscube' attribute. Need to tie this is an image format change.
			if (value !== null) {
				if (attributeName == 'src' && e._xseen.imageSource.substring(0,1) == '#') {
					var cubeMapNode = document.getElementById(e._xseen.imageSource.substring(1));
					cubeMapNode.removeEventListener ('xseen-assetchange', XSeen.Tags.background._updateBackground, true);
				}
				e._xseen.attributes[attributeName] = value;
				var type = XSeen.Tags.background._saveAttributes (e);
				XSeen.Tags.background._processChange (e);
			} else {
				XSeen.LogWarn("Re-parse of " + attributeName + " is invalid -- no change")
			}
		},

/*
 *	Perform node initialization. This is done on the first encounter with each 'background' node.
 *	Some things are done "just in case". This includes setting up for a video background from device
 *	camera and creating photosphere geometry.
 *
 *	The video setup is only done if the device supports a camera. Note that no access to the camera 
 *	is requested until it is specified in the node (either on initial setting or attribute change
 *
 *	The photosphere geometry is set up, but made transparent. This ensures that it is in the 
 *	render tree
 *
 *	The method _processChange is called every time there is a change, either to the initial state
 *	or on attribute change.
 */
	'init'	: function (e, p) 
		{
			// This function doesn't really work because the 'enumerateDevices' method runs
			// asynchronously. Need to figure out some other way to check for existence.
			function cameraExists () {
				var constraints = {video: {facingMode: {exact: "environment"}}};
				function handleError(error) {
					XSeen.LogVerbose ('Device camera not available -- ignoring');
					exists = false;
				}
				var exists = false;
				navigator.mediaDevices.enumerateDevices(constraints)
					.then(gotDevices).catch(handleError);

				function gotDevices(deviceInfos) {
					for (var i = 0; i !== deviceInfos.length; ++i) {
						var deviceInfo = deviceInfos[i];
						XSeen.LogVerbose ('Found a media device matching constraints of type: ' + deviceInfo.kind + ' (' + deviceInfo.label + ' -- ' + deviceInfo.groupId + ')');
						exists = true;
					}
				}
				return true;
				//return exists;			// Function not working...
			}

			var t = e._xseen.attributes.radius;
			e._xseen.sphereRadius = (t <= 0) ? 500 : t;
			e._xseen.sphereDefined = false;
			e._xseen.videoState = 'unavailable';
			
			// Need to declare photosphere here so that it can be put into the scene graph
			var geometry = new THREE.SphereBufferGeometry( e._xseen.sphereRadius, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point inward
			geometry.scale(-1, 1, 1);
			var material = new THREE.MeshBasicMaterial( {
											opacity: 0.0,
											transparent: true,
										} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = 'photosphere surface R=' + t;
			e._xseen.sphereDefined = true;
			e._xseen.sphere = mesh;
			mesh = null;
			e.parentNode._xseen.children.push(e._xseen.sphere);
			
			// Define video support
			//	Need global variable indicating that video element has been created and to use that one.
			if (XSeen.Runtime.allowAR && cameraExists()) {
				var video = document.createElement( 'video' );
				video.setAttribute("autoplay", "1"); 
				//video.height			= XSeen.Runtime.SceneDom.height;
				//video.width				= XSeen.Runtime.SceneDom.width;
				video.style.height		= video.height + 'px';
				video.style.width		= video.width + 'px';
				video.style.height		= '100%';
				video.style.width		= '100%';
				video.style.position	= 'absolute';
				video.style.top			= '0';
				video.style.left		= '0';
				video.style['object-fit'] = 'cover';
				video.style.zIndex		= -1;
				e._xseen.video			= video;
				XSeen.Runtime.RootTag.appendChild (video);
				video = null;
				e._xseen.videoState		= 'defined';
			}
			
			var type = XSeen.Tags.background._saveAttributes (e);
			XSeen.Tags.background._processChange (e);
		},
		
// Move modifyable attribute values to main node store
	'_saveAttributes'	: function (e)
		{
			var t = e._xseen.attributes.color;
			e._xseen.color = new THREE.Color (t.r, t.g, t.b);
			e._xseen.imageSource = e._xseen.attributes.src;
			e._xseen.srcExtension = e._xseen.attributes.srcextension;

			var type = e._xseen.attributes.background;
			e._xseen.src = e._xseen.attributes.src;
			e._xseen.srcType = XSeen.Tags.background._checkSrc (e._xseen.src);
			if (type == 'camera') {
				if (e._xseen.videoState == 'unavailable') {			// Rollback mechanism
					XSeen.LogVerbose ('Device camera requested, but AR mode is not available.');
					type = 'sky';
				} else if (e._xseen.videoState == 'running') {
					XSeen.LogVerbose ('Device camera requested, but it is already running.');
				} else if (e._xseen.videoState == 'defined') {
					XSeen.LogVerbose ('Device camera requested, need to engage it.');
				} else {
					XSeen.LogVerbose ('Device camera requested, but it is XSeen cannot handled it -- No change to background.');
				}
			}

			e._xseen.backgroundType = type;
			return type;
		},

	'_checkSrc'			: function (url) 
		{
			return (XSeen.isImage(url)) ? 'image' : 'path';
		},
		
	'_processChange'	: function (e)
		{
			if (e._xseen.videoState == 'running') {
				// TODO: turn off/pause camera
			}
			if (e._xseen.backgroundType == 'sky') {
				e._xseen.sphere.material.transparent = true;
				e._xseen.sphere.material.opacity = 0.0;
				e._xseen.sceneInfo.SCENE.background = e._xseen.color;
				XSeen.Runtime._deviceCameraElement = 0;
			
			} else if (e._xseen.backgroundType == 'camera') {
				e._xseen.sphere.material.transparent = true;
				e._xseen.sphere.material.opacity = 0.0;
				e._xseen.sceneInfo.SCENE.background = null;
				if (document.documentElement._isFullScreen()) {		// Running full-screen, connect camera
					XSeen.IW.connectCamera (e);
				} else {											// Not full-screen, save element for later
					XSeen.Runtime._deviceCameraElement = e;
				}
				//XSeen.Tags.background._setupCamera(e);

			} else if (e._xseen.backgroundType == 'fixed') {
				e._xseen.sphere.material.transparent = true;
				e._xseen.sphere.material.opacity = 0.0;
				e._xseen.loadTexture = new THREE.TextureLoader().load (e._xseen.attributes.src);
				e._xseen.loadTexture.wrapS = THREE.ClampToEdgeWrapping;
				e._xseen.loadTexture.wrapT = THREE.ClampToEdgeWrapping;
				e._xseen.sceneInfo.SCENE.background = e._xseen.loadTexture;
				XSeen.Runtime._deviceCameraElement = 0;

			} else {
				XSeen.Tags.background._loadBackground (e);
				XSeen.Runtime._deviceCameraElement = 0;
			}
		},
		
/* TODO: Method needs better/proper handling on change
 *	Only create one 'video' tag
 *	Only try to access the camera on the first request
 *	When this is not the background, then pause video feed
 *	Perhaps impose limitation that a XSeen cannot change to a video background
 *	May require capability to turn on/off background node
 */
 
// This method has been replaced by XSeen.IW.connectCamera and XSeen.IW.disconnectCamera
	'_setupCamera'		: function (e)
		{
			var constraints = {video: {facingMode: {exact: "environment"}}};
			var constraints = {video: {facingMode: "environment"}};
			if (e._xseen.videoState != 'defined') {
				XSeen.LogError ('Camera/video not correctly configured. Current state: ' + e._xseen.videoState);
				return;
			}
			function handleSuccess(stream) {
				e._xseen.video.srcObject = stream;
				e._xseen.videoState = 'running';
				XSeen.LogVerbose ('Camera/video (' + stream.id + ') engaged and connected to display.');
				XSeen.LogVerbose (stream);
			}
			function handleError(error) {
				XSeen.LogVerbose ('Device camera not available -- ignoring');
				e._xseen.videoState = 'error';
			}

			navigator.mediaDevices.getUserMedia(constraints).
				then(handleSuccess).catch(handleError);
			//}
		},

/*
 *	Background textures can either be a cube-map image (1 image for each face of a cube) or
 *	a single equirectangular (photosphere) image of width = 2 x height. For any image, each dimension
 *	must be a power of 2. 
 *
 *	The attribute 'backgroundiscube' determines whether the texture is cube- or sphere- mapped.
 *	backgroundiscube == false ==> sphere-mapped texture. These attributes are also allowed:
 *		radius		sets the radius of the sphere that is constructed for the texture. This can only be set once.
 *		src			The sphere-mapped texture.
 *	backgroundiscube == true ==> cube-mapped texture. These attributes are also allowed:
 *		src			The cube-mapped texture that can take any of the following forms (all proceeded by domain and path):
 *			<file>.<extension> loads the specified image. This is not yet functioning [TODO]
 *			...path/ loads the 6 textures in the specified directory. The files MUST be called [n|p][x|y|z].jpg
 *			<full-file> with single '*'. This substitutes (in -turn) ['right', 'left', 'top', 'bottom', 'front', 'back']
 *						for the wild card character to load the 6 cube textures.
 */

	'_updateBackground'	: function (ev) 
		{
			ev.detail.Runtime.SCENE.background = ev.target._xseen.cubemap;
		},
	'_loadBackground'	: function (e)
		{
			// Parse src according the description above. 
			if (e._xseen.backgroundType == 'cube' && e._xseen.srcType == 'path') {
				if (e._xseen.imageSource.substring(0,1) == '#') {
					var cubeMapNode = document.getElementById(e._xseen.imageSource.substring(1));
					e._xseen.processedUrl = true;
					e._xseen.loadTexture = cubeMapNode._xseen.cubemap;
					if (cubeMapNode._xseen.cubemap.image.length != 6) {
						e._xseen.sceneInfo.SCENE.background = e._xseen.color;
						cubeMapNode.addEventListener ('xseen-loadcomplete', function(ev) {
								XSeen.Runtime.SCENE.background = ev.target._xseen.cubemap;
						});
					} else {
						e._xseen.sceneInfo.SCENE.background = cubeMapNode._xseen.cubemap;
					}
					cubeMapNode.addEventListener ('xseen-assetchange', XSeen.Tags.background._updateBackground, true);

				} else {
					var urls=[], files=[];
					var files = ['px.', 'nx.', 'py.', 'ny.', 'pz.', 'nz.'];
					for (var ii=0;  ii<files.length; ii++) {
						urls[ii] = e._xseen.src + files[ii] + e._xseen.srcExtension;
					}

					var dirtyFlag;
					XSeen.Loader.TextureCube ('./', urls, '', XSeen.Tags.background.cubeLoadSuccess({'e':e}));
					e._xseen.sphere.material.transparent = true;
					e._xseen.sphere.material.opacity = 0.0;
				}

			} else {		// Sphere-mapped texture. Need to do all of things specified in the above description
				if (e._xseen.backgroundType == 'sphere' && e._xseen.srcType == 'image') {
					if (!e._xseen.sphereDefined) {
						var geometry = new THREE.SphereBufferGeometry( e._xseen.sphereRadius, 60, 40 );
						// invert the geometry on the x-axis so that all of the faces point inward
						geometry.scale(-1, 1, 1);
						var material = new THREE.MeshBasicMaterial( {
											map: new THREE.TextureLoader().load(e._xseen.src)
										} );

						var mesh = new THREE.Mesh( geometry, material );
						e._xseen.sphereDefined = true;
						e._xseen.sphere = mesh;
						mesh = null;
						e.parentNode._xseen.children.push(e._xseen.sphere);	// Doesn't work because nothing pushes this up further...
					} else {
						e._xseen.sphere.material.map = new THREE.TextureLoader().load(e._xseen.src);
						e._xseen.sphere.material.transparent = false;
						e._xseen.sphere.material.opacity = 1.0;
						e._xseen.sphere.material.needsUpdate = true;
					}
				}
			}
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	'cubeLoadSuccess' : function (userdata)
		{
			var thisEle = userdata.e;
			return function (textureCube)
			{
				thisEle._xseen.processedUrl = true;
				thisEle._xseen.loadTexture = textureCube;
				thisEle._xseen.sceneInfo.SCENE.background = textureCube;
			}
		},
	'loadProgress' : function (a)
		{
			XSeen.LogInfo ('Loading background textures...');
			XSeen.LogInfo (a);
		},
	'loadFailure' : function (a)
		{
			//a._xseen.processedUrl = false;
			XSeen.LogWarn ('Load failure');
			XSeen.LogWarn ('Failure to load background textures.');
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'background',
						'init'	: XSeen.Tags.background.init,
						'fin'	: XSeen.Tags.background.fin,
						'event'	: XSeen.Tags.background.event,
						'tick'	: XSeen.Tags.background.tick
						})
		.defineAttribute ({'name':'color', dataType:'color', 'defaultValue':'black'})
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':500})
		.defineAttribute ({'name':'background', dataType:'string', 'defaultValue':'sky', enumeration:['sky', 'cube', 'sphere', 'fixed', 'camera'], isCaseInsensitive:true})
		.defineAttribute ({'name':'srcextension', dataType:'string', 'defaultValue':'jpg', enumeration:['jpg', 'jpeg', 'png', 'gif'], isCaseInsensitive:true})
		.defineAttribute ({'name':'srcfront', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcback', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcleft', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcright', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srctop', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcbottom', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'backgroundiscube', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'fixed', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'usecamera', dataType:'boolean', 'defaultValue':'false', 'isAnimatable':false})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.background._changeAttribute}]})
		.addTag();
//	TODO: Convert backgroundiscube to backgroundtype with the values sky(D) | cube | sphere | fixed | camera. Remove 'fixed' and change logic throughout.
// File: tags/camera.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.camera = {
	'init'	: function (e, p) 
		{
			e._xseen.properties = {};
			e._xseen.domNode = e;	// Back-link to node if needed later on
			e._xseen.type = e._xseen.attributes.type;
			e._xseen.track = e._xseen.attributes.track;
			if (e._xseen.track == 'examine') e._xseen.track = 'trackball';
			e._xseen.rendererHasControls = false;		// Only for renderers with built-in controls (e.g., vr)
			e._xseen.useDeviceOrientation = false;
			e._xseen.isStereographic = false;
			e._xseen.priority = e._xseen.attributes.priority;
			if (e._xseen.priority < 0) {e._xseen.priority = 1;}
			e._xseen.available = e._xseen.attributes.available;
/*
 * Handle camera target. Target is an HTML id attribute value,
 * must exist, and be defined (and parsed) prior to the camera tag parsing.
 * This section handles the existence and gets the tagObject associated with the referenced tag.
 */
			e._xseen.target = null;
			if (e._xseen.attributes.target != '') {
				var tagElement = document.getElementById (e._xseen.attributes.target);
				if (typeof(tagElement) == 'object' && typeof(tagElement._xseen) != 'undefined' && typeof(tagElement._xseen.tagObject) != 'undefined') {
					e._xseen.target = tagElement._xseen.tagObject;
				}
			}
 
/*
 *	Handle the camera type and tracking capabilities
 *	The allowed types and capabilities are dependent on the display device
 *	(isVrCapable and hasDeviceOrientation). 
 *
 *	'orthographic'	==> all devices support and all manual tracking is allowed (no VR, no Device)
 *	'perspective'	==> all devices support and all manual tracking is allowed. Device tracking is allowed if hasDeviceOrientation
 *	'stereo'		==> all devices support and all manual tracking is allowed. Device tracking is allowed if hasDeviceOrientation
 *						Object tracking is allowed if hasDeviceOrientation and target != null
 *	'vr'			==> only allowed if isVrCapable
 *
 *	Rollbacks: If the requested type and/or tracking is not allowed the the following rollback is used:
 *
 *	'vr'		==> stereo/device OR stereo/target if hasDeviceOrientation
 *				==> perspective/orbit otherwise
 *	'device'	==> orbit if !hasDeviceOrientation
 */
 
			XSeen.LogVerbose ("Camera type: '"+e._xseen.type+"' with controls " + e._xseen.track);
			
 
			if (e._xseen.type == 'orthographic') {			// TODO: Orthographic projection
			
			} else if (e._xseen.type == 'perspective') {	// Perspective camera -- default
				if (e._xseen.track == 'device') {
					if (e._xseen.sceneInfo.hasDeviceOrientation) {
						XSeen.LogVerbose ('... using device orientation');
						//e._xseen.track = (e._xseen.target === null) ? 'environment' : 'object'
						e._xseen.track = (e._xseen.target === null) ? e._xseen.track : 'object'
						e._xseen.useDeviceOrientation = true;
						//e._xseen.sceneInfo.useDeviceOrientation = true;
					} else {
						XSeen.LogVerbose ('... using orbit controls');
						e._xseen.track = 'orbit';
						e._xseen.useDeviceOrientation = false;
						//e._xseen.sceneInfo.useDeviceOrientation = false;
					}
				}
				
			} else if (e._xseen.type == 'stereo') {	// Stereo perspective cameras
				var track = (e._xseen.target === null) ? e._xseen.track : 'object'
				if (e._xseen.track == 'device' && !e._xseen.sceneInfo.hasDeviceOrientation) {track = 'orbit';}
				e._xseen.track = track;
				e._xseen.isStereographic = true;
				e._xseen.rendererHasControls = false;
					var button;
					button = XSeen.DisplayControl.buttonCreate ('fullscreen', e._xseen.sceneInfo.RootTag, button)
					console.log (button);
					e._xseen.sceneInfo.RootTag.appendChild(button);
 
			} else if (e._xseen.type == 'vr') {	// Stereo perspective cameras
				if (e._xseen.sceneInfo.isVrCapable) {
					e._xseen.sceneInfo.Renderer.vr.enabled = true;
					e._xseen.sceneInfo.rendererHasControls = true;
					document.body.appendChild( WEBVR.createButton( e._xseen.sceneInfo.Renderer ) );
				} else if (e._xseen.sceneInfo.hasDeviceOrientation) {
					XSeen.LogVerbose ("VR requested, but no VR device found. Using 'stereo' instead.");
					e._xseen.type = 'stereo';
					e._xseen.track = 'device';
					e._xseen.sceneInfo.Renderer = e._xseen.sceneInfo.RendererStereo;
					e._xseen.sceneInfo.rendererHasControls = false;
					e._xseen.sceneInfo.isStereographic = true;
					// Need to add a button to the display to go full screen & stereo
				} else {													// Flat screen
					XSeen.LogVerbose ("VR requested, but no VR device nor device orientation found. Using 'perspective' instead.");
					e._xseen.type = 'perspective';
					e._xseen.track = 'orbit';
				}
			}

/*
 *	TODO: support multiple cameras
 *	If multiple cameras are to be allowed, then the above processing needs to occur for each
 *	camera. What follows is for the camera in use because it sets the specific controls. Note
 *	that above the 'stereographic' and 'vr' modes set the renderer. Other modes may set a scene
 *	variable. This needs to be "re-factored" into setup and use. All 'setup' processing and
 *	definitions are stored in the node. The 'use' phase determines which camera will be active
 *	and extracts the details from the node. This sounds like a data array that references each camera
 *	so the 'use' phase can get to the right information. There will also need to be a mechanism for
 *	determining which camera is active or active next. Perhaps a 'priority' field with cameras at
 *	the same priority being handled in declared order. An 'active' event would allow the designated camera
 *	to become the next active camera. The process would also inactivate the current camera. The other
 *	choice would be a stack of some sort.
 *
 *	Data structures:
 *	 In XSeen.Runtime:
 *		add cameras = sparse array of arrays. The hash is accessed in reverse numerical order and is the priority
 *			of the camera. Each inner array contains references to all cameras at that priority. Each 
 *			outer array element is an array with at least one element.
 *		add currentCamera as a reference to the active camera (not possible to have no active cameras)
 *	 XSeen automatically creates a priority 0 camera (normal priorities > 0; highest priority camera is next-active)
 *	 Store above parameters (track, isStereographic, etc.) in node
 *	 Add event to activate camera. This has no effect as an attribute.
 *	 When a camera activates, data in the node (element._xseen...) is retrieved and used to determine the 
 *		renderer and other system camera parameters. Note that if a target is specified, then it needs to be
 *		checked when the camera is activated. Activating a camera causes the current active camera to deactivate.
 *	 No special processing is required for deactivating a camera.
 *
 *	A viewpoint list can be constructed with the xr-class3d tag setting the same camera parameters and each 
 *	xr-camera node having different position/rotation attributes.
 *
 *	None of this should change the animation of a camera, though I don't know if the existing mechanisms
 *	correctly handle orientation change.
 *
 *	Motivation for multiple cameras:
 *	When loading an external XSeen source it may be necessary to include a camera in the external file to
 *	handle 'target'. It is necessary to include a camera (at least XSeen default) so that the first frame can
 *	be rendered. 
 *
 */
 
/*
 *	Handle camera controls for (navigational) tracking. 
 *	This applies to stereo (device & object) and perspective with track != none.
 *	TODO: orthographic camera
 *	TODO: Fix bug that causes the last camera defined to be the CameraControl. There is only only place to store the 
 *			info and that is in sceneInfo. This needs to be changed so it is stored in the node and CameraManager
 *			loads (or clears) it as needed
 */
			if (!e._xseen.rendererHasControls) {
				if (e._xseen.sceneInfo.useDeviceOrientation) {
					if (e._xseen.track == 'object') {	// tracking scene object
						e._xseen.sceneInfo.CameraControl = new THREE.DeviceOrientationControls(e._xseen.target, true);
					} else {							// tracking environment
						e._xseen.sceneInfo.CameraControl = new THREE.DeviceOrientationControls(e._xseen.sceneInfo.Camera);
					}

				} else {								// No device orientation control. Use something else
					console.log ('Determining renderer controls with track: ' + e._xseen.track);
					if (e._xseen.track == 'orbit') {
						e._xseen.sceneInfo.CameraControl = new THREE.OrbitControls( e._xseen.sceneInfo.Camera, e._xseen.sceneInfo.RendererStandard.domElement );
						e._xseen.sceneInfo.CameraControl.enabled = false;
					} else if (e._xseen.track == 'trackball') {
						//console.log ('Trackball');
					} else if (e._xseen.track == 'none') {
						console.log (e.id + ' has NO tracking');
						e._xseen.rendererHasControls = false;
					} else {
						console.log ('Something else');
					}
				}
			}

			e._xseen.sceneInfo.ViewManager.add (e);
		},
	'fin'	: function (e, p) 
		{
			e.setActive = function () {
				XSeen.CameraManager.setActive(this);
			}
		},
	'event'	: function (ev, attr)
		{
		},

	'tick'	: function (systemTime, deltaTime)
		{
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'camera',
						'init'	: XSeen.Tags.camera.init,
						'fin'	: XSeen.Tags.camera.fin,
						'event'	: XSeen.Tags.camera.event,
						'tick'	: XSeen.Tags.camera.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'perspective', enumeration:['perspective','stereo','orthographic','vr'], isCaseInsensitive:true})
		.defineAttribute ({'name':'track', dataType:'string', 'defaultValue':'none', enumeration:['none', 'orbit', 'fly', 'examine', 'trackball', 'device'], isCaseInsensitive:true})
		.defineAttribute ({'name':'fov', dataType:'float', 'defaultValue':50.0})
		.defineAttribute ({'name':'priority', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'available', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'target', dataType:'string', 'defaultValue':''})
		.addTag();
// File: tags/cubemap.js
/*
 * XSeen JavaScript library
 *
 * (c)2019, Daly Realism, Los Angeles
 *
 *
 */

 // Control Node definitions

/*
 * Loads an image texture from one or more files and constructs an internal cubemap for use
 *	by other nodes. For this to be used by other nodes, the value of 'id' attribute must be specified.
 *
 *	Both a cubemap and sphercal image map are created for use
 */ 

XSeen.Tags.cubemap = {
	'TextureSize'		: 1024,		// Must be a power of 2
	
	'_changeAttribute'	: function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				var type = XSeen.Tags.cubemap._saveAttributes (e);
				XSeen.Tags.cubemap._processChange (e);
			} else {
				XSeen.LogWarn("Re-parse of " + attributeName + " is invalid -- no change")
			}
		},

/*
 *	The photosphere geometry is set up, but made transparent. This ensures that it is in the 
 *	render tree
 *
 *	The method _processChange is called every time there is a change, either to the initial state
 *	or on attribute change.
 */
	'init'	: function (e, p) 
		{
			XSeen.Tags.cubemap._saveAttributes (e);
			e._xseen.cubemap = new THREE.CubeTexture();
			XSeen.Tags.cubemap._processChange (e);
		},
		
// Move modifyable attribute values to main node store
	'_saveAttributes'	: function (e)
		{
			e._xseen.format = e._xseen.attributes.format;
			e._xseen.src = e._xseen.attributes.src;
		},

	'_checkSrc'			: function (url) 
		{
			return (XSeen.isImage(url)) ? 'image' : 'path';
		},

/*
 *	Images can either be a cube-map image (1 image for each face of a cube) or
 *	a single equirectangular (photosphere) image of width = 2 x height. For any image, each dimension
 *	must be a power of 2. 
 *
 *	The attributes 'src' and 'npxyz' determine the image type. If both are present and not empty,
 *	then 'src' has precedence.
 *
 *	src		Specifies the equi-rectangular image that is converted into a cubemap.
 *	npxz	Specifies the path URL to the six cube-face images. The images must be px, py, pz, nx, ny, nz.
 *	format	Specified the file format. Must be a web format (JPEG or PNG).
 *
 */
 
	'_processChange'	: function (e)
		{
			// Parse src according the description above. 
			if (e._xseen.attributes.src != '') {
				e._xseen.equirectangular = new THREE.TextureLoader().load(e._xseen.src);
				var loader = new THREE.TextureLoader();
				loader.load(e._xseen.src, XSeen.Tags.cubemap.cubeLoadSuccess({'e':e, 'cube':false}));

			} else if (e._xseen.attributes.npxyz != '') {
				var urls=[], files=[];
				var files = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
				for (var ii=0;  ii<files.length; ii++) {
					urls[ii] = e._xseen.attributes.npxyz + '/' + files[ii] + '.' + e._xseen.format;
				}
				XSeen.LogDebug ('Loading image cubemap');
				var dirtyFlag;
				XSeen.Loader.TextureCube ('./', urls, '', XSeen.Tags.cubemap.cubeLoadSuccess({'e':e, 'cube':true}));
			} else {
				console.log ('No valid image specified for cubemap');
				return;
			}
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	'cubeLoadSuccess' : function (userdata)
		{
			var thisEle = userdata.e;
			var cube = userdata.cube;
			return function (texture)
			{
				if (cube) {
					console.log ('Successful load of cubemap to texture cube.');
				} else {
					console.log ('Successful load of cubemap to spherical texture.');
					var equiToCube = new EquirectangularToCubemap( XSeen.Runtime.Renderer );
					console.log ('Class for converter...');
					console.log (equiToCube);
					texture = equiToCube.convert( texture, XSeen.Tags.cubemap.TextureSize );
					console.log ('Converted texture');
					console.log (texture);
				}
				thisEle._xseen.processedUrl = true;
				thisEle._xseen.cubemap = texture;
				// Create event to indicate the XSeen has fully loaded. It is dispatched on the 
				//	this tag but bubbles up so it can be caught.
				////var newEv = new CustomEvent('xseen-assetchange', XSeen.Events.propertiesAssetChanged(XSeen.Runtime, 'texturecube'));
				////thisEle.dispatchEvent(newEv);
				XSeen.Events.loadComplete ('texturecube', thisEle);
				//thisEle._xseen.sceneInfo.SCENE.background = textureCube;
			}
		},
/*
	'loadProgress' : function (a)
		{
			console.log ('Loading cubemap textures...');
		},
	'loadFailure' : function (a)
		{
			//a._xseen.processedUrl = false;
			console.log ('Load failure - Failure to load cubemap textures.');
		},
*/
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'cubemap',
						'init'	: XSeen.Tags.cubemap.init,
						'fin'	: XSeen.Tags.cubemap.fin,
						'event'	: XSeen.Tags.cubemap.event,
						'tick'	: XSeen.Tags.cubemap.tick
						})
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'npxyz', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'format', dataType:'string', 'defaultValue':'jpg', 'isAnimatable':false})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.cubemap._changeAttribute}]})
		.addTag();
// File: tags/fog.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.fog = {
	'_changeAttribute'	: function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				//var type = XSeen.Tags.light._saveAttributes (e);
				XSeen.Tags.fog._processChange (e);
			} else {
				XSeen.LogWarn("Re-parse of " + attributeName + " is invalid -- no change")
			}
		},
	'_processChange'	: function (e, attributeName, value) {
			if (e._xseen.attributes.active) {
				var fog, color, near, far;
				fog = new THREE.Fog (
						 XSeen.Parser.Types.colorRgbInt(e._xseen.attributes.color),
						e._xseen.attributes.near,
						e._xseen.attributes.far);
				e._xseen.tagObject = fog;
				e._xseen.sceneInfo.SCENE.fog = fog;
			} else {
				e._xseen.sceneInfo.SCENE.fog = null;
			}
		},
		
		
		
	'init'	: function (e, p) 
		{
			
			console.log ('Creating FOG with color ' + XSeen.Parser.Types.colorRgbInt(e._xseen.attributes.color));
			console.log (e._xseen.attributes.color);
			var fog = new THREE.Fog (
						 XSeen.Parser.Types.colorRgbInt(e._xseen.attributes.color),
						e._xseen.attributes.near,
						e._xseen.attributes.far);

			e._xseen.tagObject = fog;
			if (e._xseen.attributes.active) {
				e._xseen.sceneInfo.SCENE.fog = fog;
			}
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr)
		{
		},

	'tick'	: function (systemTime, deltaTime)
		{
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'fog',
						'init'	: XSeen.Tags.fog.init,
						'fin'	: XSeen.Tags.fog.fin,
						'event'	: XSeen.Tags.fog.event,
						'tick'	: XSeen.Tags.fog.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'active', dataType:'boolean', 'defaultValue':'true'})
		.defineAttribute ({'name':'color', dataType:'color', 'defaultValue':'white'})
		.defineAttribute ({'name':'near', dataType:'float', 'defaultValue':'1'})
		.defineAttribute ({'name':'far', dataType:'float', 'defaultValue':'1'})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.fog._changeAttribute}]})
		.addTag();
// File: tags/group.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.group = {
	'init'	: function (e, p) 
		{
			var group = new THREE.Group();
			var rotation = {'x':0, 'y':0, 'z':0, 'w':0};
			//var rotation = XSeen.types.Rotation2Quat(e._XSeen.attributes.rotation);	TODO: Figure out rotations
			group.name = 'Transform children [' + e.id + ']';
			group.visible		= e._xseen.attributes.visible;
			group.position.x	= e._xseen.attributes.position.x;
			group.position.y	= e._xseen.attributes.position.y;
			group.position.z	= e._xseen.attributes.position.z;
			group.scale.x		= e._xseen.attributes.scale.x;
			group.scale.y		= e._xseen.attributes.scale.y;
			group.scale.z		= e._xseen.attributes.scale.z;
			group.setRotationFromQuaternion (e._xseen.attributes.rotation);
			
			var bx, by, bz, q, tx, ty, tz;
			q = group.quaternion;
			bx = new THREE.Vector3 (1, 0, 0);
			by = new THREE.Vector3 (0, 1, 0);
			bz = new THREE.Vector3 (0, 0, 1);
			bx = bx.applyQuaternion (q);
			by = by.applyQuaternion (q);
			bz = bz.applyQuaternion (q);
			
			e._xseen.properties = e._xseen.properties || [];
			e._xseen.properties['rotatex'] = Math.atan2 (bx.z, bx.y);
			e._xseen.properties['rotatey'] = Math.atan2 (by.z, by.x);
			e._xseen.properties['rotatez'] = Math.atan2 (bz.y, bz.x);
				
			//e._xseen.animate['translation'] = group.position;
			e._xseen.animate['rotation'] = group.quaternion;
			//e._xseen.animate['scale'] = group.scale;
			e._xseen.animate['rotatex'] = 'rotateX';
			e._xseen.animate['rotatey'] = 'rotateY';
			e._xseen.animate['rotatez'] = 'rotateZ';
			
			e._xseen.animate['position']	= group.position;
			e._xseen.animate['scale']		= group.scale;
			e._xseen.animate['rotate-x']	= XSeen.Tags.Solids._animateRotation (group, 'rotateX');
			e._xseen.animate['rotate-y']	= XSeen.Tags.Solids._animateRotation (group, 'rotateY');
			e._xseen.animate['rotate-z']	= XSeen.Tags.Solids._animateRotation (group, 'rotateZ');

			e._xseen.loadGroup = group;
			e._xseen.tagObject = e._xseen.loadGroup;
			e._xseen.update = XSeen.Tags.group.animateObject;
		},
	'fin'	: function (e, p) 
		{
			e._xseen.children.forEach (function (child, ndx, wholeThing)
				{
					e._xseen.loadGroup.add(child);
				});
			p._xseen.children.push(e._xseen.loadGroup);

		},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	'setactive'	: function (ev) {},
	'animateObject'	: function (x, property, value) 
		{
			x.loadGroup[property](value);
			XSeen.LogDebug (value);
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'group',
						'init'	: XSeen.Tags.group.init,
						'fin'	: XSeen.Tags.group.fin,
						'event'	: XSeen.Tags.group.event,
						'tick'	: XSeen.Tags.group.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'visible', dataType:'boolean', 'defaultValue':true, enumeration:[true,false], isCaseInsensitive:true})	// render contents
		.addEvents ({'mutation':[{'attributes':XSeen.Tags._changeAttribute}]})
		.addTag();

/*
		.defineAttribute ({'name':'translation', dataType:'vec3', 'defaultValue':[0,0,0], 'isAnimatable':true})
		.defineAttribute ({'name':'scale', dataType:'vec3', 'defaultValue':[1,1,1], 'isAnimatable':true})
		.defineAttribute ({'name':'rotation', dataType:'rotation', 'defaultValue':'0 0 0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatex', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatey', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatez', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
 */
// File: tags/label.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.label = {
	'selectedLabel'	: {},
	'init'	: function (e, p) 
		{
			var type = e._xseen.attributes.type;
			if (!(type == 'fixed' || type == 'tracking' || type == 'draggable')) {type = 'fixed';}
			e._xseen.labelType = type;
			e._xseen.targets = [];
			e._xseen.tagObject = [];
		},
	
	'fin'	: function (e, p)
		{
			var labelElement, targetElement, leaderColor, defaultColor, targetPosition, labelPosition, positionedInSpace;
			var material;
			labelElement = e.getElementsByTagName('div')[0];
			labelPosition = new THREE.Vector3(0, 0, -1);	// center of near-clipping plane
			positionedInSpace = false;
			if (e._xseen.attributes.position.x != 0 || e._xseen.attributes.position.y != 0) {
				e._xseen.attributes.position.z = -1;
				positionedInSpace = true;
			}
			//material = new THREE.LineBasicMaterial( {color: XSeen.Parser.Types.colorRgbInt(e._xseen.attributes['leadercolor']), } );
			defaultColor = e._xseen.attributes['leadercolor'];

			e._xseen.labelObj = [];
			for (var ii=0; ii<e._xseen.targets.length; ii++) {
				targetElement = e._xseen.targets[ii].element;
				leaderColor = (typeof(e._xseen.targets[ii].leaderColor) == 'undefined') ? defaultColor : e._xseen.targets[ii].leaderColor;
				material = new THREE.LineBasicMaterial( {color: XSeen.Parser.Types.colorRgbInt(leaderColor), } );

				targetPosition = new THREE.Vector3();
				targetElement._xseen.tagObject.getWorldPosition(targetPosition);

				var geometry = new THREE.Geometry();
				var line = new THREE.Line( geometry, material );

				var labelObj = {
						'method'		: XSeen.Tags.label.tick,
						'position'		: XSeen.Tags.label['position_'+e._xseen.labelType],
						'node'			: e,
						'_xseen'		: e._xseen,
						'RunTime'		: e._xseen.sceneInfo,
						'target'		: targetElement,
						'targetWorld'	: new THREE.Vector3(),
						'label'			: labelElement,
						'labelWorld'	: new THREE.Vector3(0, 0, -1),
						'labelDelta'	: {x: 0, y: 0},
						'line'			: line,
						'initialized'	: false,
						'spacePosition'	: positionedInSpace,
				};
				targetElement._xseen.tagObject.getWorldPosition(labelObj.targetWorld);
				geometry.vertices.push(
						labelObj.targetWorld,
						labelObj.labelWorld);
				labelObj.line.geometry.verticesNeedUpdate = true;
				e._xseen.sceneInfo.perFrame.push ({'method':XSeen.Tags.label.tick, 'userdata':labelObj});
				e._xseen.tagObject.push (line);
				p._xseen.children.push (line);
			}

			// Set up event handlers
			e.addEventListener ('xseen', XSeen.Tags.label.tick, true);						// Render frame
			if (e._xseen.labelType == 'draggable') {
				labelElement.addEventListener ('mousedown', XSeen.Tags.label.MouseDown);	// label movement if type='draggable'
			}
		},
	'event'	: function (ev, attr) {},
	'tick'	: function (rt, label)
		{
			label.position (rt, label);
			label.target._xseen.tagObject.getWorldPosition(label.targetWorld);
			label.line.geometry.verticesNeedUpdate = true;
		},
		
// Event handler for mouse dragging of label
	'MouseDown' : function (ev)
		{
			XSeen.Tags.label.selectedLabel.state = 'down';
			XSeen.Tags.label.selectedLabel.element = ev.target;
			XSeen.Tags.label.selectedLabel.pointerOffset = [ev.x-this.offsetLeft, ev.y-this.offsetTop];
			this.addEventListener ('mousemove', XSeen.Tags.label.MouseMove);
			this.addEventListener ('mouseup', XSeen.Tags.label.MouseUp);
//			console.log ('Mouse Down on movable at Event: ' + ev.x + ', ' + ev.y + '; Offset [' + 
//					XSeen.Tags.label.selectedLabel.pointerOffset[0] + ', ' + 
//					XSeen.Tags.label.selectedLabel.pointerOffset[1] + ']');
		},
	'MouseUp'	: function (ev)
		{
			XSeen.Tags.label.selectedLabel.element.removeEventListener ('mousemove', XSeen.Tags.label.MouseMove);
			XSeen.Tags.label.selectedLabel.element.removeEventListener ('mouseup', XSeen.Tags.label.MouseUp);
			XSeen.Tags.label.selectedLabel.state = '';
			XSeen.Tags.label.selectedLabel.element = {};
			//console.log ('Mouse Up on movable at Event: ');
		},
	'MouseMove'	: function (ev)
		{
			XSeen.Tags.label.selectedLabel.state = 'move';
			this.style.left = ev.x - XSeen.Tags.label.selectedLabel.pointerOffset[0] + 'px';
			this.style.top  = ev.y - XSeen.Tags.label.selectedLabel.pointerOffset[1] + 'px';
			ev.cancelBubble = true;
			//console.log ('Mouse Move on movable at Event: ');
		},

// The 'position_*' methods correspond to the type attribute
	'position_draggable'	: function (rt, label)
		{
			label.position = XSeen.Tags.label.position_fixed;
			label.position (rt, label);
		},
	'position_fixed'	: function (rt, label)
		{
			label.labelWorld.x = 0 -1 + 2 * (label.label.offsetLeft + label.label.offsetWidth/2)   * rt.Size.iwidth;
			label.labelWorld.y = 0 +1 - 2 * (label.label.offsetTop  + label.label.offsetHeight/2) * rt.Size.iheight;
			label.labelWorld.z = -1;
			label.labelWorld = label.labelWorld.unproject (rt.Camera);
			label.labelWorld.initialized = true;
		},

	'position_tracking'	: function (rt, label)
		{
			var projected = label.targetWorld.clone();
			projected.project(rt.Camera);
			var w2, h2, labelx, labely;
			w2 = rt.Size.width / 2;
			h2 = rt.Size.height / 2;
			projected.x = w2 + (projected.x * w2);
			projected.y = h2 - (projected.y * h2);
			if (!label.initialized) {
				label.labelDelta.x = projected.x - label.label.offsetLeft;
				label.labelDelta.y = projected.y - label.label.offsetTop;
				label.initialized = true;
			}

			labelx = projected.x - label.labelDelta.x;
			labely = projected.y - label.labelDelta.y;
			label.label.style.left = labelx + 'px';
			label.label.style.top  = labely + 'px';

			XSeen.Tags.label.position_fixed (rt, label);
		},
	
};
XSeen.Tags.leader = {
	'init'	: function (e, p) 
		{
			var targetElement = document.getElementById (e._xseen.attributes.target);
			if (typeof(targetElement) === 'undefined' || targetElement === null) {return;}
			var ele = {'element': targetElement, 'leaderColor': e._xseen.attributes.leadercolor};
			p._xseen.targets.push (ele);
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'label',
						'init'	: XSeen.Tags.label.init,
						'fin'	: XSeen.Tags.label.fin,
						'event'	: XSeen.Tags.label.event
						})
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'fixed', enumeration:['fixed', 'draggable', 'tracking'], isCaseInsensitive:true, 'isAnimatable':false})
		.defineAttribute ({'name':'position', dataType:'xyz', 'defaultValue':{x:0, y:0, z:0}})
		.defineAttribute ({'name':'leadercolor', dataType:'color', 'defaultValue':{'r':1,'g':1,'b':0}})
		.addTag();
XSeen.Parser.defineTag ({
						'name'	: 'leader',
						'init'	: XSeen.Tags.leader.init,
						'fin'	: XSeen.Tags.leader.fin,
						'event'	: XSeen.Tags.leader.event
						})
		.defineAttribute ({'name':'target', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'leadercolor', dataType:'color'})
		.addTag();
// File: tags/light.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Tag definition code for light


XSeen.Tags.light = {
	'_changeAttribute'	: function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				//var type = XSeen.Tags.light._saveAttributes (e);
				XSeen.Tags.light._processChange (e);
			} else {
				XSeen.LogWarn("Re-parse of " + attributeName + " is invalid -- no change")
			}
		},
	'_processChange'	: function (e, attributeName, value) {
			var lamp, color, intensity;
			color = e._xseen.attributes.color;
			intensity = e._xseen.attributes.intensity - 0;
			lamp = e._xseen.tagObject;
			if (!e._xseen.attributes.on) {intensity = 0;}
			lamp.intensity = intensity;
			lamp.color = color;
		},
		
		
		
	'init'	: function (e,p) 
		{
			var color = e._xseen.attributes.color;
			var intensity = e._xseen.attributes.intensity - 0;
			var lamp, type=e._xseen.attributes.type;
			if (!e._xseen.attributes.on) {intensity = 0;}

			if (type == 'point') {
				// Ignored field -- e._xseen.attributes.location
				lamp = new THREE.PointLight (color, intensity);
				lamp.distance = Math.max(0.0, e._xseen.attributes.radius - 0);
				lamp.decay = Math.max (.1, e._xseen.attributes.attenuation[1]/2 + e._xseen.attributes.attenuation[2]);

			} else if (type == 'spot') {
				lamp = new THREE.SpotLight (color, intensity);
				lamp.position.set(0-e._xseen.attributes.direction[0], 0-e._xseen.attributes.direction[1], 0-e._xseen.attributes.direction[2]);
				lamp.distance = Math.max(0.0, e._xseen.attributes.radius - 0);
				lamp.decay = Math.max (.1, e._xseen.attributes.attenuation[1]/2 + e._xseen.attributes.attenuation[2]);
				lamp.angle = Math.max(0.0, Math.min(1.5707963267948966192313216916398, e._xseen.attributes.cutoffangle));
				lamp.penumbra = 1 - Math.max(0.0, Math.min(lamp.angle, e._xseen.attributes.beamwidth)) / lamp.angle;

			} else {											// DirectionalLight (by default)
				lamp = new THREE.DirectionalLight (color, intensity);
				lamp.position.x = 0-e._xseen.attributes.direction[0];
				lamp.position.y = 0-e._xseen.attributes.direction[1];
				lamp.position.z = 0-e._xseen.attributes.direction[2];
			}
			lamp.name = 'Light: ' + e.id;
			e._xseen.tagObject = lamp;
			p._xseen.children.push(lamp);
			lamp = null;
		},

	'fin'	: function (e,p)
		{
		},

	'event'	: function (ev, attr)
		{
		},

	'tick'	: function (systemTime, deltaTime)
		{
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'light',
						'init'	: XSeen.Tags.light.init,
						'fin'	: XSeen.Tags.light.fin,
						'event'	: XSeen.Tags.light.event,
						'tick'	: XSeen.Tags.light.tick
						})
		.defineAttribute ({'name':'on', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'color', dataType:'color', 'defaultValue':0xFFFFFF, 'isAnimatable':true})
		.defineAttribute ({'name':'intensity', dataType:'float', 'defaultValue':1.0, 'isAnimatable':true})
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'directional', enumeration:['directional','spot','point'], isCaseInsensitive:true, 'isAnimatable':false})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':100, 'isAnimatable':true})
		.defineAttribute ({'name':'attenuation', dataType:'vec3', 'defaultValue':[1,0,0], 'isAnimatable':false})
		.defineAttribute ({'name':'direction', dataType:'vec3', 'defaultValue':[0,0,-1], 'isAnimatable':true})
		.defineAttribute ({'name':'cutoffangle', dataType:'float', 'defaultValue':3.14, 'isAnimatable':true})
		.defineAttribute ({'name':'beamwidth', dataType:'float', 'defaultValue':1.57, 'isAnimatable':true})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.light._changeAttribute}]})
		.addTag();
// File: tags/metadata.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 */

/*
 * The metadata tag defines metadata for an XSeen tag. Each metadata tag can define an individual value
 * or a collection of values stored as children elements. Metadata tags do not contain values.
 * A metadata structure is created by nesting additional metadata tags as children of a metadata tag.
 * All global HTML attributes are supported (and ignored).
 *
 * Changes to any metadata tag causes the entire metadata structure to be rebuilt and resaved
 * to the parent tag's data structure.
 *
 * Metadata is accessible with the getMetadata method called on the XSeen tag. It optionally
 * takes the name of the top-level metadata element name. Metadata tags without the 'name'
 * attribute create ascending array elements (using <object>.push).
 *
 */

 
/*
 * Need to parse out name and save it. Creation of the metadata structure is not done until 'fin' to
 * allow for children
 *
 *	Goal is to end up with a structure that for each child level there is an array element for each metadata tag
 *	and if 'name' is defined, there is exist a reference to that array element. Parent tag contains the entire
 *	structure of their children.
 *	<[parent] ...>
 *		<metadata name='c1' value='1'></metadata>
 *		<metadata name='c2'>
 *			<metadata name='c2.1' value='-1'></metadata>
 *			<metadata name='c2.2' value='test'></metadata>
 *			<metadata value='no name'></metadata>
 *		</metadata>
 *		<metadata name='c3' value='label1'></metadata>
 *			<metadata name='c3.1' value='-1'></metadata>
 *			<metadata name='c3.2' value='test'></metadata>
 *		</metadata>
 *	</[parent]>
 *
 * produces:
 *	[parent].Metadata(
 *						[0]		=> '1',
 *						[1]		=> (
 *									[0]		=> '',
 *									[1]		=> '-1',
 *									[2]		=> 'test',
 *									[3]		=> 'no name',
 *									['c2.1']=> (-->[1]),
 *									['c2.2']=> (-->[2])
 *									)
 *						[2]		=> (
 *									[0]		=> 'label1'
 *									[1]		=> '-1',
 *									[2]		=> 'test',
 *									['c3.1']=> (-->[1]),
 *									['c3.2']=> (-->[2])
 *									)
 *						['c1']	=> (-->[0]),
 *						['c2']	=> (-->[1]),
 *						['c3']	=> (-->[2])
 *					]
 * Metadata init
 */
XSeen.Tags.metadata = {
	'init'	: function (e, p) 
		{
			// Get name, value, and type
			// Parse value according to 'type'
			// Save this value in e._xseen.Metadata['name' : value]
			e._xseen.tmp.meta = [];
			e._xseen.tmp.meta.push (e._xseen.attributes.value);
			if (typeof(p._xseen.tmp.meta) == 'undefined') {p._xseen.tmp.meta = [];}
		},
	'fin'	: function (e, p) 
		{
			if (e._xseen.tmp.meta.length == 1) {		// this is a leaf tag
				p._xseen.tmp.meta.push (e._xseen.tmp.meta[0]);
				e._xseen.Metadata.push (e._xseen.tmp.meta[0]);
			} else {
				p._xseen.tmp.meta.push (e._xseen.tmp.meta);
				e._xseen.Metadata.push (e._xseen.tmp.meta);
			}
			if (e._xseen.attributes.name != '') {p._xseen.tmp.meta[e._xseen.attributes.name] = p._xseen.tmp.meta[p._xseen.tmp.meta.length-1];}
			e._xseen.tmp.meta = [];
		},
	'event'	: function (ev, attr) {},
	'changeValue'	: function (ev, attr) 
		{
			// Change this value and reparse Metadata tree
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'metadata',
						'init'	: XSeen.Tags.metadata.init,
						'fin'	: XSeen.Tags.metadata.fin,
						'event'	: XSeen.Tags.metadata.event
						})
		.defineAttribute ({'name':'name', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'value', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'string', enumeration:['string','integer', 'float', 'vector', 'object'], isCaseInsensitive:true, 'isAnimatable':false})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.metadata.changeValue}]})
		.addTag();
// File: tags/model.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 */

 // Control Node definitions
 
/*
 * xxTODO: Update xseen... XSeen...
 * DONE:  TODO: Add standard position, rotation, and scale fields with XSeen.Tags.setSpace method
 * DONE:  TODO: Improve handling of file formats that the loaders cannot do version distinction (gltf)
 * DONE:  TODO: Save current URL so any changes can be compared to increase performance
 * TODO: Add handling of changing model URL - need to stop & delete animations
 * TODO: Investigate how to add 'setValue' and 'getValue' to work with [s|g]etAttribute
 * TODO: Implement default path/URL for loader.
 */

XSeen.Tags.model = {
	'_changeAttribute'	: function (e, attributeName, value) {
			//console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			// TODO: add handling of change to 'backgroundiscube' attribute. Need to tie this is an image format change.
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				if (attributeName == 'env-map') {
					if (e._xseen.attributes['env-map'].substring(0,1) == '#') {
						var cubeMapNode = document.getElementById(e._xseen.attributes['env-map'].substring(1));
						cubeMapNode.removeEventListener ('xseen-loadcomplete', XSeen.Tags.model._updateEnvMap, true);
					}
					e._xseen.properties.envMap = XSeen.Tags.model._envMap(e, e._xseen.attributes['env-map']);
					XSeen.Tags.model.applyEnvMap(e);
				}
			} else {
				XSeen.LogWarn("Re-parse of " + attributeName + " is invalid -- no change")
			}
		},

	'init'	: function (e, p) 
		{
			e._xseen.processedUrl = false;
			e._xseen.loaded = {'envmap':false, 'model':false, }
/*
 * Event handler for loading new environment map from asset
 *
 *	This method handles updating all model nodes that use the texture from the node that generated the event
 *	It generates a list of all matching nodes for this texture, then updates each one in turn
 */
			e._xseen._updateEnvMap = function (ev) {
				var cssQuery = "x-model[env-map='#" + ev.target.id + "']";
				var eleList = ev.detail.Runtime.RootTag.querySelectorAll("x-model[env-map='#"+ev.target.id+"']");
				eleList.forEach(function(modelEle) {
					modelEle._xseen.properties.envMap = ev.target._xseen.cubemap;
					XSeen.Tags.model.applyEnvMap(modelEle);
				});
			};

			if (e._xseen.attributes['env-map'] != '') {
				e._xseen.properties.envMap = XSeen.Tags.model._envMap(e, e._xseen.attributes['env-map']);
			}
			e._xseen.tmpGroup = new THREE.Group();
			e._xseen.tmpGroup.name = 'External Model [' + e.id + ']';
			e._xseen.loadGroup = new THREE.Group();
			e._xseen.loadGroup.name = 'External Model [' + e.id + ']';
			e._xseen.loadGroup.name = 'Parent of |' + e._xseen.tmpGroup.name  + '|';
			e._xseen.loadGroup.add (e._xseen.tmpGroup);
			//XSeen.Tags._setSpace (e._xseen.loadGroup, e._xseen.attributes);
			XSeen.Tags._setSpace (e._xseen.tmpGroup, e._xseen.attributes);

			//console.log ('Created Inline Group with UUID ' + e._xseen.loadGroup.uuid);
			//XSeen.Loader.load (e._xseen.attributes.src, e._xseen.attributes.hint, XSeen.Tags.model.loadSuccess({'e':e, 'p':p}), XSeen.Tags.model.loadFailure, XSeen.Tags.model.loadProgress);
			XSeen.Loader.load (e._xseen.attributes.src, e._xseen.attributes.hint, XSeen.Tags.model.loadSuccess({'e':e, 'p':p}));
			e._xseen.requestedUrl = true;
			var pickingId = e._xseen.attributes['picking-group'];
			var pickEle = (pickingId == '') ? null : document.getElementById(pickingId);
			var pickEle = document.getElementById(pickingId) || e;
			e._xseen.pickGroup = pickEle;		// TODO: Really should go into mesh.userData, but need standardized method to create that entry
			e._xseen.tagObject = e._xseen.loadGroup;
			p._xseen.children.push(e._xseen.loadGroup);
			//console.log ('Using Inline Group with UUID ' + e._xseen.loadGroup.uuid);

		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	
/*
 * Once the environment map and model are loaded, add the envmap to all Meshes
 */
	'applyEnvMap'	: function (e) {
			if (e._xseen.loaded.envmap && e._xseen.loaded.model) {
				e._xseen.tmpGroup.traverse (function(child) {
					if (child.isMesh) child.material.envMap = e._xseen.properties.envMap;
				});
				//console.log ('Successful load of environment textures to glTF model.');
			}
	},


/*
 * Event handler for loading new environment map from asset
 *
 *	This method handles updating all model nodes that use the texture from the node that generated the event
 *	It generates a list of all matching nodes for this texture, then updates each one in turn
 *	LoadComplete event must have loaded a texturecube
 */
	'_updateEnvMap'	: function (ev) {
				if (ev.detail.type != 'texturecube') return;
				var cssQuery = "x-model[env-map='#" + ev.target.id + "']";
				var eleList = ev.detail.Runtime.RootTag.querySelectorAll("x-model[env-map='#"+ev.target.id+"']");
				eleList.forEach(function(modelEle) {
					modelEle._xseen.properties.envMap = ev.target._xseen.cubemap;
					XSeen.Tags.model.applyEnvMap(modelEle);
				});
	},

/*
 * Start load process for environment map image cube
 *	Taken from solids
 */
	'_envMap'	: function (e, envMapUrl) {
			if (envMapUrl.substring(0,1) == '#') {
				var cubeMapNode = document.getElementById(envMapUrl.substring(1));
				e._xseen.loaded.envmap = true;
				//console.log ('Adding event listener "XSeen.Tags.model._updateEnvMap" for change to model texture on '+cubeMapNode.id);
				cubeMapNode.addEventListener ('xseen-loadcomplete', XSeen.Tags.model._updateEnvMap, true);
				//e._xseen.processedUrl = true;
				return cubeMapNode._xseen.cubemap;
			}
			var envMap, basePath = 'Resources/textures/';
			envMap = null;
			//console.log ('Loading textures from ' + envMapUrl);
			XSeen.Loader.TextureCube (envMapUrl, [], '.jpg', XSeen.Tags.model.envLoadSuccess({'e':e}));
			return envMap;
	},

/*
 * This method assumes that the target is an environment map in a material in a mesh. It won't
 * for a material-only node. Perhaps I need a new field that is a reference to the environment map
 * location
 */
	'envLoadSuccess'	: function (userdata) {
			var thisEle = userdata.e;
			return function (textureCube)
			{
				thisEle._xseen.properties.envMap = textureCube;
				thisEle._xseen.loaded.envmap = true;
				XSeen.Tags.model.applyEnvMap(thisEle);
			}
	},

					// Method for adding userdata from https://stackoverflow.com/questions/11997234/three-js-jsonloader-callback
	'loadProgress' : function (a1) {
		if (a1.total == 0) {
			console.log ('Progress loading '+a1.type);
		} else {
			console.log ('Progress ('+a1.type+'): ' + a1.loaded/a1.total * 100 + '%');
		}
	},
	'loadFailure' : function (a1) {
		console.log ('Failure ('+a1.type+'): ' + a1.timeStamp);
	},
	'loadSuccess' : function (userdata) {
						var e = userdata.e;
						var p  = userdata.p;
						return function (response) {
							XSeen.Events.loadComplete ('glTF model', e);
							e._xseen.processedUrl = true;
							e._xseen.requestedUrl = false;
							e._xseen.loadText = response;
							e._xseen.currentUrl = e._xseen.attributes.src;

// Something is not loading into the scene. It may be a synchronization issue.
							console.log("Successful download for |"+e.id+'|');
							//e._xseen.loadGroup.add(response.scene);		// This works for glTF
							e._xseen.tmpGroup.add(response.scene);		// This works for glTF
							e._xseen.loaded.model = true;
							XSeen.Tags.model.applyEnvMap(e);
							//e._xseen.applyEnvMap();
							
							//p._xseen.children.push(e._xseen.loadGroup);
							console.log ('glTF loading complete and inserted into parent');
							//p._xseen.children.push(mesh);
/*
 ** TODO: Need to go deeper into the structure
 * See https://stackoverflow.com/questions/26202064/how-to-select-a-root-object3d-using-raycaster
 *
 * Reference to 'root' may be incorrect. See Events.js for details as to how it is used.
 */
							XSeen.Tags.model.addReferenceToRoot (response.scene, e);
							p._xseen.sceneInfo.selectable.push(response.scene)
							p._xseen.sceneInfo.SCENE.updateMatrixWorld();
							if (response.animations !== null) {				// This is probably glTF specific
								e._xseen.mixer = new THREE.AnimationMixer (response.scene);
								e._xseen.sceneInfo.Mixers.push (e._xseen.mixer);
							} else {
								e._xseen.mixer = null;
							}

							if (e._xseen.attributes.playonload != '' && e._xseen.mixer !== null) {			// separate method?
								if (e._xseen.attributes.playonload == '*') {			// Play all animations
									response.animations.forEach( function ( clip ) {
										console.log('  starting animation for '+clip.name);
										if (e._xseen.attributes.duration > 0) {clip.duration = e._xseen.attributes.duration;}
										e._xseen.mixer.clipAction( clip ).play();
									} );
								} else {											// Play a specific animation
									var clip = THREE.AnimationClip.findByName(response.animations, e._xseen.attributes.playonload);
									var action = e._xseen.mixer.clipAction (clip);
									action.play();
								}
							}
						}
					},

	'addReferenceToRoot' : function (ele, root)
		{
			// See above TODO referencing pickGroup
			//console.log ('addReferenceToRoot -- |' + ele.name + '|');
			//if (ele.isObject) {
				ele.userData.root = root;
				ele.userData.pick = root._xseen.pickGroup;
			//}
			ele.children.forEach (function(elm) {
				//p._xseen.sceneInfo.selectable.push(elm);
				XSeen.Tags.model.addReferenceToRoot (elm, root);
			});
		},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'model',
						'init'	: XSeen.Tags.model.init,
						'fin'	: XSeen.Tags.model.fin,
						'event'	: XSeen.Tags.model.event,
						'tick'	: XSeen.Tags.model.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'hint', dataType:'string', 'defaultValue':''})	// loader hint - typically version #
		.defineAttribute ({'name':'playonload', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'duration', dataType:'float', 'defaultValue':-1, 'isAnimatable':false})
		.defineAttribute ({'name':'env-map', dataType:'string', 'defaultValue':''})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.model._changeAttribute}]})
		.addTag();
// File: tags/scene.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Control Node definitions

XSeen.Tags.scene = {
	'DEFAULT'	: {
			'Viewpoint'	: {
				'Position'		: [0, 0, 10],
				'Orientation'	: [0, 1, 0, 0],		// TODO: fix (and below) when handling orientation
				'Type'			: 'perpsective',
				'Motion'		: 'none',
				'MotionSpeed'	: 1.0,
			},
			'Navigation' : {
				'Speed'		: 1.0,		// 16 spr (1 revolution per 16 seconds), in mseconds.
				'Type'		: 'none',
				'Setup'		: 'none',
			}
		},
	'init'	: function (e, p) 
		{
			e._xseen.sceneInfo.SCENE = new THREE.Scene();
			// Stereo viewing effect
			// from http://charliegerard.github.io/blog/Virtual-Reality-ThreeJs/
			var x_effect = new THREE.StereoEffect(e._xseen.sceneInfo.Renderer);

		},
	'fin'	: function (e, p) 
		{

/*
 *	Add an event listener to this node for resize (including orientation change) events
 */
			window.addEventListener ('resize', XSeen.Runtime.Resize, false);
			window.addEventListener ('orientationchange', XSeen.Runtime.Resize, false);
/*
 * TODO: Need to get current top-of-stack for all stack-bound nodes and set them as active.
 *	This only happens the initial time for each XSeen tag in the main HTML file
 *
 *	At this time, only Viewpoint is stack-bound. Probably need to stack just the <Viewpoint>._xseen object.
 *	Also, .fields.position is the initial specified location; not the navigated/animated one
 */

//			XSeen.LogInfo("Ready to kick off rendering loop");
//			XSeen.renderFrame();
			//RunTest (e._xseen.sceneInfo);
// Configure current camera
			e._xseen.sceneInfo.ViewManager.setNext();
			
			if (e._xseen.attributes.cubetest) {
				XSeen.LogInfo("Kicking off THREE testing code and rendering");
				DoRestOfCubes (e._xseen.sceneInfo);
			} else {
				//XSeen.Runtime.SCENE.background = new THREE.Color(0xbb0000);
				//XSeen.Runtime.Renderer.animate( XSeen.RenderFrame() );
				XSeen.Runtime.Animate();
			}
		},
	'resize': function () {
			var thisTag = XSeen.Runtime.RootTag;
			XSeen.Runtime.Camera.aspect = thisTag.offsetWidth / thisTag.offsetHeight;
			XSeen.Runtime.Camera.updateProjectionMatrix();
			XSeen.Runtime.Renderer.setSize (thisTag.offsetWidth, thisTag.offsetHeight)
		},
	'addScene': function () {
			// Render all Children
			var e = XSeen.Runtime.RootTag;
			//console.log ('INFO: Adding children to SCENE');
			e._xseen.idReference = e._xseen.idReference || Array();
			e._xseen.children.forEach (function (child, ndx, wholeThing)
				{
					if (e._xseen.idReference[child.id] === undefined) {
						//console.log('Adding child of type ' + child.type + ' (' + child.name + '/' + child.id + ') with ' + child.children.length + ' children to THREE scene');
						e._xseen.sceneInfo.SCENE.add(child);
						e._xseen.idReference[child.id] = child;
						//console.log('Check for successful add');
					}
				});
//			XSeen.LogDebug("Rendered all elements -- Starting animation");

		},
	'event'	: function (ev, attr)
		{
		},

	'tick'	: function (systemTime, deltaTime)
		{
		},
};


// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'scene',
						'init'	: XSeen.Tags.scene.init,
						'fin'	: XSeen.Tags.scene.fin,
						'event'	: XSeen.Tags.scene.event,
						'tick'	: XSeen.Tags.scene.tick
						})
		.defineAttribute ({'name':'cubetest', dataType:'boolean', 'defaultValue':false})
		.addTag();
// File: tags/solids.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 * portions extracted from or inspired by
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

 // Tag definition code for light

XSeen.Tags.Solids = {};
XSeen.Tags._appearance = function (e) {
			e._xseen.texture = null;
			if (e._xseen.attributes['map'] !== '') {
				console.log ('Loading texture: |'+e._xseen.attributes['map']+'|');
				e._xseen.texture = new THREE.TextureLoader().load (e._xseen.attributes['map']);
				e._xseen.texture.wrapS = THREE.ClampToEdgeWrapping;
				e._xseen.texture.wrapT = THREE.ClampToEdgeWrapping;
			}
			e._xseen.properties['side'] = THREE.FrontSide;
			if (e._xseen.attributes['side'] == 'back') e._xseen.properties['side'] = THREE.BackSide;
			if (e._xseen.attributes['side'] == 'both') e._xseen.properties['side'] = THREE.DoubleSide;

			var parameters, appearance;
			if (e._xseen.attributes.material != '') {
				var ele = document.getElementById (e._xseen.attributes.material);
				if (typeof(ele) != 'undefined') {
					console.log ('Using asset material: ' + e._xseen.attributes.material);
					appearance = ele._xseen.tagObject;
				} else {
					console.log ('Reference to undeclared material: ' + e._xseen.attributes.material);
					appearance = {};
				}
			} else if (e._xseen.attributes.type == 'phong') {
				parameters = {
							'aoMap'					: e._xseen.attributes['ambient-occlusion-map'],
							'aoMapIntensity'		: e._xseen.attributes['ambient-occlusion-map-intensity'],
							'color'					: XSeen.Parser.Types.colorRgbInt (e._xseen.attributes['color']),
							'displacementMap'		: e._xseen.attributes['displacement-map'],
							'displacementScale'		: e._xseen.attributes['displacement-scale'],
							'displacementBias'		: e._xseen.attributes['displacement-bias'],
							'emissive'				: e._xseen.attributes['emissive'],
							'map'					: e._xseen.texture,
							'normalMap'				: e._xseen.attributes['normal-map'],
							'normalScale'			: e._xseen.attributes['normal-scale'],
							'side'					: e._xseen.properties['side'],
							'wireframe'				: e._xseen.attributes['wireframe'],
							'wireframeLinewidth'	: e._xseen.attributes['wireframe-linewidth'],
// General material properties
							'emissiveIntensity'		: e._xseen.attributes['emissive-intensity'],
							'opacity'				: e._xseen.attributes['opacity'],
							'transparent'			: e._xseen.attributes['transparent'],
// General material properties that only apply to Phong or PBR
							'reflectivity'			: e._xseen.attributes['reflectivity'],
							'refractionRatio'		: e._xseen.attributes['refraction-ratio'],
// Phong properties
							'shininess'				: e._xseen.attributes['shininess'],
							'specular'				: e._xseen.attributes['specular'],
							};
				appearance = new THREE.MeshPhongMaterial(parameters);
			} else if (e._xseen.attributes.type == 'pbr') {
				parameters = {
							'aoMap'					: e._xseen.attributes['ambient-occlusion-map'],
							'aoMapIntensity'		: e._xseen.attributes['ambient-occlusion-map-intensity'],
							'color'					: XSeen.Parser.Types.colorRgbInt (e._xseen.attributes['color']),
							'displacementMap'		: e._xseen.attributes['displacement-map'],
							'displacementScale'		: e._xseen.attributes['displacement-scale'],
							'displacementBias'		: e._xseen.attributes['displacement-bias'],
							'emissive'				: e._xseen.attributes['emissive'],
							'map'					: e._xseen.texture,
							'normalMap'				: e._xseen.attributes['normal-map'],
							'normalScale'			: e._xseen.attributes['normal-scale'],
							'side'					: e._xseen.properties['side'],
							'wireframe'				: e._xseen.attributes['wireframe'],
							'wireframeLinewidth'	: e._xseen.attributes['wireframe-linewidth'],
// General material properties
							'emissiveIntensity'		: e._xseen.attributes['emissive-intensity'],
							'opacity'				: e._xseen.attributes['opacity'],
							'transparent'			: e._xseen.attributes['transparent'],
// General material properties that only apply to Phong or PBR
							'reflectivity'			: e._xseen.attributes['reflectivity'],
							'refractionRatio'		: e._xseen.attributes['refraction-ratio'],
// PBR properties
							'metalness'				: e._xseen.attributes['metalness'],
							'roughness'				: e._xseen.attributes['roughness'],
							};
				appearance = new THREE.MeshPhysicalMaterial(parameters);
			} else {
				parameters = {
							'aoMap'					: e._xseen.attributes['ambient-occlusion-map'],
							'aoMapIntensity'		: e._xseen.attributes['ambient-occlusion-map-intensity'],
							'color'					: XSeen.Parser.Types.colorRgbInt (e._xseen.attributes['color']),
							'displacementMap'		: e._xseen.attributes['displacement-map'],
							'displacementScale'		: e._xseen.attributes['displacement-scale'],
							'displacementBias'		: e._xseen.attributes['displacement-bias'],
							'emissive'				: e._xseen.attributes['emissive'],
							'map'					: e._xseen.texture,
							'normalMap'				: e._xseen.attributes['normal-map'],
							'normalScale'			: e._xseen.attributes['normal-scale'],
							'side'					: e._xseen.properties['side'],
							'wireframe'				: e._xseen.attributes['wireframe'],
							'wireframeLinewidth'	: e._xseen.attributes['wireframe-linewidth'],
// General material properties
							'emissiveIntensity'		: e._xseen.attributes['emissive-intensity'],
							'opacity'				: e._xseen.attributes['opacity'],
							'transparent'			: e._xseen.attributes['transparent'],
							};
				appearance = new THREE.MeshBasicMaterial(parameters);
			}
			return appearance;
}

/*
 * Handle creation of solid (including flat) objects.
 * Parameters:
 *	e			Current DOM node
 *	p			Parent (of e) DOM node
 *	geometry	THREE geometry structure for creating an object
 */
XSeen.Tags._solid = function (e, p, geometry) {
			var appearance = XSeen.Tags._appearance (e);

			//geometry.needsUpdate = true;
	
			// Create mesh, set userData and animateable fields
			var mesh = new THREE.Mesh (geometry, appearance);
			mesh.userData = e;
			mesh.visible  = e._xseen.attributes.visible;
			XSeen.Tags._setSpace(mesh, e._xseen.attributes);
			var pickingId = e._xseen.attributes['picking-group'];
			var pickEle = (pickingId == '') ? null : document.getElementById(pickingId);
			e._xseen.pickGroup = pickEle;		// TODO: Really should go into mesh.userData, but need standardized method to create that entry


			e._xseen.animate['position']			= mesh.position;
			e._xseen.animate['scale']				= mesh.scale;
			e._xseen.animate['rotate-x']			= XSeen.Tags.Solids._animateRotation (mesh, 'rotateX');
			e._xseen.animate['rotate-y']			= XSeen.Tags.Solids._animateRotation (mesh, 'rotateY');
			e._xseen.animate['rotate-z']			= XSeen.Tags.Solids._animateRotation (mesh, 'rotateZ');
			e._xseen.animate['color']				= mesh.material.color;
			e._xseen.animate['emissive']			= mesh.material.emissive;
			e._xseen.animate['normalScale']			= mesh.material.normalScale;
			e._xseen.animate['wireframeLinewidth']	= mesh.material.wireframeLinewidth;
			e._xseen.animate['emissiveIntensity']	= mesh.material.emissiveIntensity;
			e._xseen.animate['opacity']				= XSeen.Tags.Solids._animateScalar (mesh.material, 'opacity');
			e._xseen.animate['reflectivity']		= mesh.material.reflectivity;
			e._xseen.animate['refractionRatio']		= mesh.material.refractionRatio;
			e._xseen.animate['shininess']			= mesh.material.shininess;
			e._xseen.animate['specular']			= mesh.material.specular;
			e._xseen.animate['displacementScale']	= mesh.material.displacementScale;
			e._xseen.animate['displacementBias']	= mesh.material.displacementBias;
			e._xseen.animate['metalness']			= mesh.material.metalness;
			e._xseen.animate['roughness']			= mesh.material.roughness;

			if (e._xseen.attributes.selectable) p._xseen.sceneInfo.selectable.push(mesh);
			mesh.name = 'Solid: ' + e.id;
			
			e._xseen.tagObject = mesh;
			p._xseen.children.push(mesh);
			e._xseen.properties.envMap = XSeen.Tags.Solids._envMap(e, e._xseen.attributes['env-map']);
};
XSeen.Tags.Solids._animateScalar = function (obj, field) {
	var target = {'obj':obj, 'field':field};
	return function (td) {
		target.obj[target.field] = td.current;
		//console.log ('_animateScalar return function for populating "' + target.field + '" with ' + td.current);
	};
}
// Rotation is difference because it is an incremental value that needs to be put into a method
//	td.current (used in _animateScalar) is the current interpolant. Need to find the difference between
//	td.current (now) and td.current (previous).
XSeen.Tags.Solids._animateRotation = function (obj, field) {
	if (typeof(obj.userData.previousRotation) == 'undefined') {obj.userData.previousRotation = {'x':0, 'y':0, 'z':0};}
	var target = {'obj':obj, 'field':field};
	if (field == 'rotateX') {
		return function (td) {
			var rotation = td.current - target.obj.userData.previousRotation.x;
			target.obj.rotateX(rotation);
			target.obj.userData.previousRotation.x = td.current;
		};
	}
	if (field == 'rotateY') {
		return function (td) {
			var rotation = td.current - target.obj.userData.previousRotation.y;
			target.obj.rotateY(rotation);
			target.obj.userData.previousRotation.y = td.current;
		};
	}
	if (field == 'rotateZ') {
		return function (td) {
			var rotation = td.current - target.obj.userData.previousRotation.z;
			target.obj.rotateZ(rotation);
			target.obj.userData.previousRotation.z = td.current;
		};
	}
}

XSeen.Tags.Solids._changeAttribute = function (e, attributeName, value) {
			//console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;

// Set standard reference for base object based on stored type
				var baseMaterial, baseGeometry, baseMesh, baseType='';
				if (e._xseen.tagObject.isMesh) {
					baseMaterial	= e._xseen.tagObject.material;
					baseGeometry	= e._xseen.tagObject.geometry;
					baseMesh		= e._xseen.tagObject;
					baseType		= 'mesh';
				} else if (e._xseen.tagObject.isMaterial) {
					baseMaterial	= e._xseen.tagObject;
					baseType		= 'material';
				} else if (e._xseen.tagObject.isGeometry) {
					baseGeometry	= e._xseen.tagObject;
					baseType		= 'geometry';
				} else if (e._xseen.tagObject.isGroup) {
					baseMesh		= e._xseen.tagObject;
					baseType		= 'group';
				}
					
				if (attributeName == 'color') {				// Different operation for each attribute
					baseMaterial.color.setHex(value);	// Solids are stored in a 'group' of the tagObject
					baseMaterial.needsUpdate = true;
				} else if (attributeName == 'env-map') {				// Different operation for each attribute
					//console.log ('Changing envMap to |' + value + '|');
					e._xseen.properties.envMap = XSeen.Tags.Solids._envMap(e, value);
				} else if (attributeName == 'metalness') {
					//console.log ('Setting metalness to ' + value);
					baseMaterial.metalness = value;
				} else if (attributeName == 'roughness') {
					//console.log ('Setting roughness to ' + value);
					baseMaterial.roughness = value;
				} else if (attributeName == 'position') {
					//console.log ('Setting position to ' + value);
					baseMesh.position.x = value.x;
					baseMesh.position.y = value.y;
					baseMesh.position.z = value.z;
				} else if (attributeName == 'material') {
					var ele = document.getElementById (value);
					if (typeof(ele) != 'undefined') {
						console.log ('Changing to asset material: ' + value);
						e._xseen.tagObject.material = ele._xseen.tagObject;
					} else {
						console.log ('No material asset: |'+value+'|');
					}
				} else {
					XSeen.LogWarn('No support for updating ' + attributeName);
				}
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}
};

// TODO: This is very specific and only for debug/development purposes. Needs to be fixed.
XSeen.Tags.Solids._envMap = function (e, envMapUrl) {
			var envMap, basePath = 'Resources/textures/';
			envMap = null;
			XSeen.Loader.TextureCube (envMapUrl, [], '.jpg', XSeen.Tags.Solids.loadSuccess({'e':e}));

/*
			if (envMapUrl == 'desert') {
				XSeen.Loader.TextureCube (basePath + 'desert_1/', [], '.jpg', XSeen.Tags.Solids.loadSuccess({'e':e}));

			} else if (envMapUrl == 'forest') {
				XSeen.Loader.TextureCube (basePath + 'forest_1/', [], '.jpg', XSeen.Tags.Solids.loadSuccess({'e':e}));

			} else if (envMapUrl == 'gray') {
				XSeen.Loader.TextureCube (basePath + 'gray99/', [], '.jpg', XSeen.Tags.Solids.loadSuccess({'e':e}));
/*				envMap = new THREE.CubeTextureLoader()
											.setPath('Resources/textures/')
											.load ([
													'gray99-right.png',
													'gray99-left.png',
													'gray99-top.png',
													'gray99-bottom.png',
													'gray99-front.png',
													'gray99-back.png',
											]);
 * /
			} else if (envMapUrl == 'color') {
				XSeen.Loader.TextureCube (basePath + 'starburst/', [], '.jpg', XSeen.Tags.Solids.loadSuccess({'e':e}));

			} else {
				envMap = null;
			}
 */
			return envMap;
};

// This method assumes that the target is an environment map in a material in a mesh. It won't
// for a material-only node. Perhaps I need a new field that is a reference to the environment map
// location
XSeen.Tags.Solids.loadSuccess = function (userdata) {
	var thisEle = userdata.e;
	return function (textureCube)
	{
		//thisEle._xseen.processedUrl = true;
		if (thisEle._xseen.tagObject.type == 'Material') {
			thisEle._xseen.tagObject.envMap = textureCube;
			thisEle._xseen.tagObject.needsUpdate = true;
		} else {
			thisEle._xseen.tagObject.material.envMap = textureCube;
			thisEle._xseen.tagObject.material.needsUpdate = true;
		}
		console.log ('Successful load of environment textures.');
	}
};

/*
 *	Generalized geometry creator
 *	This is done so the 'geometry' asset tag can easily create what is needed
 *
 *	Arguments:
 *		e		The current DOM node
 *		shape	The requested shape for this tag
 *
 *	If geometry attribute specified, defined, and matches 'shape'; then return that.
 *	Otherwise return an empty object or process arguments
 */
XSeen.Tags._geometry = function (e, shape) {
	if (typeof(e._xseen.attributes.geometry) != 'undefined' && e._xseen.attributes.geometry != '') {
		var ele = document.getElementById (e._xseen.attributes.geometry);
		if (typeof(ele) != 'undefined') {
			console.log ('Using asset geometry: ' + e._xseen.attributes.geometry + '(' + ele._xseen.tagObject.type + ')');
			if (ele._xseen.tagObject.type.toLowerCase() == shape+'geometry') {
				return ele._xseen.tagObject;
			} else {
				console.log ('-- mismatch between requested shape and asset geometry');
			}
		} else {
			console.log ('Reference to undeclared material: ' + e._xseen.attributes.material);
		}
		return new THREE.Geometry();
	}

	
// 'geometry' attribute not defined
				
	var geometry;
	if (shape == 'box') {
		geometry = new THREE.BoxGeometry(
										e._xseen.attributes.width, 
										e._xseen.attributes.height, 
										e._xseen.attributes.depth,
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['segments-depth']
									);
	} else if (shape == 'cone') {
		geometry = new THREE.ConeGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['open-ended'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);

	} else if (shape == 'cylinder') {
		geometry = new THREE.CylinderGeometry(
										e._xseen.attributes['radius-top'], 
										e._xseen.attributes['radius-bottom'], 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['open-ended'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);

	} else if (shape == 'dodecahedron') {
		geometry = new THREE.DodecahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);

	} else if (shape == 'icosahedron') {
		geometry = new THREE.IcosahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);

	} else if (shape == 'octahedron') {
		geometry = new THREE.OctahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);

	} else if (shape == 'sphere') {
		geometry = new THREE.SphereGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['phi-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['phi-length'] * XSeen.CONST.Deg2Rad,
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);

	} else if (shape == 'tetrahedron') {
		geometry = new THREE.TetrahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);

	} else if (shape == 'torus') {
		geometry = new THREE.TorusGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.tube, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-tubular'], 
										e._xseen.attributes.arc * XSeen.CONST.Deg2Rad
									);

	} else if (shape == 'tknot') {
		geometry = new THREE.TorusKnotGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.tube, 
										e._xseen.attributes['segments-tubular'], 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['wind-p'], 
										e._xseen.attributes['wind-q'], 
									);

	} else if (shape == 'plane') {
		geometry = new THREE.PlaneGeometry(
										e._xseen.attributes.width, 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
									);

	} else if (shape == 'ring') {
		geometry = new THREE.RingGeometry(
										e._xseen.attributes['radius-inner'], 
										e._xseen.attributes['radius-outer'], 
										e._xseen.attributes['segments-theta'], 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);
	} else {
		geometry = new THREE.Geometry();
	}
	return geometry;
};


// Parsing of regular 'solids' tags.

// First handle tags for use in asset block (material, geometry)

XSeen.Tags.material = {
	'init'	: function (e,p)
		{
			var material = XSeen.Tags._appearance (e);
			e._xseen.tagObject = material;
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.geometry = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, e._xseen.attributes.shape);
			e._xseen.tagObject = geometry;
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};




//	Handle tags for scene node creation
XSeen.Tags.box = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'box');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.cone = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'cone');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.cylinder = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'cylinder');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.dodecahedron = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'dodecahedron');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.icosahedron = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'icosahedron');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.octahedron = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'octahedron');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.sphere = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'sphere');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.tetrahedron = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'tetrahedron');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.torus = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'torus');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.tknot = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'tknot');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

/*
 * 2D Shapes
 */
 
XSeen.Tags.plane = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'plane');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.ring = {
	'init'	: function (e,p)
		{
			var geometry = XSeen.Tags._geometry (e, 'ring');
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

/*
 * Methods for handling triangles
 *
 *	The 'triangles' tag requires at least child 'points' to function. Geometry
 *	definition is done on the way up ('fin' method).
 *
 * 'points' and 'normals' do not have any effect except as children of 'triangles'
 *
 * TODO: Add new tag 'attribute'. It has 1 attribute 'attribute' that is the case insensitive (i.e. lower case)
 *	name of the immediate parent's legal attribute. The child text-value of this tag is inserted into the parent's
 *	data structure. It gives a means to provide very large data without using an attribute.
 *	The parent must process the attribute during the 'fin' phase; otherwise the data is not present (or not current)
 *	This is motivated by very large ITS. It would be used for the 'index' attribute of 'triangles' and the 
 *	'vertex' attribute of 'points'.
 *	This allows more flexibility in 'converter.pl' to handle those cases.
 *
 */
 
XSeen.Tags.attribute = {
	'init':	function (e, p)
		{
			var attributeName = e._xseen.attributes.attribute.toLowerCase();
			if (typeof (p._xseen.attributes[attributeName]) != 'undefined') {
				// Need to be parsed according to the rules for p._xseen.attributes...
				// Need to investigate the parsing routines to see how exactly to do that
				var attrs = XSeen.Parser.getAttrInfo (p.localName.toLowerCase(), attributeName);
				var values = XSeen.Parser.parseArrayValue (e.textContent, attrs.elementCount, attrs.dataType, attrs.default);
				p._xseen.attributes[attributeName] = values;
			}
		},
	'fin':	function (e,p) {},
	'event'	: function (ev, attr) {},
};
 
XSeen.Tags.triangles = {
	'init'	: function (e,p) 
		{
			e._xseen.geometry = new THREE.Geometry();
		},
	'fin'	: function (e,p) 
		{
/*
 * Create geometry
 *	Use vertices from e._xseen.vertices and e._xseen.attributes.index
 *	If normals are defined (e._xseen.normalsDefined), then use those; otherwise, compute them
 */
			var face;
			e._xseen.attributes.index.forEach (function(faceIndex) {
				face = new THREE.Face3 (faceIndex[0], faceIndex[1], faceIndex[2]); // , normal/normal3, color/color3, materialIndex
				e._xseen.geometry.faces.push(face); 
			});
			e._xseen.geometry.computeFaceNormals();
			e._xseen.geometry.computeVertexNormals();
			XSeen.Tags._solid (e, p, e._xseen.geometry);
		},
	'event'	: function (ev, attr) {},
};
XSeen.Tags.points = {
	'init'	: function (e,p) {},
	'fin'	: function (e,p)
		{
			if (typeof(p._xseen.geometry) != 'undefined') {
				e._xseen.attributes.vertices.forEach (function(vertex) {
					//console.log ('Adding vertex: ' + vertex);
					p._xseen.geometry.vertices.push (vertex);
				});
			}
		},
	'event'	: function (ev, attr) {},
};
XSeen.Tags.normals = {
	'init'	: function (e,p) {},
	'fin'	: function (e,p)
		{
			if (count(e._xseen.attributes.vectors) >= 1) {
				p._xseen.normals = e._xseen.attributes.vectors;
				p._xseen.normalsDefined = true;
			} else {
				p._xseen.normals = [];
				p._xseen.normalsDefined = false;
			}
		},
	'event'	: function (ev, attr) {},
};


/*
 * ===================================================================================
 * Parsing definitions
 *
 * //1 ==> Commented out during PBR development
 */
XSeen.Parser._addStandardAppearance = function (tag) {
	tag
		.defineAttribute ({'name':'selectable', dataType:'boolean', 'defaultValue':true, enumeration:[true,false], isCaseInsensitive:true})
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'phong', enumeration:['wireframe', 'phong','pbr'], isCaseInsensitive:true})
		.defineAttribute ({'name':'geometry', dataType:'string', 'defaultValue':'', isCaseInsensitive:false})
		.defineAttribute ({'name':'material', dataType:'string', 'defaultValue':'', isCaseInsensitive:false})
		.defineAttribute ({'name':'visible', dataType:'boolean', 'defaultValue':true, enumeration:[true,false], isCaseInsensitive:true})	// render contents

// General material properties
		.defineAttribute ({'name':'emissive-intensity', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'opacity', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'transparent', dataType:'boolean', 'defaultValue':false})

// General material properties that only apply to Phong or PBR
		.defineAttribute ({'name':'reflectivity', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'refraction-ratio', dataType:'float', 'defaultValue':0.98})

// PBR properties
		.defineAttribute ({'name':'metalness', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'roughness', dataType:'float', 'defaultValue':0.5})

// Phong properties
		.defineAttribute ({'name':'shininess', dataType:'float', 'defaultValue':30})
		.defineAttribute ({'name':'specular', dataType:'color', 'defaultValue':'#111111'})

// Uncategorized properties
		.defineAttribute ({'name':'ambient-occlusion-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'ambient-occlusion-map-intensity', dataType:'float', 'defaultValue':1.0})
//1		.defineAttribute ({'name':'ambient-occlusion-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
//1		.defineAttribute ({'name':'ambient-occlusion-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'color', dataType:'color', 'defaultValue':'white'})
		.defineAttribute ({'name':'displacement-bias', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'displacement-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'displacement-scale', dataType:'float', 'defaultValue':1.0})
//1		.defineAttribute ({'name':'displacement-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
//1		.defineAttribute ({'name':'displacement-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'emissive', dataType:'color', 'defaultValue':'black'})
		.defineAttribute ({'name':'env-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'fog', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'metalness', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'normal-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'normal-scale', dataType:'vec2', 'defaultValue':[1,1]})
//1		.defineAttribute ({'name':'normal-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
//1		.defineAttribute ({'name':'normal-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
//1		.defineAttribute ({'name':'repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'side', dataType:'string', 'defaultValue':'front', enumeration:['front','back','both'], isCaseInsensitive:true})
//1		.defineAttribute ({'name':'spherical-env-map', dataType:'string', 'defaultValue':''})
//1		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'wireframe', dataType:'boolean', 'defaultValue':false})
		.defineAttribute ({'name':'wireframe-linewidth', dataType:'integer', 'defaultValue':2})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.Solids._changeAttribute}]})
		.addTag();
};

XSeen.Parser.defineTag ({
						'name'	: 'attribute',
						'init'	: XSeen.Tags.attribute.init,
						'fin'	: XSeen.Tags.attribute.fin,
						'event'	: XSeen.Tags.attribute.event,
						'tick'	: XSeen.Tags.attribute.tick
						})
		.defineAttribute ({'name':'attribute', dataType:'string', 'defaultValue':''})
		.addTag();

var tag;
tag = XSeen.Parser.defineTag ({
						'name'	: 'box',
						'init'	: XSeen.Tags.box.init,
						'fin'	: XSeen.Tags.box.fin,
						'event'	: XSeen.Tags.box.event,
						'tick'	: XSeen.Tags.box.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'depth', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'height', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'width', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'segments-depth', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'segments-width', dataType:'integer', 'defaultValue':1});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'cone',
						'init'	: XSeen.Tags.cone.init,
						'fin'	: XSeen.Tags.cone.fin,
						'event'	: XSeen.Tags.cone.event,
						'tick'	: XSeen.Tags.cone.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'height', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'open-ended', dataType:'boolean', 'defaultValue':false})
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':360.0})
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8});
XSeen.Parser._addStandardAppearance (tag);
	
tag = XSeen.Parser.defineTag ({
						'name'	: 'cylinder',
						'init'	: XSeen.Tags.cylinder.init,
						'fin'	: XSeen.Tags.cylinder.fin,
						'event'	: XSeen.Tags.cylinder.event,
						'tick'	: XSeen.Tags.cylinder.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'height', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'open-ended', dataType:'boolean', 'defaultValue':false})
		.defineAttribute ({'name':'radius-bottom', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'radius-top', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':360.0})
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'dodecahedron',
						'init'	: XSeen.Tags.dodecahedron.init,
						'fin'	: XSeen.Tags.dodecahedron.fin,
						'event'	: XSeen.Tags.dodecahedron.event,
						'tick'	: XSeen.Tags.dodecahedron.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'detail', dataType:'float', 'defaultValue':0.0});
XSeen.Parser._addStandardAppearance (tag);
	
tag = XSeen.Parser.defineTag ({
						'name'	: 'icosahedron',
						'init'	: XSeen.Tags.icosahedron.init,
						'fin'	: XSeen.Tags.icosahedron.fin,
						'event'	: XSeen.Tags.icosahedron.event,
						'tick'	: XSeen.Tags.icosahedron.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'detail', dataType:'float', 'defaultValue':0.0});
XSeen.Parser._addStandardAppearance (tag);
	
tag = XSeen.Parser.defineTag ({
						'name'	: 'octahedron',
						'init'	: XSeen.Tags.octahedron.init,
						'fin'	: XSeen.Tags.octahedron.fin,
						'event'	: XSeen.Tags.octahedron.event,
						'tick'	: XSeen.Tags.octahedron.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'detail', dataType:'float', 'defaultValue':0.0});
XSeen.Parser._addStandardAppearance (tag);
	
tag = XSeen.Parser.defineTag ({
						'name'	: 'sphere',
						'init'	: XSeen.Tags.sphere.init,
						'fin'	: XSeen.Tags.sphere.fin,
						'event'	: XSeen.Tags.sphere.event,
						'tick'	: XSeen.Tags.sphere.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':180.0})
		.defineAttribute ({'name':'phi-start', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'phi-length', dataType:'float', 'defaultValue':360.0})
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':18})
		.defineAttribute ({'name':'segments-width', dataType:'integer', 'defaultValue':36});
XSeen.Parser._addStandardAppearance (tag);
	
tag = XSeen.Parser.defineTag ({
						'name'	: 'tetrahedron',
						'init'	: XSeen.Tags.tetrahedron.init,
						'fin'	: XSeen.Tags.tetrahedron.fin,
						'event'	: XSeen.Tags.tetrahedron.event,
						'tick'	: XSeen.Tags.tetrahedron.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'detail', dataType:'float', 'defaultValue':0.0});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'torus',
						'init'	: XSeen.Tags.torus.init,
						'fin'	: XSeen.Tags.torus.fin,
						'event'	: XSeen.Tags.torus.event,
						'tick'	: XSeen.Tags.torus.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':2.0})
		.defineAttribute ({'name':'tube', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'arc', dataType:'float', 'defaultValue':360})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8})
		.defineAttribute ({'name':'segments-tubular', dataType:'integer', 'defaultValue':6});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'tknot',
						'init'	: XSeen.Tags.tknot.init,
						'fin'	: XSeen.Tags.tknot.fin,
						'event'	: XSeen.Tags.tknot.event
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'tube', dataType:'float', 'defaultValue':0.4})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8})
		.defineAttribute ({'name':'segments-tubular', dataType:'integer', 'defaultValue':64})
		.defineAttribute ({'name':'wind-p', dataType:'integer', 'defaultValue':2})
		.defineAttribute ({'name':'wind-q', dataType:'integer', 'defaultValue':3});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'plane',
						'init'	: XSeen.Tags.plane.init,
						'fin'	: XSeen.Tags.plane.fin,
						'event'	: XSeen.Tags.plane.event,
						'tick'	: XSeen.Tags.plane.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'height', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'width', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'segments-width', dataType:'integer', 'defaultValue':1});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'ring',
						'init'	: XSeen.Tags.ring.init,
						'fin'	: XSeen.Tags.ring.fin,
						'event'	: XSeen.Tags.ring.event,
						'tick'	: XSeen.Tags.ring.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'picking-group', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'radius-inner', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'radius-outer', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':360.0})
		.defineAttribute ({'name':'segments-theta', dataType:'integer', 'defaultValue':8})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8});
XSeen.Parser._addStandardAppearance (tag);

//	TODO: New tag for 'triangles'
/*
 * Define a Triangle node that allows geometry to be created from user-defined triangles
 *	Initial simple case only supports
 *	1) Indexed triangle sets (a collection of vertices that are referenced by index to form the triangle collection)
 *	2) Normals per vertex
 *	3) No special additions to material - supports single solid color, texture maps, etc. No color by face or vertex
 *
 * As with all other solid nodes, once the geometry is created it cannot be manipulated
 *
 */
tag = XSeen.Parser.defineTag ({
						'name'	: 'triangles',
						'init'	: XSeen.Tags.triangles.init,
						'fin'	: XSeen.Tags.triangles.fin,
						'event'	: XSeen.Tags.triangles.event,
						'tick'	: XSeen.Tags.triangles.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'index', dataType:'integer', 'defaultValue':[], isArray:true, elementCount:3, });
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'points',
						'init'	: XSeen.Tags.points.init,
						'fin'	: XSeen.Tags.points.fin,
						'event'	: XSeen.Tags.points.event,
						'tick'	: XSeen.Tags.points.tick
						})
		.defineAttribute ({'name':'vertices', dataType:'xyz', 'defaultValue':[], isArray:true, })
		.addTag();
//XSeen.Parser.dumpTable();

tag = XSeen.Parser.defineTag ({
						'name'	: 'normals',
						'init'	: XSeen.Tags.normals.init,
						'fin'	: XSeen.Tags.normals.fin,
						'event'	: XSeen.Tags.normals.event,
						'tick'	: XSeen.Tags.normals.tick
						})
		.defineAttribute ({'name':'vectors', dataType:'xyz', 'defaultValue':[], isArray:true, })
		.addTag();

//	Tags for assets. These should only be used as children of <asset>
tag = XSeen.Parser.defineTag ({
						'name'	: 'material',
						'init'	: XSeen.Tags.material.init,
						'fin'	: XSeen.Tags.material.fin,
						'event'	: XSeen.Tags.material.event,
						'tick'	: XSeen.Tags.material.tick
						})
XSeen.Parser._addStandardAppearance (tag);

/*
 *	Define 'geometry' for use with Assets. 
 *	This tag defines all geometric attributes from all tags in this collection
 *	Tags not used for a particular geometric selection are ignored
 *	Once defined, geometry cannot change; however, changes to any geometric property cause the geometry to be 
 *	recalcuated. Changing a geometric property deletes (removes from the scene graph) the current geometry and replaces it
 *	with new geometry. This may take longer than a rendered frame, so do it judiciously.
 *	No material attributes are defined and any user-supplied attributes are ignored
 *	No spatial attributes are defined.
 *	This tag is ignored outside of an asset declaration block
 */
tag = XSeen.Parser.defineTag ({
						'name'	: 'geometry',
						'init'	: XSeen.Tags.geometry.init,
						'fin'	: XSeen.Tags.geometry.fin,
						'event'	: XSeen.Tags.geometry.event,
						'tick'	: XSeen.Tags.geometry.tick
						})
		.defineAttribute ({'name':'shape', dataType:'string', 'defaultValue':'box', 
// (remove triangles)							enumeration:['box', 'cone', 'cylinder', 'dodecahedron', 'icosahedron', 'octahedron', 'sphere', 'tetrahedron', 'torus', 'tknot', 'plane', 'ring', 'triangles'], 
							enumeration:['box', 'cone', 'cylinder', 'dodecahedron', 'icosahedron', 'octahedron', 'sphere', 'tetrahedron', 'torus', 'tknot', 'plane', 'ring'], 
							isCaseInsensitive:true})
		.defineAttribute ({'name':'depth', dataType:'float', 'defaultValue':1.0})				// box
		.defineAttribute ({'name':'height', dataType:'float', 'defaultValue':1.0})				// box, cone, cylinder, plane, 
		.defineAttribute ({'name':'width', dataType:'float', 'defaultValue':1.0})				// box, plane, 
		.defineAttribute ({'name':'segments-depth', dataType:'integer', 'defaultValue':1})		// box
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})		// box, cone, cylinder, plane, 
		.defineAttribute ({'name':'segments-width', dataType:'integer', 'defaultValue':1})		// box, sphere, plane, 
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':1.0})				// cone, dodecahedron, icosahedron, octahedron, sphere, tetrahedron, torus, tknot, 
		.defineAttribute ({'name':'open-ended', dataType:'boolean', 'defaultValue':false})		// cone, cylinder, 
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':1.0})			// cone, cylinder, sphere, ring, 
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':360.0})		// cone, cylinder, sphere, ring, 
		.defineAttribute ({'name':'segments-height', dataType:'integer', 'defaultValue':1})		// cone
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8})		// cone, cylinder, torus, tknot, ring, 
		.defineAttribute ({'name':'radius-bottom', dataType:'float', 'defaultValue':1.0})		// cylinder
		.defineAttribute ({'name':'radius-top', dataType:'float', 'defaultValue':1.0})			// cylinder
		.defineAttribute ({'name':'detail', dataType:'float', 'defaultValue':0.0})				// dodecahedron, icosahedron, octahedron, tetrahedron
		.defineAttribute ({'name':'phi-start', dataType:'float', 'defaultValue':0.0})			// sphere
		.defineAttribute ({'name':'phi-length', dataType:'float', 'defaultValue':360.0})		// sphere
		.defineAttribute ({'name':'tube', dataType:'float', 'defaultValue':1.0})				// torus, tknot, 
		.defineAttribute ({'name':'arc', dataType:'float', 'defaultValue':360})					// torus
		.defineAttribute ({'name':'segments-tubular', dataType:'integer', 'defaultValue':6})	// torus, tknot, 
		.defineAttribute ({'name':'wind-p', dataType:'integer', 'defaultValue':2})				// tknot
		.defineAttribute ({'name':'wind-q', dataType:'integer', 'defaultValue':3})				// tknot
		.defineAttribute ({'name':'radius-inner', dataType:'float', 'defaultValue':0.5})		// ring
		.defineAttribute ({'name':'radius-outer', dataType:'float', 'defaultValue':1.0})		// ring
		.defineAttribute ({'name':'segments-theta', dataType:'integer', 'defaultValue':8})		// ring
		.defineAttribute ({'name':'index', dataType:'integer', 'defaultValue':[], isArray:true, elementCount:3, }) // triangles
		.addTag();
// File: tags/style3d.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 * Dual licensed under the MIT and GPL
 */

/*
 * style3d is a single definition of a style attribute. Multiple style attributes can be
 * grouped together as children of a class3d tag. These still express a rule set.
 *
 * Each rule set defines a single selector (usable with jQuery) and a number of property/value
 * pairs where the property is the name of a XSeen attribute for some XSeen tag and the value
 * is a legal value for that attribute. 
 *
 * If no selector is defined, then the style will have no effect at runtime if the value in the
 * 'style3d' tag is changed.
 *
 * If the rule set has an id attribute (in the 'class3d' tag for the collection, or in the 'style3d'
 * tag for a single expression), then that style can be referenced by a node using the style3d attribute.
 * The styles are applied prior to any attributes specifically included in the node.
 *
 * If a 'style3d' tag is a child of a 'class3d' tag, then the selector is ignored.
 *
 * Runtime application of a style overrides any current value associated with the node.
 *
 * TODO: add support in 'class3d' for external files to define the style3d
 *
 */

 XSeen.Tags.Style3d = {};
 XSeen.Tags.Style3d._changeAttribute = function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				var ruleset, nodeAttributes, styleValue, styleProperty, changeSelector;

/*
 * TODO: This is not set up right. The local node (e) ruleset is not complete when
 * changing the style from DOM and the parent node's (e.parentNode) attributes do
 * not appear to be defined. The end result is the selector is properly applied,
 * but the attribute and value are empty.
 *
 * Another issue is all of the style attributes are applied, even if they are no
 * different from before. This is a problem if the target element has attributes
 * that are changed in a different manner than styles (e.g., animation). Reapplying
 * the entire set of styles would unexpected change those fields.
 */
				if (e._xseen.ruleset.complete) {
					ruleset = e._xseen.ruleset;
					nodeAttributes = e._xseen.attributes;
				} else {
					ruleset = e.parentNode._xseen.ruleset;
					nodeAttributes = e.parentNode._xseen.attributes;
				}

				if (attributeName == 'property') {
					if (nodeAttributes.property != '') {
						var oldProperty = nodeAttributes.property;
						for (var ii=0; ii<ruleset.declaration.length; ii++) {
							if (ruleset.declaration[ii].property == oldProperty) {
								ruleset.declaration[ii].property = value;
								styleValue = nodeAttributes.value;
								styleProperty = oldProperty;
							}
						}
					}
					changeSelector = false;

				} else if (attributeName == 'value') {
					if (nodeAttributes.property != '') {
						for (var ii=0; ii<ruleset.declaration.length; ii++) {
							if (ruleset.declaration[ii].property == nodeAttributes.property) {
								ruleset.declaration[ii].value = value;
								styleValue = value;
								styleProperty = nodeAttributes.property;
							}
						}
					}
					changeSelector = false;

				} else if (attributeName == 'selector') {
					ruleset.selector = value;
					nodeAttributes.selector = value;
					changeSelector = true;
				}
				e._xseen.attributes[attributeName] = value;

				var eles = document.querySelectorAll (ruleset.selector);
				eles.forEach (function(item) {
					for (var ii=0; ii<ruleset.declaration.length; ii++) {
						item.setAttribute(ruleset.declaration[ii].property, ruleset.declaration[ii].value);
					}
				});
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}

};

XSeen.Tags._style = 
	function (property, value, selector, id, ruleParent) {
		if (typeof(ruleParent) === 'undefined' || typeof(ruleParent._xseen.styleDefinition) === 'undefined') {
			this.id				= id || '';
			this.selector		= selector;
			this.complete		= true;
			this.declaration	= [];
			if (property != '') this.declaration.push({'property':property, 'value':value});
		} else {
			this.complete 		= false;
			ruleParent._xseen.ruleset.declaration.push({'property':property, 'value':value});
		}
		return this;
	};
	
	
XSeen.Tags.style3d = {
	'init'	: function (e, p) 
		{
			e._xseen.ruleset = new XSeen.Tags._style (e._xseen.attributes.property, e._xseen.attributes.value, e._xseen.attributes.selector, e.id, p);
			if (e._xseen.ruleset.complete) {
				e._xseen.sceneInfo.StyleRules.ruleset.push (e._xseen.ruleset);
				if (e.id != '') e._xseen.sceneInfo.StyleRules.idLookup[e.id] = e._xseen.ruleset;
			}
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
};
XSeen.Tags.class3d = {
	'init'	: function (e, p) 
		{
			e._xseen.styleDefinition = true;
			e._xseen.ruleset = new XSeen.Tags._style ('', '', e._xseen.attributes.selector, e.id);
		},
	'fin'	: function (e, p) 
		{
			e._xseen.sceneInfo.StyleRules.ruleset.push (e._xseen.ruleset);
			if (e.id != '') e._xseen.sceneInfo.StyleRules.idLookup[e.id] = e._xseen.ruleset;
			
/*
			if (e._xseen.attributes.dump) {
				var class3d, msg = '<table border="1"><tr><th>Class</th><th>ID</th><th>Property</th><th>Value</th></tr>\n', ii, jj;
				
				for (ii=0; ii<e._xseen.sceneInfo.classes.length; ii++) {
					var className = e._xseen.sceneInfo.classes[ii].class3d;
					for (var jj=0; jj<e._xseen.sceneInfo.classes[ii].style.length; jj++) {
						class3d = e._xseen.sceneInfo.classes[ii].style[jj];
						msg += "<tr><td>" + className + "</td><td>" + class3d.id + '</td><td>' + class3d.name + '</td><td>' + class3d.string + "</td></tr>\n";
					}
				}
				msg += '</table>';
				XSeen.LogDebug(msg);
			}
 */
		},
	'event'	: function (ev, attr) {},
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'style3d',
						'init'	: XSeen.Tags.style3d.init,
						'fin'	: XSeen.Tags.style3d.fin,
						'event'	: XSeen.Tags.style3d.event
						})
		.defineAttribute ({'name':'selector', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'property', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'value', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
//		.defineAttribute ({'name':'waitforload', dataType:'boolean', 'defaultValue':false, 'isAnimatable':false})
//		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'value', enumeration:['value','external'], isCaseInsensitive:true, 'isAnimatable':false})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.Style3d._changeAttribute}]})
		.addTag();
XSeen.Parser.defineTag ({
						'name'	: 'class3d',
						'init'	: XSeen.Tags.class3d.init,
						'fin'	: XSeen.Tags.class3d.fin,
						'event'	: XSeen.Tags.class3d.event
						})
		.defineAttribute ({'name':'selector', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'dump', dataType:'boolean', 'defaultValue':false, 'isAnimatable':false})
		.addTag();

		
// File: tags/subscene.js
/*
 * XSeen JavaScript library
 *
 * (c)2017, Daly Realism, Los Angeles
 *
 */

 // Control Node definitions
 
/*
 * xxTODO: Update xseen... XSeen...
 * TODO: Add standard position, rotation, and scale fields with XSeen.Tags.setSpace method
 * TODO: Improve handling of file formats that the loaders cannot do version distinction (gltf)
 * xxTODO: Save current URL so any changes can be compared to increase performance
 * TODO: Add handling of changing model URL - need to stop & delete animations
 * TODO: Investigate how to add 'setValue' and 'getValue' to work with [s|g]etAttribute
 */

XSeen.Tags.subscene = {
	'init'	: function (e, p) 
		{
			e._xseen.processedUrl = false;
			e._xseen.loadGroup = new THREE.Group();
			e._xseen.loadGroup.name = 'External Scene [' + e.id + ']';
			XSeen.Tags._setSpace (e._xseen.loadGroup, e._xseen.attributes);
			console.log ('Created Inline Group with UUID ' + e._xseen.loadGroup.uuid);
/*
			XSeen.Loader.load (e._xseen.attributes.src, '', XSeen.Tags.subscene.loadSuccess({'e':e, 'p':p}), XSeen.Tags.subscene.loadFailure, XSeen.Tags.subscene.loadProgress);
 */
			var loader = new THREE.ObjectLoader();
			loader.load (e._xseen.attributes.src, XSeen.Tags.subscene.loadSuccess({'e':e, 'p':p}), XSeen.Tags.subscene.loadProgress, XSeen.Tags.subscene.loadFailure);
			e._xseen.requestedUrl = true;
			e._xseen.tagObject = e._xseen.loadGroup;
			p._xseen.children.push(e._xseen.loadGroup);
			console.log ('Using Inline Group with UUID ' + e._xseen.loadGroup.uuid);
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	
					// Method for adding userdata from https://stackoverflow.com/questions/11997234/three-js-jsonloader-callback
	'loadProgress' : function (a1) {
		console.log ('Progress ('+a1.type+'): ' + a1.timeStamp);
	},
	'loadFailure' : function (a1) {
		console.log ('Failure ('+a1.type+'): ' + a1.timeStamp);
	},
	'loadSuccess' : function (userdata) {
						var e = userdata.e;
						var p  = userdata.p;
						return function (response) {
							e._xseen.processedUrl = true;
							e._xseen.requestedUrl = false;
							e._xseen.loadText = response;
							e._xseen.currentUrl = e._xseen.attributes.src;
							
							console.log ('Success');
							console.log("download successful for |"+e.id);
							//e._xseen.loadGroup.add(response.scene);		// This works for glTF
							e._xseen.loadGroup.add(response);		// What docs say for ObjectLoader
							p._xseen.sceneInfo.SCENE.updateMatrixWorld();

						}
					}
};

// Add tag and attributes to Parsing table
XSeen.Parser.defineTag ({
						'name'	: 'subscene',
						'init'	: XSeen.Tags.subscene.init,
						'fin'	: XSeen.Tags.subscene.fin,
						'event'	: XSeen.Tags.subscene.event,
						'tick'	: XSeen.Tags.subscene.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':''})
		.addTag();