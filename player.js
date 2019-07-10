window.Player = function(o){
	$.extend(this, o);

	this.resources = {};
	this.objects = {};
};
Player.prototype = {
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

	AddObject: function(type){
		this.objects[type] = (this.objects[type] || 0) + 1;
		this.rule.objects[type].count ? this.rule.objects[type].count-- : this.rule.objects[type]--;
	},
	hasObject: function(type){
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
			if (rule.objects){
				var exact = rule.objects.min_count;
				var min = rule.objects.min_count;
				var max = rule.objects.min_count;
				var obj;

				for (var name in rule.objects){
					obj = rule.objects[name];
					var enable = false;
					var is_obj = is_object(obj);
					var count = is_obj ? obj.count : obj;

					if (is_obj){
						if (obj.need)
							enable = this.hasObject(obj.need);

						if (obj.exact_count){
							enable = enable && count == obj.exact_count;
						}
						else{
							if (obj.max_count)
								enable =  enable && count < max_count;

							if (obj.min_count && count >= min_count)
								this.game.toggleTurnButton(true);
						}
					}

					if (exact){
						enable = enable && count == exact;
					}
					else{
						if (max)
							enable =  enable && count < max;

						if (min)
							enable =  enable && count < min;
					}

					this.game.toggleObject(name, enable);
				}
			}
		}
	}
};
