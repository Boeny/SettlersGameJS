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
			var $this = this;
			for (var name in params){
				this.views.Bind(event, name, function(e, elem){
					$this[params[name]](e, elem);
				});
			}
		}
	},

	// Events
	StartAndStep: function(){
		this.Start();
		this.Step();
	},
	ShowSelectableFields: function(e, elem){
		this.Render('show_hover_table', elem);
	},

	Message: function(text, ms){
		this.Render('message', {text: text, ms: ms});
	},

	CreatePlayers: function(){
		var count = this.Render('enter_number', 'Введите кол-во игроков:');

		this.players = Player.prototype.Create(this, count);
		this.current_player = -1;
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

	// Game Process
	setNextPlayer: function(order){
		if (order === undefined) order = 1;

		if (order > 0) this.current_player++;
		else if(order < 0) this.current_player--;

		if (this.current_player >= this.players.length){
			this.current_player = 0;
			return true;
		}
		if (this.current_player < 0){
			this.current_player = this.players.length-1;
			return true;
		}

		return false;
	},
	Step: function(){
		this.Render('hide_hover_table');
		this.toggleTurnButton(false);

		var rule = this.rules.getCurrentRule();

		if (this.setNextPlayer(rule.order))// round ended
		{
			this.rules.setNextRound();
			rule = this.rules.getCurrentRule();
			this.current_player = rule.order < 0 ? this.players.length-1 : 0;
		}

		var p = this.players[this.current_player];
		var $this = this;

		if (p.ai) this.disableObject();

		this.Message(p.ai ? 'Ходит игрок №'+(p.index+1) : 'Ваш ход', function(){
			p.Step(rule);

			if (p.ai) $this.Step();
		});
	},

	// Craftable Objects
	enableObject: function(res_name){
		this.Render('enableObject', res_name);
	},
	disableObject: function(res_name){
		this.Render('disableObject', res_name);
	},
	toggleTurnButton: function(show){
		this.Render('toggleTurnButton', show);
	}
};
