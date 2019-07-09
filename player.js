window.Player = function(o){
	$.extend(this, o);
};
Player.prototype = {
	resources: {},
	objects: {},

	Create: function(game, count){
		var pc_index = random(0, count-1);
		var players = [];

		for (var i=0; i<count; i++)
		{
			players.push(new Player({
				index: i,
				ai: i !== pc_index,
				game: game
			}));
		}

		return players;
	},

	Step: function(rule){
		if (this.ai){
			/*if (rule.objects){
				this.game.setRandomObject(rule.objects);
			}*/
		}
		else{
			if (rule.objects){
				var min = rule.objects.min_count;
				var obj;

				for (var name in rule.objects){
					obj = rule.objects[name];

					if (min && min > obj){
						this.game.toggleTurnButton(true);
					}
				}
				this.game.enableObject(rule.objects);
			}
		}
	}
};
