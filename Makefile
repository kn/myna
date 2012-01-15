jasmine: test myna
	open ./spec/spec_runner.html
test:
	coffee -o ./spec -c ./spec/myna_spec.coffee
myna:
	coffee -o ./src -c ./src/myna.coffee
