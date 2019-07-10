window.Game = function(o){
	this.views = o.views;
	this.views.setElem(o.elements);

	this.map = new Map();

	this.Start();
	this.Render('description', this.rules.getReceipts());
	this.Step();
};
Game.prototype = {
	Render: function(name, o){
		return this.views[name](o);
	},
	Bind: function(event, params){
		if (is_object(event)){
			for (var e in event){
				this.Bind(e, event[e]);
			}
		}
		else{
			var $this = this;

			for (var name in params){
				var method = params[name];

				if (!is_callable(method)){
					method = in_str(',', method) ? method.split(',') : to_arr(method);

					for (var i in method){
						method[i] = method[i].trim();

						var object, m;

						if (in_str('.',method[i])){
							method[i] = method[i].split('.');

							method[i] = {
								object: method[i][0],
								method: method[i][1]
							};
						}
						else{
							method[i] = {
								object: this,
								method: method[i]
							};
						}
					}

					params[name] = method;
				}

				this.views.Bind(event, name, function(e, elem, _name){
					if (is_callable(params[_name].method)){
						params[_name].method(e, elem);
					}
					else{
						for (var i in params[_name]){
							var o = params[_name][i];

							if (!is_object(o.object)) o.object = this[o.object];
							o.object[o.method](e, elem);
						}
					}
				});
			}
		}
	},

	Message: function(text, ms, success){
		if (is_callable(ms)){
			success = ms;
			ms = null;
		}
		this.Render('message', {text: text, ms: ms, success: success});
	},

	CreatePlayers: function(){
		var count = this.Render('enter_number', 'Введите кол-во игроков:');

		this.players = Player.prototype.Create(this, count);
		this.current_player_index = -1;
	},
	CreateHoverTable: function(){
		for (var i=0; i<this.map.getHeight(); i++){
			for (var j=0; j<this.map.getWidth(); j++)
			{
				if (!this.map.isRes(i,j)) continue;

				this.Render('lines', {
					data: this.map.getLines(i,j),
					pos: [i,j]
				});
				this.Render('corners', {
					data: this.map.getCorners(i,j),
					pos: [i,j]
				});
			}
		}
	},
	Start: function(){
		this.CreatePlayers();
		this.rules = new Rules();
		this.Render('map', this.map.Generate(this.rules));
		this.CreateHoverTable();
	},

	toggleObjectDescription: function(name, enable){
		this.views[(enable ? 'enable' : 'disable')+'Object'](name);
	},
	hideHoverTable: function(elem){
		this.views.toggle_hover_table(elem, false);
		this.current_object = null;
	},

	// Game Process
	setNextPlayer: function(order){
		if (order === undefined) order = 1;

		if (order > 0) this.current_player_index++;
		else if(order < 0) this.current_player_index--;

		if (this.current_player_index >= this.players.length){
			this.current_player_index = 0;
			return true;
		}
		if (this.current_player_index < 0){
			this.current_player_index = this.players.length-1;
			return true;
		}

		return false;
	},
	Step: function(){
		this.Render('hide_hover_table');
		this.views.toggleTurnButton(false);

		var rule = this.rules.getCurrentRule();

		if (this.setNextPlayer(rule.order))// round ended
		{
			this.rules.setNextRound();
			rule = this.rules.getCurrentRule();
			this.current_player_index = rule.order < 0 ? this.players.length-1 : 0;
		}

		var p = this.current_player = this.players[this.current_player_index];
		var $this = this;

		if (p.ai) this.views.disableObject();

		this.Message(p.getRoundMessage(), p.getMessageTimeout(), function(){
			p.Step(rule);
			if (p.ai) $this.Step();
		});
	},

	// Events
	toggleHoverTable: function(e, elem){
		this.views.CheckFilter(elem);
		var res = this.views.getRes(elem);
		this.current_object = this.views.toggle_hover_table(elem, this.current_object !== res) ? res : null;
	},
	setObject: function(e, elem){
		if (!this.current_object || this.views.ObjectIsSet(elem)) return;
		this.views.setObject(elem);
		this.current_player.AddObject(this.current_object);
		this.current_player.Step();
	},

	// Filter
	setFilter: function(name){
		this.views.setFilter(this.views.getDescrElem(name));
	}
};
