jasmine: myna
	coffee -o ./spec -c ./spec/myna_spec.coffee
myna:
	coffee -o ./src -c ./src/myna.coffee
min: myna
	java -jar compiler.jar --js ./src/myna.js --js_output_file myna-min.js
