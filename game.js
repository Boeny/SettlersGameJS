window.Game = function(){
	
};
Game.prototype = {
	Start: function(){
		$('.map').html(getTable(this.Generate()));
	}
};