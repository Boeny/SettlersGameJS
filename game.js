window.Game = function(o){
	this.Init(o);
	this.EnterPlayersCount('Create');
};
Game.prototype = {
	Init: function(o){
		this.players = [];
		this.players_count = 0;
		this.current_player = null;
		this.current_player_index = -1;

		this.current_object_type = '';
		this.map = null;
		this.rules = null;

		var _views = o.views;

		this.Render = function(name, o){
			return _views[name](o);
		};

		this.Bind = function(_e, params){
			if (is_object(_e)){
				for (var e in _e){
					this.Bind(e, _e[e]);
				}
				return;
			}

			var $this = this;

			if (!is_object(params)){
				_views.Bind(_e, function(e, elem){
					if (is_callable(params)){
						params(e, elem);
					}
					else{
						$this[params]();
					}
				});
				return;
			}

			for (var name in params){
				_views.Bind(_e, name, function(e, elem){
					var method = params[name];

					if (is_callable(method)){
						method(e, elem);
					}
					else{
						$this[method]();
					}
				});
			}
		};
	},

	// Game Process
	EnterPlayersCount: function(action, cancel){
		this.Render('enter_number', {
			title: 'Введите кол-во игроков:',
			target: 'players_count',
			action: action,
			cancel: cancel
		});
	},
	Create: function(){
		this.map = new this.Map();
		var map_params = this.Start();
		var step_params = this.Step();

		step_params.map = map_params;
		step_params.description.types = this.rules.getReceipts();
		this.Render('main', step_params);
	},
	NewGame: function(){
		var map_params = this.Start();
		var step_params = this.Step();
		step_params.map = map_params;
		this.Render('new_game', step_params);
	},
	NextStep: function(){
		this.Render('next_step', this.Step());
	},

	// Start

	CreatePlayers: function(count){
		this.players = this.Player.prototype.Create(this, count);
	},
	Start: function(){
		this.CreatePlayers(this.getPlayersCount());
		this.rules = new this.Rules();
		this.map.Generate(this.rules);

		return {
			object_types: this.map.getTypes(),
			data: this.map.data,
			resources: this.map.res_data,
			width: this.map.getWidth(),
			height: this.map.getHeight()
		};
	},

	// Step

	setNextPlayer: function(order){
		if (order === undefined) order = 1;

		if (order > 0)
			this.current_player_index++;
		else
			this.current_player_index--;

		var count = this.getPlayersCount();

		if (this.current_player_index === count){
			this.current_player_index = 0;
			return true;
		}
		if (this.current_player_index < 0){
			this.current_player_index = count - 1;
			return true;
		}

		return false;
	},
	CheckPlayerIndex: function(order){
		this.current_player_index = order < 0 ? this.getPlayersCount() - 1 : 0;
	},
	Step: function(){
		var rule = this.rules.getCurrentRule();

		if (this.setNextPlayer(rule.order))// round ended
		{
			this.rules.setNextRound();
			rule = this.rules.getCurrentRule();
			this.CheckPlayerIndex(rule.order);
		}

		this.setCurrentPlayer();
		var p = this.getCurrentPlayer();

		return {
			header: {step: false, start: !p.ai},
			message: {
				text: p.getRoundMessage(),
				ms: p.getMessageTimeout()
			},
			is_human: !p.ai,
			map: {hover: false},
			description: p.Step(rule)
		};
	},

	toggleObjectDescription: function(name, enable){
		this.views[(enable ? 'enable' : 'disable')+'Object'](name);
	},
	hideHoverTable: function(elem){
		this.views.toggle_hover_table(elem, false);
		this.current_object_type = null;
	},

	// Getters & Setters
	getCurrentPlayer: function(){
		return this.current_player;
	},
	setCurrentPlayer: function(){
		this.current_player = this.players[this.current_player_index];
	},

	getPlayersCount: function(){
		return this.players_count;
	},
	setPlayersCount: function(count){
		count = +count;
		if (!count || count < 2) return false;
		this.players_count = count;
		return true;
	},

	getCurrentObjectType: function(){
		return this.current_object_type;
	},
	setCurrentObjectType: function(o){
		this.current_object_type = o;
	},

	setObject: function(e, elem){
		if (!this.current_object_type || this.views.ObjectIsSet(elem)) return;
		this.views.setObject(elem);
		this.current_player.AddObject(this.current_object_type);
		this.current_player.Step();
	},

	// Filter
	setFilter: function(type){
		this.views.setFilter(this.views.getDescrElem(type));
	}
};
