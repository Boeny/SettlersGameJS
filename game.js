window.Game = function(o){
	this.map_elem = this.getElem(o.map);
	this.descr_elem = this.getElem(o.description);
	this.step_elem = this.getElem(o.step_over_button);

	this.map = new Map();

	this.Start();
	this.FillDescription();
	this.Step();
};
Game.prototype = {
	Message: function(text, ms){
		var m = $('.modal-message');

		if (m.length){
			m.removeClass('hidden');
			m.html(text);
		}
		else{
			m = $(Html.span(text, {'class': 'modal-message'}));
			$('body').append(m);
		}

		var success;
		if (is_callable(ms)){
			success = ms;
			ms = null;
		}

		setTimeout(function(){m.addClass('hidden'); (success && success())}, ms || 1000);
	},
	getElem: function(_cls){
		return $('.'+_cls);
	},
	getTable: function(_data){
		var content = '';

		for (var i in _data){
			var row = '';

			for (var j in _data[i]){
				var cell = _data[i][j];
				row += Html.td(cell && cell.name && {'data-name': cell.name, 'data-coo': i+'-'+j} || '');
			}
			content += Html.tr(row);
		}
		return Html.table(content);
	},
	CreatePlayers: function(){
		this.players = [];
		var count = 0;
		while (!count || hasLiterals(count) || count < 1) count = prompt('Введите кол-во игроков:');
		var pc_index = random(0, count-1);

		for (var i=0; i<count; i++){
			this.players.push(new Player({
				index: i,
				ai: i !== pc_index,
				game: this
			}));
		}

		this.current_player = -1;
	},
	Start: function(){
		this.CreatePlayers();
		this.map_elem.html(this.getTable(this.map.Generate()));
		this.CreateHoverTable();
	},

	ClearSelections: function(cls){
		this.map_elem.removeClass().addClass('map'+(cls ? ' '+cls : ''));
	},
	Select: function(type){
		this.ClearSelections(type+'-hover');
	},

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
		this.ClearSelections();
		var rule = this.map.rules.getCurrentRule();

		if (this.setNextPlayer(rule.order))// round ended
		{
			this.map.rules.setNextRound();
			rule = this.map.rules.getCurrentRule();
			this.current_player = rule.order < 0 ? this.players.length-1 : 0;
		}

		var p = this.players[this.current_player];
		var $this = this;

		if (p.ai) this.disableObject();

		this.Message(p.ai ? 'Ходит игрок №'+(p.index+1) : 'Ваш ход', function(){
			$this.step_elem.prop('disabled', p.ai);

			p.Step(rule);

			if (p.ai) $this.Step();
		});
	},

	getDescrElem: function(o){
		if (o){
			return this.descr_elem.find('[data-res="'+obj_keys(o).join('"], [data-res="')+'"]');
		}

		return this.descr_elements;
	},
	enableObject: function(o){
		this.getDescrElem(o).removeClass('disabled');
	},
	disableObject: function(o){
		this.getDescrElem(o).addClass('disabled');
	},

	getCornersHtml: function(corners){
		var types = {vert: ['top','bottom'], hor: ['left','right']};
		var type = {vert: '', hor: ''};
		var content = '';

		for (var i in types.vert){
			type.vert = types.vert[i];
			if (!corners[type.vert]) continue;

			for (var j in types.hor){
				type.hor = types.hor[j];

				if (corners[type.hor]){
					content += Html.div({'class': 'corner '+type.vert+'-'+type.hor, 'data-res': corners.resources[type.vert][type.hor].join('-')});
				}
			}
		}

		return content;
	},
	getLinesHtml: function(lines){
		var types = ['top','bottom','left','right'];
		var type;
		var content = '';

		for (var i in types){
			type = types[i];

			if (lines[type]){
				content += Html.div({'class': 'line line-'+type});
			}
		}

		return content;
	},
	getCell: function(i,j){
		return this.map_elem.find('[data-coo="'+i+'-'+j+'"]');
	},
	AppendCell: function(i, j, html){
		this.getCell(i,j).append(html);
	},
	CreateHoverTable: function(){
		var _data = [];
		var last = this.map.getLastIndex();
		var cell;

		for (var i=0; i<=last.vert; i++){
			for (var j=0; j<=last.hor; j++){
				if (!this.map.isRes(i,j)) continue;

				cell = this.getCell(i,j);
				cell.append(this.getCornersHtml(this.map.getCorners(i,j)));
				cell.append(this.getLinesHtml(this.map.getLines(i,j)));
			}
		}
	},

	FillDescription: function(){
		var receipts = this.map.getReceipts();
		var content = '';
		var res, tmp, title, obj, type;

		for (var i in receipts){
			res = '';

			for (var j in receipts[i]){
				tmp = receipts[i][j];

				for (var k=0; k<tmp.count; k++){
					res += Html.div({'class': 'pull-left', 'data-name': tmp.name});
				}
				title = tmp.title;
				obj = tmp.object;
				type = tmp.type;
			}
			content += Html.div(res+Html.div(title, {'class': 'pull-right'}), {'data-type': type, 'data-res': obj, 'class': 'disabled'});
		}

		this.descr_elem.html(content);
		this.descr_elements = this.descr_elem.find('[data-res]');
	}
};
