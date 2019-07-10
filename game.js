window.Game = function(o){
	this.views = o.views;
	this.views.setElem(o.elements);

	this.map = new Map();

	this.Start();
	this.Render('description', this.map.getReceipts());
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
			var $this = this, method;

			for (var name in params){
				method = params[name];

				if (!is_callable(method)){
					method = in_str(',', method) ? method.split(',') : to_arr(method);

					for (var i in method){
						method[i] = method[i].trim();

						if (in_str('.',method[i])){
							method[i] = method[i].split('.');
						}
					}
				}

				this.views.Bind(event, name, function(e, elem){
					if (is_callable(method)){
						method(e, elem);
						return;
					}

					var object, m;

					for (var i in method){
						if (is_array(method[i])){
							object = method[i][0];
							m = method[i][1];
						}
						else{
							object = $this;
							m = method[i];
						}

						object[m](e, elem);
					}
				});
			}
		}
	},

	Message: function(text, ms){
		this.Render('message', {text: text, ms: ms});
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

	toggleObject: function(name, enable){
		this.views[(enable ? 'enable' : 'disable')+'Object'](name);
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

		this.current_player = this.players[this.current_player_index];
		var $this = this;

		if (this.current_player.ai) this.views.disableObject();

		this.Message(this.current_player.ai ? 'Ходит игрок №'+(this.current_player.index+1) : 'Ваш ход', function(){
			$this.current_player.Step(rule);
			if ($this.current_player.ai) $this.Step();
		});
	},

	ShowHoverTable: function(e, elem){
		this.current_object = this.Render('show_hover_table') ? this.views.getRes(elem) : null;
	},
	SetObject: function(e, elem){
		if (!this.current_object) return;
		this.views.SetObject(elem);
		this.current_player.AddObject(this.current_object);
		this.current_player.Step();
	}
};
