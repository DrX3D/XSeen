/*
 *  XSeen V0.6.4-alpha.1+5_190759c
 *  Built Tue Mar 13 16:43:06 2018
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
 */

var XSeen = XSeen || {};
XSeen.Events = {
				
};
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

XSeen.Loader = {
						// define internal variables
	'urlQueue'			: [],
	'urlNext'			: -1,
	'MaxRequests'		: 3,
	'totalRequests'		: 0,
	'totalResponses'	: 0,
	'requestCount'		: 0,
	'lmThat'			: this,
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

//var lmThat = this;

/*
 *	Sets up for loading an external resource. 
 *	The resource is loaded from a FIFO queue
 *	Loading happens asynchronously. The Loader parameter
 *	MaxRequests determines the maximum number of simoultaneous requests
 *
 *	Parameters:
 *		url			The URL of the resource
 *		hint		A hint to the loader to help it determine which specific loader to use. Most of the
 *					time the file extension is sufficient to determine the specific loader; however, some
 *					file extensions may be used for incompatible file formats (e.x., glTF V1.0, V1.1, and V2.0).
 *					The hint should contain the version number without 'V'.
 *		success		The callback function to call on successful load
 *		failure		The callback function to call on when the loading fails
 *		progress	The callback function to call while the loading is occurring
 *		userdata	A object to be included with all of the callbacks.
 */
	'load'		: function (url='', hint='', success, failure, progress, userdata)
		{
			var uri = XSeen.parseUrl (url);
			var type = (typeof(this.ContentType[uri.extension]) === 'undefined') ? this.ContentType['txt'] : this.ContentType[uri.extension];
			var MimeLoader = this.ContentLoaders[type];
			if (MimeLoader.needHint === true && hint == '') {
				console.log ('Hint require to load content type ' + type);
				return false;
			}
			
			if (MimeLoader.needHint) {
				if (type == 'gltf') {
					if (hint == '') {hint = 'Current';}
					type += hint;
					MimeLoader = this.ContentLoaders[type];
				}		// Other types go here
			}

			if (typeof(MimeLoader.loader) === 'undefined') {
				this.internalLoader (url, success, failure, progress, userdata, type);
			} else {
				MimeLoader.loader.load (url, success, progress, failure);
			}
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
	XSeen.Loader.ContentLoaders = {
							'image'		: {'loader': null, needHint: false, },
							'text'		: {'loader': null, needHint: false, },
							'html'		: {'loader': null, needHint: false, },
							'xml'		: {'loader': null, needHint: false, },
							'json'		: {'loader': null, needHint: false, },
							'gltf'		: {'loader': null, needHint: 2, },
							'collada'	: {'loader': new THREE.ColladaLoader(), needHint: false, },
							'obj'		: {'loader': new THREE.OBJLoader2(), needHint: false, },
							'x3d'		: {'loader': new THREE.ColladaLoader(), needHint: false, },
							'gltfCurrent'	: {'loader': new THREE.GLTFLoader(), needHint: false, }, 
							'gltfLegacy'	: {'loader': new THREE.LegacyGLTFLoader(), needHint: false, }, 
						};
	console.log ('Created ContentLoaders object');
};
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
	'levels'	: ['Info', 'Debug', 'Warn', 'Error'],
	'Data'		: {
					'Levels' : {
						'Info'	: {'class':'xseen-log xseen-logInfo', 'level':7, label:'INFO'},
						'Debug'	: {'class':'xseen-log xseen-logInfo', 'level':5, label:'DEBUG'},
						'Warn'	: {'class':'xseen-log xseen-logInfo', 'level':3, label:'WARN'},
						'Error'	: {'class':'xseen-log xseen-logInfo', 'level':1, label:'ERROR'},
					},
					'maximumLevel'		: 9,
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
		this.Data.init = true;
		if (!show) {this.LogOff()}
		return this;
	},
	
	'LogOn'		: function () {this.active = true;},
	'LogOff'	: function () {this.active = false;},

	'logLog'	: function (message, level) {
		if (this.Data.active && this.Data.Levels[level].level <= this.Data.maximumLevel) {
			if (this.Data.lineCount >= this.Data.maxLinesLogged) {
				message = "Maximum number of log lines (=" + this.Data.maxLinesLogged + ") reached. Deactivating logging...";
				this.Data.active = false;
				level = 'Error'
			}
			// if level not in this.levels, then set to this.Data.defaultLevel
			var node = document.createElement("p");
			node.setAttribute("class", this.Data.Levels[level].class);
			node.innerHTML = this.Data.Levels[level].label + ": " + message;
			this.Data.logContainer.insertBefore(node, this.Data.logContainer.firstChild);
		}
	},

	'logInfo'	: function (string) {this.logLog (string, 'Info');},
	'logDebug'	: function (string) {this.logLog (string, 'Debug');},
	'logWarn'	: function (string) {
		this.logLog (string, 'Warn');
		console.log ('Warning: ' + string);
	},
	'logError'	: function (string) {
		this.logLog (string, 'Error');
		console.log ('*** Error: ' + string);
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
	console.log ("'onLoad' method");
	
	var sceneOccurrences, ii;
	if (typeof(XSeen._Scenes) === 'undefined') {XSeen._Scenes = [];}

	sceneOccurrences = document.getElementsByTagName (XSeen.Constants.tagPrefix + XSeen.Constants.rootTag);
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
										},
								'showstat'	: {
									'name'		: 'showstat',
									'default'	: 'false',
									'type'		: 'boolean',
										},
								'showprogress'	: {
									'name'		: 'showprogress',
									'default'	: 'false',
									'type'		: 'boolean',
										},
								'cubetest'	: {
									'name'		: 'cubetest',
									'default'	: 'false',
									'type'		: 'boolean',
										},
								};
								
	Object.getOwnPropertyNames(attributeCharacteristics).forEach (function (prop) {
		value = XSeen.Runtime.RootTag.getAttribute(attributeCharacteristics[prop].name);
		if (value == '' || value === null || typeof(value) === 'undefined') {value = attributeCharacteristics[prop].default;}
		if (value != '') {
			XSeen.Runtime.Attributes[attributeCharacteristics[prop].name] = XSeen.Convert.fromString (value.toLowerCase(), attributeCharacteristics[prop].type);
		}
	});

	
	// Setup/define various characteristics for the runtime or display
	XSeen.Logging = XSeen.definitions.Logging.init (XSeen.Runtime.Attributes['showlog'], XSeen.Runtime.RootTag);
	XSeen.Runtime.Size = XSeen.updateDisplaySize (XSeen.Runtime.RootTag);	// TODO: test
	XSeen.Runtime.Renderer.setSize (XSeen.Runtime.Size.width, XSeen.Runtime.Size.height);
	XSeen.Runtime.Renderer.setPixelRatio( window.devicePixelRatio );

	XSeen.Runtime.Camera = new THREE.PerspectiveCamera( 75, XSeen.Runtime.Size.aspect, 0.1, 10000 );
	XSeen.Runtime.SceneDom = XSeen.Runtime.Renderer.domElement;
	XSeen.Runtime.RootTag.appendChild (XSeen.Runtime.SceneDom);
	if (typeof(XSeen.Runtime.RootTag._xseen) === 'undefined') {
		XSeen.Runtime.RootTag._xseen = {};
		XSeen.Runtime.RootTag._xseen.sceneInfo = XSeen.Runtime;
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
	// Stereo camera effect -- from http://charliegerard.github.io/blog/Virtual-Reality-ThreeJs/
	var x_effect = new THREE.StereoEffect(Renderer);
	Renderer.controls = {'update' : function() {return;}};
	
	// Mobile (device orientation) controls
	Renderer.controls = new THREE.DeviceOrientationControls(camera);
	
	// Not sure how to handle when both are requested since they both seem to go into
	//	the same address. Perhaps order is important since the stereographic control is null
 */
	XSeen.Runtime.hasDeviceOrientation = (window.orientation) ? true : false;
	XSeen.Runtime.hasVrImmersive = XSeen.Runtime.hasDeviceOrientation;

	
	// Define a few equivalences

	XSeen.LogInfo	= function (string) {XSeen.Logging.logInfo (string);}
	XSeen.LogDebug	= function (string) {XSeen.Logging.logDebug (string);}
	XSeen.LogWarn	= function (string) {XSeen.Logging.logWarn (string);}
	XSeen.LogError	= function (string) {XSeen.Logging.logError (string);}

 
// Introduce things
	XSeen.Logging.logInfo ("XSeen version " + XSeen.Version.version + ", " + "Date " + XSeen.Version.date);
	XSeen.LogInfo(XSeen.Version.splashText);
	//XSeen.LogDebug ("Debug line");
	//XSeen.LogWarn ("Warn line");
	//XSeen.LogError ("Error line");
	
// Load all other onLoad methods
	for (var ii=0; ii<XSeen.onLoadCallBack.length; ii++) {
		XSeen.onLoadCallBack[ii]();
	}

// Parse the HTML tree starting at scenesToParse[0]. The method returns when there is no more to parse
	//XSeen.Parser.dumpTable();
	XSeen.Parser.Parse (XSeen.Runtime.RootTag, XSeen.Runtime.RootTag);
	
// TODO: Start rendering loop

	return;
};


// Determine the size of the XSeen display area

XSeen.updateDisplaySize = function (sceneRoot) {
	var MinimumValue = 50;
	var size = Array();
	size.width = sceneRoot.offsetWidth;
	size.height = sceneRoot.offsetHeight;
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
	return size;
}
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
	'Table'		: {},
	'_prefix'	: 'x-',
	'AttributeObserver'	: new MutationObserver(function(list) {
							for (var mutation of list) {
								var value = XSeen.Parser.reparseAttr (mutation.target, mutation.attributeName);
								var localName = mutation.target.localName;
								var handler = XSeen.Parser.Table[localName].eventHandlers.mutation.handler;
								handler (mutation.target, mutation.attributeName, value);
							}
						}),

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
										'isAnimatable'		: false,
										'enumeration'		: []
									};
						}
						var name = attrObj.name.toLowerCase();
						var t = typeof(attrObj.isCaseInsensitive);
						attrObj.enumeration = (typeof(attrObj.enumeration) == 'object') ? attrObj.enumeration : [];
						attrObj.isCaseInsensitive = (typeof(attrObj.isCaseInsensitive) !== 'undefined') ? attrObj.isCaseInsensitive : false;
						if (attrObj.dataType != 'string') {attrObj.isCaseInsensitive = true;}
						this.attributes.push ({
								'attribute'			: name,
								'type'				: attrObj.dataType,
								'default'			: attrObj.defaultValue,
								'enumeration'		: attrObj.enumeration,
								'isCaseInsensitive'	: attrObj.isCaseInsensitive,
								'isAnimatable'		: (typeof(attrObj.isAnimatable) !== null) ? attrObj.isAnimatable : false,
								'isEnumerated'		: (attrObj.enumeration.length == 0) ? false : true,
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
 * This is called recursively starting with the first <x-scene> tag
 */
	'Parse'	: function (element, parent)
		{
			var tagName = element.localName.toLowerCase();		// Convenience declaration
			/*
			 *	If tag name is unknown, then print message; otherwise,
			 *	Create all XSeen additions un element._xseen
			 *	Parse provided attributes
			 *	Redefine DOM methods for accessing attributes
			 */
			var tagEntry;
			if (typeof(XSeen.Parser.Table[tagName]) == 'undefined') {
				XSeen.LogDebug("Unknown node: " + tagName + '. Skipping all children.');
				return;
			} else {
				tagEntry = XSeen.Parser.Table[tagName];
				if (typeof(element._xseen) == 'undefined') {element._xseen = {};}
				if (typeof(element._xseen.children) == 'undefined') {element._xseen.children = [];}
				this.parseAttrs (element, tagEntry);
				//console.log ('Calling node: ' + tagName + '. Method: ' + tagEntry.init + ' (e,p)');
				console.log('Calling node: ' + tagName + '. Method: init');
				XSeen.LogInfo('Calling node: ' + tagName + '. Method: init');
				tagEntry.init (element, parent);
			}

			// Parse all of the children in order
			for (element._xseen.parsingCount=0; element._xseen.parsingCount<element.childElementCount; element._xseen.parsingCount++) {
				element.children[element._xseen.parsingCount]._xseen = {};
				element.children[element._xseen.parsingCount]._xseen.children = [];
				element.children[element._xseen.parsingCount]._xseen.sceneInfo = element._xseen.sceneInfo;
				this.Parse (element.children[element._xseen.parsingCount], element);
			}

			if (typeof(tagEntry) !== 'undefined') {
				element.addEventListener ('XSeen', tagEntry.events);
				//XSeen.LogInfo('Calling node: ' + tagName + '. Method: fin');
				tagEntry.fin (element, parent);
				//XSeen.LogInfo('Return from node: ' + tagName + '. Method: fin');
				if (typeof(tagEntry.eventHandlers.mutation) !== 'undefined') {
					XSeen.Parser.AttributeObserver.observe (element, tagEntry.eventHandlers.mutation.options);
				}
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
			element._xseen.attributes = [];	// attributes for this tag
			element._xseen.animate = [];	// animatable attributes for this tag
			element._xseen.animation = [];	// array of animations on this tag
			element._xseen.properties = [];	// array of properties (active attribute values) on this tag
			element._xseen.parseAll = false;
			var classt = element.getAttribute('class3d');					// Get list of class3d (really IDs)
			var classes3d = (classt === null) ? [] : classt.split(' ');		// and split it (if defined)
			element._xseen.class3d = [];
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
			value = XSeen.Parser.Types[attr.type] (value, attr.default, attr.caseInsensitive, attr.enumeration);
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
		attrInfo.tag = tag;
		attrInfo.attribute = attribute;
		attrInfo.handlerName = tag.event;
		attrInfo.dataType = attribute.type;
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
/*
				if (value) {return true;}
				if (!value) {return false;}
				return def;
 */
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
 *	<integer>; Integer [0-16777215]. Key interger within range.
 *	#HHHHHH	24-bit hex value indicating color. Key '#'
 *	rgba(r,g,b,a); where r,g,b are either byte-integers [0,255] or percent [0%-100%]; and a is [0.0-0.1] Key 'rgba' and '%'
 *	rgb(r,g,b); where r,g,b are either byte-integers [0,255] or percent [0%-100%]. Key 'rgb' and '%'
 *	hsla(h,s,l,a); where h is [0-360], s&l are [0-100%]. Key 'hsla'
 *	hsl(h,s,l); where h is [0-360], s&l are [0-100%]. Key 'hsl'
 *	<color-name>; One of the 140 predefined HTML color names. This is enumerable (but not yet)
 *	<default used>
 */
		'color'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {return def;}
				value = value.trim().toLowerCase();
				if (!Number.isNaN(value) && Math.round(value) == value && (value-0 <= 16777215) && (value-0 >= 0)) {return value;}

				if (value.substring(0,1) == '#') {
					value = '0x' + value.substring(1,value.length) - 0;
					if (Number.isNaN(value) || value < 0 || value > 16777215) {return def;}
					return value;
				}
				
				if (value.substring(0,3) == 'rgb') {
					XSeen.LogWarn("RGB[A] color not yet implemented");
				}
				if (value.substring(0,3) == 'hsl') {
					XSeen.LogWarn("HSL[A] color not yet implemented");
				}
				
				if (typeof(XSeen.CONST.Colors[value]) === 'undefined') {return def;}
				return XSeen.CONST.Colors[value];	// TODO: add check on enumeration
				//return def;
			},

/*
 * Rotation parsing order
 *	e(rx, ry, rz): Euler rotation about (in local order) X, Y, and Z axis
 *	q(x, y, z, w): Quaternion with 4 components
 *	h(x, y, z, t): Homogeneous rotation of 't' about the vector [x, y, z]
 *	The default is e(). The 'e' and parantheses are optional.
 *	The return value is always a quaternion
 *
 *	Only the Euler rotation without 'e(' and ')' is implemented. The default should be of the this type.
 */
		'rotation'	: function(value, def, insensitive, enumeration)
			{
				if (value === null) {value = def;}
				var eulerAngles = this.vec3 (value, def, true, []);
				var euler = new THREE.Euler();
				euler.fromArray (eulerAngles);
				var quat = new THREE.Quaternion();
				quat.setFromEuler (euler);
				
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
 *	0.6.2: Fixed Camera and navigation bug
 *	0.6.3: Added Plane and Ring
 *	0.6.4: Fixed size determination bug
 * 
 */

var Renderer = new THREE.WebGLRenderer();

XSeen = (typeof(XSeen) === 'undefined') ? {} : XSeen;
XSeen.Constants = {
					'_Major'		: 0,
					'_Minor'		: 6,
					'_Patch'		: 4,
					'_PreRelease'	: 'alpha.1',
					'_Release'		: 5,
					'_Version'		: '',
					'_RDate'		: '2017-03-10',
					'_SplashText'	: ["XSeen 3D Language parser.", "XSeen <a href='http://xseen.org/index.php/documentation/' target='_blank'>Documentation</a>."],
					'tagPrefix'		: 'x-',
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
var StereoRenderer = new THREE.StereoEffect(Renderer);
XSeen.Runtime = {
			'currentTime'			: 0,			// Current time at start of frame rendering
			'deltaTime'				: 0,			// Time since last frame
			'frameNumber'			: 0,			// Number of frame about to be rendered
			'Time'					: new THREE.Clock(),
			'Renderer'				: Renderer,
			'RendererStandard'		: Renderer,
			'RendererStereo'		: StereoRenderer,
			'Camera'				: {},
			'CameraControl'			: {},			// Camera control to be used in Renderer for various types
			'Mixers'				: [],			// Internal animation mixer array
			'Animate'				: function() {	// XSeen animation loop control
										//console.log ('Rendering loop, isStereographic: ' + XSeen.Runtime.isStereographic);
										if (XSeen.Runtime.isStereographic) {
											requestAnimationFrame (XSeen.Runtime.Animate);
											XSeen.RenderFrame();
										} else {
											XSeen.Runtime.Renderer.animate (XSeen.RenderFrame);
										}
									},
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
			'isVrCapable'			: false,		// WebVR ready to run && access to VR device 
			'hasDeviceOrientation'	: false,		// device has Orientation sensor
			'hasVrImmersive'		: false,		// hasDeviceOrientation && stereographic capable (=== TRUE)
			'isStereographic'		: false,		// currently running stereographic display (not VR)
			'rendererHasControls'	: false,		// Renderer has built-in motion controls
			'isProcessingResize'	: false,		// semaphore for resizing processing
			};										// Need place-holder for xR scene (if any -- tbd)
			
XSeen.RenderFrame = function()
	{
		if (XSeen.Runtime.isProcessingResize) {return;}		// Only do one thing at a time

		XSeen.Runtime.deltaTime = XSeen.Runtime.Time.getDelta();
		XSeen.Runtime.currentTime = XSeen.Runtime.Time.getElapsedTime();
		XSeen.Runtime.frameNumber ++;
		
		// TODO: Create RenderFrame event 
		
/*
 *	Do various subsystem updates. Order is potentially important. 
 *	First position/orient camera & frame size so any calculations done on that use the new position
 *	Mixes handle internal (within model) animations
 *	Tween handles user-requested (in code) animations
 */
		XSeen.Update.Camera (XSeen.Runtime);
		XSeen.Update.Mixers (XSeen.Runtime);
		//XSeen.Update.Tween (XSeen.Runtime);

		XSeen.Runtime.Renderer.render( XSeen.Runtime.SCENE, XSeen.Runtime.Camera );
	};
	
XSeen.Update = {
	'Tween'		: function (Runtime)
		{
			TWEEN.update();
			for (var ii=0; ii<scene.TweenGroups.length; ii++) {
				scene.TweenGroups[ii].update();
			}
		},
	'Mixers'	: function (Runtime)
		{
			if (typeof(Runtime.Mixers) === 'undefined') return;
			for (var i=0; i<Runtime.Mixers.length; i++) {
				Runtime.Mixers[i].update(Runtime.deltaTime);
			}
		},
	'Ticks'		: function (Runtime)		// Not certain if this should be here. It may be superceded by the render frame event
		{
/*
			var deltaT = scene.clock.getDelta();
			for (var i=0; i<scene.ticks.length; i++) {
				scene.ticks[i].method (0, deltaT, scene.ticks[i]);
			}
 */
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

XSeen.Tags.background = {
	'_changeAttribute'	: function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				if (attributeName == 'skycolor') {				// Different operation for each attribute
					e._xseen.sceneInfo.SCENE.background = new THREE.Color(value);

				} else if (attributeName.substr(0,3) == 'src') {
					XSeen.Tags.background._loadBackground (e._xseen.attributes, e);
					
				} else {
					XSeen.LogWarn('No support for updating ' + attributeName);
				}
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}
		},

	'init'	: function (e, p) 
		{
			e._xseen.sceneInfo.SCENE.background = new THREE.Color(e._xseen.attributes.skycolor);
			XSeen.Tags.background._loadBackground (e._xseen.attributes, e);
		},
			
	'_loadBackground'	: function (attributes, e)
		{
			// Parse src as a default to srcXXX.
			var urls = [];
			var sides = ['right', 'left', 'top', 'bottom', 'front', 'back'];
			var src = attributes.src.split('*');
			var tail = src[src.length-1];
			var srcFile = src[0];
			for (var ii=0;  ii<sides.length; ii++) {
				urls[sides[ii]] = srcFile + sides[ii] + tail;
				urls[sides[ii]] = (attributes['src'+sides[ii]] != '') ? attributes['src'+sides[ii]] : urls[sides[ii]];
			}

			var textureCube = new THREE.CubeTextureLoader()
									.setPath ('./')
									.load ([urls['right'],
											urls['left'],
											urls['top'],
											urls['bottom'],
											urls['front'],
											urls['back']],
											XSeen.Tags.background.loadSuccess({'e':e}),
											XSeen.Tags.background.loadProgress,
											XSeen.Tags.background.loadFailure
										);
		},
	'fin'	: function (e, p) {},
	'event'	: function (ev, attr) {},
	'tick'	: function (systemTime, deltaTime) {},
	'loadSuccess' : function (userdata)
		{
			var thisEle = userdata.e;
			return function (textureCube)
			{
				thisEle._xseen.processedUrl = true;
				thisEle._xseen.loadTexture = textureCube;
				thisEle._xseen.sceneInfo.SCENE.background = textureCube;
				console.log ('Successful load of background textures.');
			}
		},
	'loadProgress' : function (a)
		{
			console.log ('Loading background textures...');
		},
	'loadFailure' : function (a)
		{
			//a._xseen.processedUrl = false;
			console.log ('Load failure');
			console.log ('Failure to load background textures.');
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
		.defineAttribute ({'name':'skycolor', dataType:'color', 'defaultValue':'black'})
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcfront', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcback', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcleft', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcright', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srctop', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'srcbottom', dataType:'string', 'defaultValue':'', 'isAnimatable':false})
		.defineAttribute ({'name':'backgroundiscube', dataType:'boolean', 'defaultValue':true})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.background._changeAttribute}]})
		.addTag();
// File: tags/camera.js
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

XSeen.Tags.camera = {
	'init'	: function (e, p) 
		{
			e._xseen.properties = {};
			e._xseen.domNode = e;	// Back-link to node if needed later on
			e._xseen.type = e._xseen.attributes.type;
			e._xseen.track = e._xseen.attributes.track;
			if (e._xseen.track == 'examine') e._xseen.track = 'trackball';
			//if (e._xseen.track == 'device' && !e._xseen.sceneInfo.hasDeviceOrientation) e._xseen.track = 'orbit';
			e._xseen.sceneInfo.Camera.position.set (
							e._xseen.attributes.position.x,
							e._xseen.attributes.position.y,
							e._xseen.attributes.position.z);
			if (e._xseen.type == 'perspective') {			// Already exists

			} else if (e._xseen.type == 'stereo') {			// TODO: need to implement
				e._xseen.sceneInfo.Renderer = e._xseen.sceneInfo.RendererStereo;
				e._xseen.sceneInfo.rendererHasControls = false;
				e._xseen.sceneInfo.isStereographic = true;

			} else if (e._xseen.type == 'orthographic') {	// TODO: need to implement -- change camera type

			} else if (e._xseen.type == 'vr') {
				if (e._xseen.sceneInfo.isVrCapable) {
					e._xseen.sceneInfo.Renderer.vr.enabled = true;
					e._xseen.sceneInfo.rendererHasControls = true;
					document.body.appendChild( WEBVR.createButton( e._xseen.sceneInfo.Renderer ) );
				} else {									// TODO: create split screen and navigation mode
					XSeen.LogWarn ('VR display requested, but not capable. Rolling over to stereographic');
					e._xseen.sceneInfo.Renderer = e._xseen.sceneInfo.RendererStereo;
					e._xseen.sceneInfo.isStereographic = true;
					e._xseen.sceneInfo.rendererHasControls = false;
					//e._xseen.sceneInfo.Renderer.controls = new THREE.DeviceOrientationControls(e._xseen.sceneInfo.Camera);
					//e._xseen.sceneInfo.Renderer.controls = new THREE.OrbitControls( e._xseen.sceneInfo.Camera, e._xseen.sceneInfo.Renderer.domElement );
					//controls.addEventListener( 'change', render ); // remove when using animation loop
					// enable animation loop when using damping or autorotation
					//controls.enableDamping = true;
					//controls.dampingFactor = 0.25;
					//controls.enableZoom = false;
					//e._xseen.sceneInfo.Renderer.controls.enableZoom = true;
				}
			}
			console.log("Setting up controls...");
			console.log (" - Renderer has controls: |"+e._xseen.sceneInfo.rendererHasControls+"|");
			console.log (" - Device has orientation: |"+e._xseen.sceneInfo.hasDeviceOrientation+"|");
			console.log (" - Track: |"+e._xseen.track+"|");
			XSeen.LogInfo("Renderer has controls: |"+e._xseen.sceneInfo.rendererHasControls+"|; Device has orientation: |"+e._xseen.sceneInfo.hasDeviceOrientation+"|");
			if (!e._xseen.sceneInfo.rendererHasControls) {
				if (e._xseen.sceneInfo.hasDeviceOrientation && e._xseen.track == 'device') {
					// TODO: check for proper enabling of DeviceControls
					console.log ('Adding DeviceOrientationControls');
					e._xseen.sceneInfo.CameraControl = new THREE.DeviceOrientationControls(e._xseen.sceneInfo.Camera);
				} else if (e._xseen.track == 'orbit' || (e._xseen.track == 'device' && !e._xseen.sceneInfo.hasDeviceOrientation)) {
					console.log ('Adding OrbitControls');
					e._xseen.sceneInfo.CameraControl = new THREE.OrbitControls( e._xseen.sceneInfo.Camera, e._xseen.sceneInfo.RendererStandard.domElement );
				} else if (e._xseen.track == 'trackball') {
					console.log ('Trackball');
				} else if (e._xseen.track == 'none') {
					console.log ('No tracking');
					e._xseen.sceneInfo.rendererHasControls = true;
				} else {
					console.log ('Something else');
				}
			} else {
				console.log ('Renderer has controls...');
			}

/* For handling events
			e._xseen.handlers = {};
			e._xseen.handlers.setactive = this.setactive;
 */
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
						'name'	: 'camera',
						'init'	: XSeen.Tags.camera.init,
						'fin'	: XSeen.Tags.camera.fin,
						'event'	: XSeen.Tags.camera.event,
						'tick'	: XSeen.Tags.camera.tick
						})
		.addSceneSpace()
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'perspective', enumeration:['perspective','stereo','orthographic','vr'], isCaseInsensitive:true})
		.defineAttribute ({'name':'track', dataType:'string', 'defaultValue':'none', enumeration:['none', 'orbit', 'fly', 'examine', 'trackball', 'device'], isCaseInsensitive:true})
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
			group.position.x	= e._xseen.attributes.translation[0];
			group.position.y	= e._xseen.attributes.translation[1];
			group.position.z	= e._xseen.attributes.translation[2];
			group.scale.x		= e._xseen.attributes.scale[0];
			group.scale.y		= e._xseen.attributes.scale[1];
			group.scale.z		= e._xseen.attributes.scale[2];
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
				
			e._xseen.animate['translation'] = group.position;
			e._xseen.animate['rotation'] = group.quaternion;
			e._xseen.animate['scale'] = group.scale;
			e._xseen.animate['rotatex'] = 'rotateX';
			e._xseen.animate['rotatey'] = 'rotateY';
			e._xseen.animate['rotatez'] = 'rotateZ';
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
			console.log (value);
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
		.defineAttribute ({'name':'translation', dataType:'vec3', 'defaultValue':[0,0,0], 'isAnimatable':true})
		.defineAttribute ({'name':'scale', dataType:'vec3', 'defaultValue':[1,1,1], 'isAnimatable':true})
		.defineAttribute ({'name':'rotation', dataType:'rotation', 'defaultValue':'0 0 0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatex', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatey', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
		.defineAttribute ({'name':'rotatez', dataType:'float', 'defaultValue':'0.0', 'isAnimatable':true})
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
	'init'	: function (e,p) 
		{
			var color = e._xseen.attributes.color;
			var intensity = e._xseen.attributes.intensity - 0;
			var lamp, type=e._xseen.attributes.type;

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
 * TODO: Add standard position, rotation, and scale fields with XSeen.Tags.setSpace method
 * TODO: Improve handling of file formats that the loaders cannot do version distinction (gltf)
 * xxTODO: Save current URL so any changes can be compared to increase performance
 * TODO: Add handling of changing model URL - need to stop & delete animations
 * TODO: Investigate how to add 'setValue' and 'getValue' to work with [s|g]etAttribute
 */

XSeen.Tags.model = {
	'init'	: function (e, p) 
		{
			e._xseen.processedUrl = false;
			e._xseen.loadGroup = new THREE.Group();
			e._xseen.loadGroup.name = 'External Model [' + e.id + ']';
			XSeen.Tags._setSpace (e._xseen.loadGroup, e._xseen.attributes);
			console.log ('Created Inline Group with UUID ' + e._xseen.loadGroup.uuid);
			XSeen.Loader.load (e._xseen.attributes.src, e._xseen.attributes.hint, XSeen.Tags.model.loadSuccess({'e':e, 'p':p}), XSeen.Tags.model.loadFailure, XSeen.Tags.model.loadProgress);
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
							e._xseen.loadGroup.add(response.scene);		// This works for glTF
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
										//console.log('  starting animation for '+clip.name);
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
					}
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
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'hint', dataType:'string', 'defaultValue':''})	// loader hint - typically version #
		.defineAttribute ({'name':'playonload', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'duration', dataType:'float', 'defaultValue':-1, 'isAnimatable':false})
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
			// Render all Children
			e._xseen.children.forEach (function (child, ndx, wholeThing)
				{
					console.log('Adding child of type ' + child.type + ' (' + child.name + ') to THREE scene');
					e._xseen.sceneInfo.SCENE.add(child);
					//console.log('Check for successful add');
				});
			//XSeen.Parser.dumpTable ();
//			XSeen.LogDebug("Rendered all elements -- Starting animation");

/*
 *	Add an event listener to this node for resize events
 */
			window.addEventListener ('resize', XSeen.Runtime.Resize, false);
/*
 * TODO: Need to get current top-of-stack for all stack-bound nodes and set them as active.
 *	This only happens the initial time for each XSeen tag in the main HTML file
 *
 *	At this time, only Viewpoint is stack-bound. Probably need to stack just the <Viewpoint>._xseen object.
 *	Also, .fields.position is the initial specified location; not the navigated/animated one
 */

//			XSeen.LogInfo("Ready to kick off rendering loop");
//			XSeen.renderFrame();
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
XSeen.Tags._solid = function (e, p, geometry) {
			e._xseen.texture = null;
			if (e._xseen.attributes['map'] !== '') {
//				e._xseen.texture = XSeen.Loader.load(e._xseen.attributes['map']);
				e._xseen.texture = new THREE.TextureLoader().load (e._xseen.attributes['map']);
				e._xseen.texture.wrapS = THREE.ClampToEdgeWrapping;
				e._xseen.texture.wrapT = THREE.ClampToEdgeWrapping;
			}
			e._xseen.attributes['side_THREE'] = THREE.FrontSide;
			if (e._xseen.attributes['side'] == 'back') e._xseen.attributes['side_THREE'] = THREE.BackSide;
			if (e._xseen.attributes['side'] == 'both') e._xseen.attributes['side_THREE'] = THREE.DoubleSide;

			var parameters = {
							'aoMap'					: e._xseen.attributes['ambient-occlusion-map'],
							'aoMapIntensity'		: e._xseen.attributes['ambient-occlusion-map-intensity'],
							'color'					: e._xseen.attributes['color'],
							'displacementMap'		: e._xseen.attributes['displacement-map'],
							'displacementScale'		: e._xseen.attributes['displacement-scale'],
							'displacementBias'		: e._xseen.attributes['displacement-bias'],
							'emissive'				: e._xseen.attributes['emissive'],
							'envMap'				: e._xseen.attributes['env-map'],
							'map'					: e._xseen.texture,
							'normalMap'				: e._xseen.attributes['normal-map'],
							'normalScale'			: e._xseen.attributes['normal-scale'],
							'side'					: e._xseen.attributes['side_THREE'],
							'wireframe'				: e._xseen.attributes['wireframe'],
							'wireframeLinewidth'	: e._xseen.attributes['wireframe-linewidth'],
							};
			var appearance = new THREE.MeshPhongMaterial(parameters);
			//geometry.needsUpdate = true;
	
			var mesh = new THREE.Mesh (geometry, appearance);
			mesh.userData = e;
			XSeen.Tags._setSpace(mesh, e._xseen.attributes);
/*
			mesh.position.set (
							e._xseen.attributes.position[0],
							e._xseen.attributes.position[1],
							e._xseen.attributes.position[2]);
 */
			p._xseen.sceneInfo.selectable.push(mesh);
			mesh.name = 'Solid: ' + e.id;

/*
			var group = new THREE.Group();			// TODO: Using Group to contain mesh. Perhaps not necessary?
			group.name = 'Solid: ' + e.id;
			group.add (mesh);
			e._xseen.tagObject = group;
			p._xseen.children.push(group);
 */
			e._xseen.tagObject = mesh;
			p._xseen.children.push(mesh);

};
XSeen.Tags.Solids._changeAttribute = function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				if (attributeName == 'color') {				// Different operation for each attribute
//					e._xseen.tagObject.children[0].material.color.setHex(value);	// Solids are stored in a 'group' of the tagObject
//					e._xseen.tagObject.children[0].material.needsUpdate = true;
					e._xseen.tagObject.material.color.setHex(value);	// Solids are stored in a 'group' of the tagObject
					e._xseen.tagObject.material.needsUpdate = true;
				} else {
					XSeen.LogWarn('No support for updating ' + attributeName);
				}
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}

};

XSeen.Tags.box = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.BoxGeometry(
										e._xseen.attributes.width, 
										e._xseen.attributes.height, 
										e._xseen.attributes.depth,
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['segments-depth']
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.cone = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.ConeGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['open-ended'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.cylinder = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.CylinderGeometry(
										e._xseen.attributes['radius-top'], 
										e._xseen.attributes['radius-bottom'], 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['open-ended'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.dodecahedron = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.DodecahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.icosahedron = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.IcosahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.octahedron = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.OctahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.sphere = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.SphereGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
										e._xseen.attributes['phi-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['phi-length'] * XSeen.CONST.Deg2Rad,
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};
	
XSeen.Tags.tetrahedron = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.TetrahedronGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.detail
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.torus = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.TorusGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.tube, 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['segments-tubular'], 
										e._xseen.attributes.arc * XSeen.CONST.Deg2Rad
									);
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
/*
			var depth = Math.min (e._xseen.attributes.width, e._xseen.attributes.height) * .01
			var geometry = new THREE.BoxGeometry(
										e._xseen.attributes.width, 
										e._xseen.attributes.height, 
										depth,
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
										1
									);
 */

			var geometry = new THREE.PlaneGeometry(
										e._xseen.attributes.width, 
										e._xseen.attributes.height, 
										e._xseen.attributes['segments-width'], 
										e._xseen.attributes['segments-height'], 
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};

XSeen.Tags.ring = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.RingGeometry(
										e._xseen.attributes['radius-inner'], 
										e._xseen.attributes['radius-outer'], 
										e._xseen.attributes['segments-theta'], 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['theta-start'] * XSeen.CONST.Deg2Rad, 
										e._xseen.attributes['theta-length'] * XSeen.CONST.Deg2Rad
									);
			XSeen.Tags._solid (e, p, geometry);
		},
	'fin'	: function (e,p) {},
	'event'	: function (ev, attr) {},
};


/*
 * ===================================================================================
 * Parsing definitions
 */
XSeen.Parser._addStandardAppearance = function (tag) {
	tag
		.defineAttribute ({'name':'ambient-occlusion-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'ambient-occlusion-map-intensity', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'ambient-occlusion-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
		.defineAttribute ({'name':'ambient-occlusion-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'color', dataType:'color', 'defaultValue':'white'})
		.defineAttribute ({'name':'displacement-bias', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'displacement-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'displacement-scale', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'displacement-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
		.defineAttribute ({'name':'displacement-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'emissive', dataType:'color', 'defaultValue':'black'})
		.defineAttribute ({'name':'env-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'fog', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'metalness', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'normal-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'normal-scale', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'normal-texture-offset', dataType:'vec2', 'defaultValue':[0,0]})
		.defineAttribute ({'name':'normal-texture-repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'repeat', dataType:'vec2', 'defaultValue':[1,1]})
		.defineAttribute ({'name':'roughness', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'side', dataType:'string', 'defaultValue':'front', enumeration:['front','back','both'], isCaseInsensitive:true})
		.defineAttribute ({'name':'spherical-env-map', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'src', dataType:'string', 'defaultValue':''})
		.defineAttribute ({'name':'wireframe', dataType:'boolean', 'defaultValue':false})
		.defineAttribute ({'name':'wireframe-linewidth', dataType:'integer', 'defaultValue':2})
		.addEvents ({'mutation':[{'attributes':XSeen.Tags.Solids._changeAttribute}]})
		.addTag();
};
		
var tag;
tag = XSeen.Parser.defineTag ({
						'name'	: 'box',
						'init'	: XSeen.Tags.box.init,
						'fin'	: XSeen.Tags.box.fin,
						'event'	: XSeen.Tags.box.event,
						'tick'	: XSeen.Tags.box.tick
						})
		.addSceneSpace()
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
		.defineAttribute ({'name':'radius', dataType:'float', 'defaultValue':2.0})
		.defineAttribute ({'name':'tube', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'arc', dataType:'float', 'defaultValue':360})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8})
		.defineAttribute ({'name':'segments-tubular', dataType:'integer', 'defaultValue':6});
XSeen.Parser._addStandardAppearance (tag);

tag = XSeen.Parser.defineTag ({
						'name'	: 'plane',
						'init'	: XSeen.Tags.plane.init,
						'fin'	: XSeen.Tags.plane.fin,
						'event'	: XSeen.Tags.plane.event,
						'tick'	: XSeen.Tags.plane.tick
						})
		.addSceneSpace()
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
		.defineAttribute ({'name':'radius-inner', dataType:'float', 'defaultValue':0.5})
		.defineAttribute ({'name':'radius-outer', dataType:'float', 'defaultValue':1.0})
		.defineAttribute ({'name':'theta-start', dataType:'float', 'defaultValue':0.0})
		.defineAttribute ({'name':'theta-length', dataType:'float', 'defaultValue':360.0})
		.defineAttribute ({'name':'segments-theta', dataType:'integer', 'defaultValue':8})
		.defineAttribute ({'name':'segments-radial', dataType:'integer', 'defaultValue':8});
XSeen.Parser._addStandardAppearance (tag);
// File: tags/style3d.js
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