var initialParams = function(app){
	this.name = 'initial_params';
	
	app.render(this.name, {
		show: true,
		cls: '',
		title: 'Введите кол-во игроков',
		cancel: false,
		url: '/game/create',
		validator: function(){}
	});
};
initialParams.prototype = {
	run: function(){
		__server.msg(this.name+' run');
	}
};

module.exports = initialParams;