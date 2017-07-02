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

 // Node definition code (just stubs right now...)


xseen.node.x_Animate = {
	'init'	: function (e,p)
		{
			var delay = e._xseen.fields.delay * 1000;		// Convert to milliseconds
			var duration = e._xseen.fields.duration * 1000;	// Convert to milliseconds
			var repeat = (e._xseen.fields.repeat < 0) ? Infinity : e._xseen.fields.repeat;
			var interpolator = e._xseen.fields.interpolator;
			var easing = e._xseen.fields.easing;
			
			var fields = xseen.parseTable[p.localName.toLowerCase()].fields;
			var fieldIndex = xseen.parseTable[p.localName.toLowerCase()].fieldIndex;
			var toField = e._xseen.fields.field;
			var toFieldIndex = fieldIndex[toField];
			if (typeof(fields[toFieldIndex]) === 'undefined') {
				xseen.debug.logInfo("Field '" + toField + "' not found in parent (" + p.localName.toLowerCase() + "). No animation performed.");
				return;
			}
			var fieldObject = fields[toFieldIndex].clone().setFieldName('to');	// Parse table entry for 'toField'
			var to = xseen.nodes._parseField(fieldObject, e);	// Parsed data  -- need to convert to THREE format

// Convert 'to' to the datatype of 'field' and set interpolation type.
			var interpolation;
			if (fieldObject.type == 'SFVec3f') {
				interpolation = TWEEN.Interpolation.Linear;
				to = xseen.types.Vector3(to);
				xseen.debug.logInfo("Interpolating field '" + toField + "' as 3-space.");

			} else if (fieldObject.type == 'SFColor') {
				interpolation = this.Interpolator.color;
				to = new THREE.Color (xseen.types.Color3toInt(to));
				xseen.debug.logInfo("Interpolation field '" + toField + "' as color.");

			} else if (fieldObject.type == 'SFRotation') {
				interpolation = this.Interpolator.slerp;
				to = xseen.types.Rotation2Quat(to);
				xseen.debug.logInfo("Interpolation field '" + toField + "' as rotation.");

			} else {
				xseen.debug.logInfo("Field '" + toField + "' not converted to THREE format. No animation performed.");
				return;
			}
			var fieldTHREE = p._xseen.animate[toField];			// THREE field for animation

			var tween = new TWEEN.Tween(fieldTHREE)
								.to(to, duration)
								.delay(delay)
								.repeat(repeat)
								.interpolation(interpolation);
			var easingType = e._xseen.fields.easingtype;
			easingType = easingType.charAt(0).toUpperCase() + easingType.slice(1);
			easing = (easingType != 'Linear' && easing == '') ? 'inout' : easing;
			if (easing != '') {
				easing = easing.replace('in', 'In').replace('out', 'Out');
				easingType = (easingType == 'Linear') ? 'Quadratic' : easingType;
				e._xseen.fields.easing = easing;
				e._xseen.fields.easingtype = easingType;
				tween.easing(TWEEN.Easing[easingType][easing]);
			}

/*
 * Put animation-specific data in node (e._xseen) so it can be accessed on events (through 'this')
 *	This includes initial value and field
 *	All handlers (goes into .handlers)
 *	TWEEN object
 */
			e._xseen.initialValue = fieldTHREE.clone();
			e._xseen.animatingField = fieldTHREE;
			e._xseen.handlers = {};
			e._xseen.handlers.setstart = this.setstart;
			e._xseen.handlers.setstop = this.setstop;
			e._xseen.handlers.setpause = this.setpause;
			e._xseen.handlers.setresetstart = this.setresetstart;
			e._xseen.animating = tween;
			p._xseen.animation.push (tween);
			tween.start();
		},
	'fin'	: function (e,p) {},
	'setstart'	: function (ev)
		{
			console.log ('Starting animation');
			this.destination._xseen.animating.start();
		},
	'setstop'	: function (ev) 
		{
			console.log ('Stopping animation');
			this.destination._xseen.animating.stop();
		},
/*
 * TODO: Update TWEEN to support real pause & resume. 
 *	Pause needs to hold current position
 *	Resume needs to restart the timer to current time so there is no "jump"
 */
	'setpause'	: function (ev) 
		{
			console.log ('Pausing (really stopping) animation');
			this.destination._xseen.animating.stop();
		},
	'setresetstart'	: function (ev) 	// TODO: Create seperate 'reset' method
		{
			console.log ('Reset and start animation');
			this.destination._xseen.animatingField = this.destination._xseen.initialValue;
			this.destination._xseen.animating.start();
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
				var fn = this.slerpCompute;
	
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
