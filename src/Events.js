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
