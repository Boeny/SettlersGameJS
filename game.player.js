Game.prototype.Player = function(o){
	$.extend(this, o);

	this.resources = {};
	this.objects = {};
};
Game.prototype.Player.prototype = {
	Create: function(game, count){
		var pc_index = random(0, count-1);
		var players = [];

		for (var i=0; i<count; i++)
		{
			players.push(new game.Player({
				index: i,
				ai: i !== pc_index,
				game: game
			}));
		}

		return players;
	},

	getRoundMessage: function(){
		return this.ai ? 'Ходит игрок №'+(this.index+1) : 'Ваш ход';
	},
	getMessageTimeout: function(){
		return this.ai ? 700 : 300;
	},

	AddObject: function(type){
		this.objects[type] = (this.objects[type] || 0) + 1;
		this.rule.objects[type].count--;

		if (this.rule.objects[type].count <= 0){
			delete this.rule.objects[type];
			this.game.toggleObjectDescription(type, false);
			this.game.hideHoverTable(type);
		}
	},
	hasObject: function(type){
		if (!type) return false;

		if (is_array(type)){
			var result = false;

			for (var i in type){
				if (this.hasObject(type[i])) return true;
			}
			return false;
		}

		return in_array(type, obj_keys(this.objects));
	},

	Step: function(rule){
		this.rule = rule || this.rule;

		if (this.ai){
			/*if (rule.objects){
				this.game.setRandomObject(rule.objects);
			}*/
		}
		else{
			if (this.rule.objects){
				var result = [];
				var filtered = [];

				for (var type in this.rule.objects){
					var obj = this.rule.objects[type];

					if (obj.need){
						if (this.hasObject(obj.need)){
							result.push(type);
						}

						filtered.push(type);
					}
					else{
						result.push(type);
					}
				}

				return {
					filtered: filtered,
					enabled: result
				};
			}
		}
	}
};
