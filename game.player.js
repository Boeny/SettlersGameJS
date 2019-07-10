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

	AddObject: function(name){
		this.objects[name] = (this.objects[name] || 0) + 1;
		this.rule.objects[name].count--;

		if (this.rule.objects[name].count <= 0){
			delete this.rule.objects[name];
			this.game.toggleObjectDescription(name, false);
			this.game.hideHoverTable(name);
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
				var result = {};

				for (var name in this.rule.objects){
					var obj = this.rule.objects[name];

					if (obj.need){
						if (this.hasObject(obj.need)){
							result[name] = 1;
						}

						this.game.setFilter(name);
					}
					else{
						result[name] = 1;
					}
				}

				this.game.toggleObjectDescription(result, true);
			}
		}
	}
};
