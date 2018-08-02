async function parseXML(data) {
	return new Promise(function(accept, reject) {
		require('xml2js').parseString(data, function(err, result) {
			if (err) {
				reject(err);
			} else {
				accept(result);
			}
		});
	});
}

async function readFile(path, encoding) {
	return new Promise(function(accept, reject) {
		var fs = require('fs');
		fs.readFile(path, encoding, function(err, data) {
			if (err) {
				reject(err);
			} else {
				accept(data);
			}
		})
	});
}

function json2xml(json) {
	var xml2js = require('xml2js');
	var builder = new xml2js.Builder();
    var xml = builder.buildObject(json);
    return xml;
}

function appendRepresentationToMPD(representation, mpd) {
	mpd.MPD.Period[0].AdaptationSet[0].Representation.push(representation);
	return mpd;
}

(async function() {

	var outputDocument = undefined;

	for (var i in process.argv) {

		if (i < 4) {
			throw new Error('Expected at least two command line arguments.');
		}

		if ((i == 0) || (i == 1)) {
			continue; // Skip node and input arguments.
		}

		filename = process.argv[i];

		var content = await readFile(filename, 'utf-8');

		var mpd = await parseXML(content);

		if (typeof outputDocument == 'undefined') {
			outputDocument = mpd;
		} else {
			var representation = mpd.MPD.Period[0].AdaptationSet[0].Representation[0];
			outputDocument = appendRepresentationToMPD(representation, outputDocument);
		}

	}

	var xml = json2xml(outputDocument);

	process.stdout.write(xml);

})();