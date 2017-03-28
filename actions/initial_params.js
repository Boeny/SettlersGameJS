module.exports = function(app){
	this.app = app;
};

module.exports.prototype = {
	run: function(){
		this.app.render('initial_params', {
			show: true,
			cls: '',
			title: 'Введите кол-во игроков',
			cancel: false,
			url: '/game/create',
			validator: function(){}
		});
	}
};