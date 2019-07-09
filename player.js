window.Player = function(o){
	$.extend(this, o);
};
Player.prototype = {
	resources: {},
	objects: {},
	Step: function(rule){
		if (this.ai){
			/*if (rule.objects){
				this.game.setRandomObject(rule.objects);
			}*/
		}
		else{
			if (rule.objects){
				this.game.enableObject(rule.objects);
			}
		}
	}
};