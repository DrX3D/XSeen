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
/*
 *	These are now set in the Camera Manager
			e._xseen.sceneInfo.Camera.position.set (
							e._xseen.attributes.position.x,
							e._xseen.attributes.position.y,
							e._xseen.attributes.position.z);
			e._xseen.sceneInfo.Camera.lookAt(0,0,0);		// Look at origin. Seems to be required for object type.
 */
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
 
			if (e._xseen.type == 'orthographic') {			// TODO: Orthographic projection
			
			} else if (e._xseen.type == 'perspective') {	// Perspective camera -- default
				if (e._xseen.track == 'device') {
					if (e._xseen.sceneInfo.hasDeviceOrientation) {
						e._xseen.track = (e._xseen.target === null) ? 'environment' : 'object'
						e._xseen.sceneInfo.useDeviceOrientation = true;
					} else {
						e._xseen.track = 'orbit';
						e._xseen.sceneInfo.useDeviceOrientation = false;
					}
				}
				
			} else if (e._xseen.type == 'stereo') {	// Stereo perspective cameras
				var track = (e._xseen.target === null) ? 'environment' : 'object'
				if (e._xseen.track == 'device' && !e._xseen.sceneInfo.hasDeviceOrientation) {track = 'orbit';}
				e._xseen.track = track;
				e._xseen.sceneInfo.Renderer = e._xseen.sceneInfo.RendererStereo;
				e._xseen.sceneInfo.rendererHasControls = false;
				e._xseen.sceneInfo.isStereographic = true;
				// Need to add a button to the display to go full screen
 
			} else if (e._xseen.type == 'vr') {	// Stereo perspective cameras
				if (e._xseen.sceneInfo.isVrCapable) {
					e._xseen.sceneInfo.Renderer.vr.enabled = true;
					e._xseen.sceneInfo.rendererHasControls = true;
					document.body.appendChild( WEBVR.createButton( e._xseen.sceneInfo.Renderer ) );
				} else if (e._xseen.sceneInfo.hasDeviceOrientation) {
					e._xseen.type = 'stereo';
					e._xseen.track = 'device';
					e._xseen.sceneInfo.Renderer = e._xseen.sceneInfo.RendererStereo;
					e._xseen.sceneInfo.rendererHasControls = false;
					e._xseen.sceneInfo.isStereographic = true;
					// Need to add a button to the display to go full screen
				} else {													// Flat screen
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
 *	A viewpoint list can be constructed with the x-class3d tag setting the same camera parameters and each 
 *	x-camera node having different position/rotation attributes.
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
 */
			if (!e._xseen.sceneInfo.rendererHasControls) {
				if (e._xseen.sceneInfo.useDeviceOrientation) {
					if (e._xseen.track == 'object') {	// tracking scene object
						e._xseen.sceneInfo.CameraControl = new THREE.DeviceOrientationControls(e._xseen.target, true);
					} else {							// tracking environment
						e._xseen.sceneInfo.CameraControl = new THREE.DeviceOrientationControls(e._xseen.sceneInfo.Camera);
					}

				} else {								// No device orientation control. Use something else
					if (e._xseen.track == 'orbit') {
						e._xseen.sceneInfo.CameraControl = new THREE.OrbitControls( e._xseen.sceneInfo.Camera, e._xseen.sceneInfo.RendererStandard.domElement );
					} else if (e._xseen.track == 'trackball') {
						//console.log ('Trackball');
					} else if (e._xseen.track == 'none') {
						//console.log ('No tracking');
						e._xseen.sceneInfo.rendererHasControls = true;
					} else {
						console.log ('Something else');
					}
				}
			}

			e._xseen.sceneInfo.ViewManager.add (e);
			//if (typeof(e._xseen.sceneInfo.DefinedCameras[e._xseen.priority]) == 'undefined') {e._xseen.sceneInfo.DefinedCameras[e._xseen.priority] = [];}
			//e._xseen.sceneInfo.DefinedCameras[e._xseen.priority].push (e);
			//e._xseen.ndxCamera = e._xseen.sceneInfo.DefinedCameras.length - 1;
			//e._xseen.sceneInfo.DefinedCameras[e._xseen.priority].push ('Defined ' + e._xseen.type + ' camera#' + e.id + ' at (' + e._xseen.attributes.position.x + ', ' + e._xseen.attributes.position.y + ', ' + e._xseen.attributes.position.z + ')');
			//console.log ('Adding camera at priority ' + e._xseen.priority);
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
		.defineAttribute ({'name':'priority', dataType:'integer', 'defaultValue':1})
		.defineAttribute ({'name':'available', dataType:'boolean', 'defaultValue':true})
		.defineAttribute ({'name':'target', dataType:'string', 'defaultValue':''})
		.addTag();
