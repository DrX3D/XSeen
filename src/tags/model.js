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
	'init'	: function (e, p) 
		{
			e._xseen.processedUrl = false;
			e._xseen.loaded = {'envmap':false, 'model':false, }
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
			XSeen.Loader.load (e._xseen.attributes.src, e._xseen.attributes.hint, XSeen.Tags.model.loadSuccess({'e':e, 'p':p}), XSeen.Tags.model.loadFailure, XSeen.Tags.model.loadProgress);
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
 * Once the environent map and model are loaded, add the envmap to all Meshes
 */
	'applyEnvMap'	: function (e) {
			if (e._xseen.loaded.envmap && e._xseen.loaded.model) {
				e._xseen.tmpGroup.traverse (function(child) {
					if (child.isMesh) child.material.envMap = e._xseen.properties.envMap;
				});
				console.log ('Successful load of environment textures to glTF model.');
			}
	},

/*
 * Start load process for environment map image cube
 *	Taken from solids
 */
	'_envMap'	: function (e, envMapUrl) {
			var envMap, basePath = 'Resources/textures/';
			envMap = null;
			console.log ('Loading textures from ' + envMapUrl);
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
		.addTag();
