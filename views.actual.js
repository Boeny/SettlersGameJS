Views.Actual = function(o){
	this.Init(o);
};
Views.Actual.prototype = {
	Init: function(o){
		$.extend(this,o);
	},
	Create: function(){
		var content = '';

		for (var type in this.objects){
			content += this.html.div(this.html.span(type) +' '+ this.html.span(this.objects[type]), {'data-type': type});
		}

		this.DOM.html(content);
	},

	setObjects: function(o){
		this.objects = o;
		this.Create();
	}
};
