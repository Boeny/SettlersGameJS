window.Map = function(){
	
};
Map.prototype = {
	Generate: function(){
		this.rules = new Rules();
		this.data = [];
		
		for (var i=0; i<this.rules.height; i++)
		{
			var row = [];
			
			for (var j=0; j<this.rules.width; j++){
				row.push(this.rules.getRandomRes(i,j));
			}
			
			this.data.push(row);
		}
		
		return this.data;
	}
};
















