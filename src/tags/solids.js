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
				e._xseen.texture = new THREE.TextureLoader().load (e._xseen.attributes['map']);
				e._xseen.texture.wrapS = THREE.ClampToEdgeWrapping;
				e._xseen.texture.wrapT = THREE.ClampToEdgeWrapping;
			}
			e._xseen.properties.envMap = XSeen.Tags._process_envMap(e._xseen.attributes['env-map']);
			e._xseen.properties['side'] = THREE.FrontSide;
			if (e._xseen.attributes['side'] == 'back') e._xseen.properties['side'] = THREE.BackSide;
			if (e._xseen.attributes['side'] == 'both') e._xseen.properties['side'] = THREE.DoubleSide;

			var parameters, appearance;
			if (e._xseen.attributes.type == 'phong') {
				parameters = {
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
							'color'					: e._xseen.attributes['color'],
							'displacementMap'		: e._xseen.attributes['displacement-map'],
							'displacementScale'		: e._xseen.attributes['displacement-scale'],
							'displacementBias'		: e._xseen.attributes['displacement-bias'],
							'emissive'				: e._xseen.attributes['emissive'],
							'envMap'				: e._xseen.properties.envMap,
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
				parameters = {
							'color'					: e._xseen.attributes['color'],
							'emissive'				: 0x000000,
							'envMap'				: e._xseen.properties.envMap,
							'side'					: THREE.FrontSide,
// General material properties
							'emissiveIntensity'		: 0,
							'opacity'				: 1.,
							'transparent'			: false,
// General material properties that only apply to Phong or PBR
							'reflectivity'			: .5,
							'refractionRatio'		: .98,
// PBR properties
							'metalness'				: 1,
							'roughness'				: .5,
							};
				appearance = new THREE.MeshPhysicalMaterial(parameters);
			} else {
				parameters = {
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
			//geometry.needsUpdate = true;
	
			var mesh = new THREE.Mesh (geometry, appearance);
			mesh.userData = e;
			XSeen.Tags._setSpace(mesh, e._xseen.attributes);
			p._xseen.sceneInfo.selectable.push(mesh);
			mesh.name = 'Solid: ' + e.id;

			e._xseen.tagObject = mesh;
			p._xseen.children.push(mesh);

};
XSeen.Tags.Solids._changeAttribute = function (e, attributeName, value) {
			console.log ('Changing attribute ' + attributeName + ' of ' + e.localName + '#' + e.id + ' to |' + value + ' (' + e.getAttribute(attributeName) + ')|');
			if (value !== null) {
				e._xseen.attributes[attributeName] = value;
				if (attributeName == 'color') {				// Different operation for each attribute
					e._xseen.tagObject.material.color.setHex(value);	// Solids are stored in a 'group' of the tagObject
					e._xseen.tagObject.material.needsUpdate = true;
				} else if (attributeName == 'env-map') {				// Different operation for each attribute
					e._xseen.properties.envMap = XSeen.Tags._process_envMap(value);
					e._xseen.tagObject.material.envMap = e._xseen.properties.envMap;
					e._xseen.tagObject.material.needsUpdate = true;
				} else {
					XSeen.LogWarn('No support for updating ' + attributeName);
				}
			} else {
				XSeen.LogWarn("Reparse of " + attributeName + " is invalid -- no change")
			}
};
XSeen.Tags._process_envMap = function (envMapUrl) {
			var envMap;
			if (envMapUrl == 'desert') {
				envMap = new THREE.CubeTextureLoader()
											.setPath('Resources/textures/')
											.load ([
													'desert_1_right.jpg',
													'desert_1_left.jpg',
													'desert_1_top.jpg',
													'desert_1_bottom.jpg',
													'desert_1_front.jpg',
													'desert_1_back.jpg',
											]);
			} else if (envMapUrl == 'forest') {
				envMap = new THREE.CubeTextureLoader()
											.setPath('Resources/textures/')
											.load ([
													'forest_1_right.jpg',
													'forest_1_left.jpg',
													'forest_1_top.jpg',
													'forest_1_bottom.jpg',
													'forest_1_front.jpg',
													'forest_1_back.jpg',
											]);
			} else if (envMapUrl == 'gray') {
				envMap = new THREE.CubeTextureLoader()
											.setPath('Resources/textures/')
											.load ([
													'gray99-right.png',
													'gray99-left.png',
													'gray99-top.png',
													'gray99-bottom.png',
													'gray99-front.png',
													'gray99-back.png',
											]);
			} else {
				envMap = null;
			}
			return envMap;
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

XSeen.Tags.tknot = {
	'init'	: function (e,p)
		{
			var geometry = new THREE.TorusKnotGeometry(
										e._xseen.attributes.radius, 
										e._xseen.attributes.tube, 
										e._xseen.attributes['segments-tubular'], 
										e._xseen.attributes['segments-radial'], 
										e._xseen.attributes['wind-p'], 
										e._xseen.attributes['wind-q'], 
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
 *
 * //1 ==> Commented out during PBR development
 */
XSeen.Parser._addStandardAppearance = function (tag) {
	tag
		.defineAttribute ({'name':'type', dataType:'string', 'defaultValue':'phong', enumeration:['phong','pbr'], isCaseInsensitive:true})

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
						'name'	: 'tknot',
						'init'	: XSeen.Tags.tknot.init,
						'fin'	: XSeen.Tags.tknot.fin,
						'event'	: XSeen.Tags.tknot.event
						})
		.addSceneSpace()
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
