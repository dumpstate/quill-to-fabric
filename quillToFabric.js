angular.module("quillToFabric", [])
	.factory('QuillToFabric', function() {
		var QuillToFabric = {};

		QuillToFabric.defaultFontFamily = 'Arial';
		QuillToFabric.defaultFontSize = 12;

		QuillToFabric.fontSize = function(op) {
			if(op && op.attributes && op.attributes.size &&
				typeof op.attributes.size === 'string') {
				return parseInt(op.attributes.size);
			} else return QuillToFabric.defaultFontSize;
		};

		QuillToFabric.fontFamily = function(op) {
			if(op && op.attributes && op.attributes.font) {
				return op.attributes.font;
			} else return QuillToFabric.defaultFontFamily;
		};

		QuillToFabric.fontStyle = function(op) {
			if(op && op.attributes) {
				var styles = [];
				if(op.attributes.italic === true)
					styles.push('italic');
				if(op.attributes.oblique === true)
					styles.push('oblique');
				if(styles.length === 0)
					return 'normal';
				else 
					return _.reduce(styles, function(memo, s) {
						if(memo === "") return s;
						else return memo += "|" + s;
					}, "");
			} else return 'normal';
		};

		QuillToFabric.textDecoration = function(op) {
			if(op && op.attributes) {
				var decor = [];
				if(op.attributes.underline === true)
					decor.push('underline');
				if(op.attributes.strike === true)
					decor.push('line-through');
				if(op.attributes.overline === true)
					decor.push('overline');
				if(decor.length === 0)
					return 'none';
				else 
					return _.reduce(decor, function(memo, d) {
						if(memo === "") return memo += d;
						else return memo += "|" + d;
					}, "");
			}
			else return 'none';
		};

		QuillToFabric.fontWeight = function(op) {
			if(op && op.attributes && op.attributes.bold === true) {
				return 'bold';
			} else return 'normal';
		};

		QuillToFabric.textBackgroundColor = function(op) {
			if(op && op.attributes && op.attributes.background) {
				return op.attributes.background;
			} else return 'transparent';
		};

		QuillToFabric.stroke = function(op) {
			if(op && op.attributes && op.attributes.color) {
				return op.attributes.color;
			} else return 'black';
		}

		QuillToFabric.styles = function(ops) {
			var line = 0, no = 0, styles = {};

			_.each(ops, function(op) {
				if(op.value) {
					var item = styles[line];
					if(item === undefined) item = {};

					var prefs = {
						fontFamily: QuillToFabric.fontFamily(op),
						fontSize: QuillToFabric.fontSize(op),
						fontStyle: QuillToFabric.fontStyle(op),
						textDecoration: QuillToFabric.textDecoration(op),
						fontWeight: QuillToFabric.fontWeight(op),
						textBackgroundColor: QuillToFabric.textBackgroundColor(op),
						fill: QuillToFabric.stroke(op)
					};

					_.each(op.value, function(c) {
						if(c === '\n') {
							no = 0;
							line += 1;
						} else {
							item[no] = prefs;
							no += 1;
						}
					});

					styles[line] = item;

				} else { line += 1; no = 0; }
			});

			return styles;
		};

		QuillToFabric.get = function(quill) {
			if(typeof quill == 'string' || quill instanceof String)
				quill = JSON.parse(quill);

			var text = _.reduce(quill.ops, function(memo, op) {
				return op.value ? memo + op.value : memo + '\n';
			}, "");

			return new fabric.IText(text, {
				fontFamily: QuillToFabric.fontFamily(),
				fontSize: QuillToFabric.fontSize(),
				styles: QuillToFabric.styles(quill.ops)
			});
		}

		return QuillToFabric;
	});