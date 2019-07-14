window.Game = function(o){
	this.Init(o);
	this.EnterPlayersCount('Create');
};
Game.prototype = {
	Init: function(o){
		this.players = [];
		this.current_player = null;
		this.current_player_index = -1;

		this.current_object_type = '';
		this.map = null;
		this.rules = null;

		var validation = o.validation;

		this.Validate = function(v, type){
			return validation ? this.rules.Validate(v, type) : v;
		};

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

	// Players

	CreatePlayers: function(count){
		this.current_player_index = -1;
		this.players = this.Player.prototype.Create(this, count);
	},

	// Game Process
	EnterPlayersCount: function(action, cancel){
		this.Render('enter_string', {
			title: 'Введите кол-во игроков:',
			validator: 'ValidatePlayersCount',
			action: action,
			cancel: cancel,
			focus: true
		});
	},
	Create: function(players_count){
		this.rules = new this.Rules();
		this.map = new this.Map({
			parent: this,
			rules: this.rules
		});

		this.CreatePlayers(players_count);

		this.Render('main', {
			map:  this.CreateMap(),
			description: {types: this.Validate(this.rules.getReceipts(), 'receipts')}
		});
	},
	CreateMap: function(generate){
		if (generate) this.map.Generate(this.rules);

		return this.Validate({
			object_types: this.map.getTypes(),
			data: this.map.getData(),
			resources: this.map.getRes(),
			width: this.map.getWidth(),
			height: this.map.getHeight()
		}, 'map');
	},
	NewGame: function(players_count){
		this.CreatePlayers(players_count);
		this.Render('new_game', {map:  this.CreateMap(true)});
	},

	// Step

	setNextPlayer: function(order){
		if (order === undefined) order = 1;

		if (order > 0)
			this.current_player_index++;
		else
			this.current_player_index--;
	},
	ValidatePlayerIndex: function(rule){
		var count = this.getPlayersCount();

		if (this.current_player_index < 0 || this.current_player_index === count){
			this.rules.setNextRound();
			rule = this.rules.getCurrentRule();

			// initial index depends on order
			this.current_player_index = rule.order < 0 ? count - 1 : 0;
		}
	},

	Step: function(){
		var rule = this.Validate(this.rules.getCurrentRule(), 'rule');
		this.setNextPlayer(rule.order);
		this.ValidatePlayerIndex();

		this.setCurrentPlayer();
		this.SubStep({
			rule: rule,
			message: true
		});
	},
	SubStep: function(o){
		o = o || {};
		var p = this.getCurrentPlayer();
		var step_params = p.Step(o.rule);

		if (o.is_human === undefined) o.is_human = !p.ai;

		if (o.message){
			o.message = {
				text: o.message.text === undefined ? p.getRoundMessage() : o.message.text,
				ms: o.message.ms === undefined ? p.getMessageTimeout() : o.message.ms
			};
		}

		this.Render('next_step', $.extend(o, {
			header: {
				start: o.is_human,
				step: o.is_human && !step_params.enabled.length
			},
			map: {hover: false},
			description: step_params
		}));
	},

	setObject: function(){
		var p = this.getCurrentPlayer();
		p.AddObject(this.getCurrentObjectType());
		this.setCurrentObjectType(null);

		var params = {};
		if (this.rules.getPrepareStep() && !p.getEnabled()){
			params.is_human = false;
			params.message = {text: ''};
		}

		this.SubStep(params);
	},

	// Getters & Setters
	getCurrentPlayer: function(){
		return this.Validate(this.current_player, 'current_player');
	},
	setCurrentPlayer: function(){
		this.current_player = this.players[this.current_player_index];
	},

	getPlayersCount: function(){
		return this.players.length;
	},
	ValidatePlayersCount: function(count){
		count = +count;
		return count && count > 1;
	},

	getCurrentObjectType: function(){
		return this.current_object_type;
	},
	setCurrentObjectType: function(type){
		this.current_object_type = type;
	}
};
