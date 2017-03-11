Game.prototype.Player = function(o){
	this.Init(o);
};
Game.prototype.Player.prototype = {
	Init: function(o){
		this.index = o.index;
		this.ai = o.ai;
		this.parent = o.parent
		
		this.rule = {};
		this.resources = {};
		this.objects = {};
		this.enabled = [];
		this.filtered = [];
	},
	Create: function(parent, count){
		var pc_index = random(0, count-1);
		var players = [];
		
		for (var i=0; i<count; i++)
		{
			players.push(new parent.Player({
				index: i,
				ai: i !== pc_index,
				parent: parent
			}));
		}
		
		return players;
	},
	
	getRoundMessage: function(){
		return this.ai ? 'Ходит игрок №'+(this.index+1) : 'Ваш ход';
	},
	getMessageTimeout: function(){
		return 300;
	},
	
	AddObject: function(type, count){
		this.objects[type] = (this.objects[type] || 0) + (count || 1);
		
		if (this.rule.objects[type].count !== undefined){
			this.rule.objects[type].count--;
			
			if (this.rule.objects[type].count <= 0){
				delete this.rule.objects[type];
			}
		}
		else{
			if (this.rule.objects[type].receipt){
				for (var i in this.rule.objects[type].receipt){
					this.DelRes(i, this.rule.objects[type].receipt[i]);
				}
			}
			
			this.CheckExchange();
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
	hasRuleObjects: function(){
		return obj_length(this.rule.objects) > 0;
	},
	CheckObjects: function(){
		this.enabled = [];
		this.filtered = [];
		
		for (var type in this.rule.objects){
			var obj = this.rule.objects[type];
			
			if (obj.need || obj.receipt){
				if (this.hasObject(obj.need)){
					if (!obj.receipt || this.hasRes(obj.receipt)){
						this.enabled.push(type);
					}
				}
				this.filtered.push(type);
			}
			else{
				this.enabled.push(type);
			}
		}
	},
	
	DelRes: function(type, count){
		if (this.resources[type]){
			this.resources[type] -= count || 1;
			if (this.resources[type] <= 0) delete this.resources[type];
		}
	},
	AddRes: function(type, count){
		this.resources[type] = (this.resources[type] || 0) + (count || 1);
	},
	getRes: function(){
		return this.resources;
	},
	hasRes: function(receipt){
		for (var type in receipt){
			if (!this.resources[type] || this.resources[type] < receipt[type])
				return false;
		}
		return true;
	},
	
	CheckExchange: function(){
		//for (var type in)
		//this.rule.exchange;
	},
	getExchange: function(){
		return this.rule.exchange;
	},
	Exchange: function(type1, type2){
		this.DelRes(type1, this.rule.exchange[type1].count);
		this.AddRes(type2);
	},
	
	getFiltered: function(){
		return this.filtered;
	},
	
	getEnabled: function(){
		return this.enabled;
	},
	setEnabled: function(arr){
		this.enabled = arr;
	},
	isEnabled: function(type){
		return in_array(type, this.enabled);
	},
	
	setRule: function(r){
		this.rule = r || this.rule;
	},
	Step: function(r){
		this.setRule(r);
		
		if (this.ai){
			
		}
		else{
			
		}
		
		return {
			filtered: this.filtered,
			enabled: this.ai ? [] : this.enabled
		};
	}
};