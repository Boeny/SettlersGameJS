var initialParams = function(){
	this.name = 'initial_params';
	
	__app.render(this.name, {
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
		__app.msg(this.name+' run');
	}
};

module.exports = initialParams;