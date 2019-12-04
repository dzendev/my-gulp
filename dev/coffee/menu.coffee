do ->
	x = 30
	r = ()-> 320
	rr = () => 40

	class Animal
		constructor: (@name) ->

		move: (meters) ->
			console.log @name + 'moved'
	return