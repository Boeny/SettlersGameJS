window.Map = function(){
	
};
Map.prototype = {
	getRandomCell: function(){
		var cell = {
			width: this.rules.cell.width,
			height: this.rules.cell.height,
			resource: this.rules.getRandomRes()
		};
		
		cell.color = cell.resource.color;
		
		return cell;
	},
	Generate: function(){
		this.rules = new Rules();
		this.data = [];
		debugger;
		for (var i=0; i<this.rules.height; i++)
		{
			var row = [];
			
			for (var j=0; j<this.rules.width; j++){
				row.push(this.getRandomCell());
			}
			
			this.data.push(row);
		}
		
		return this.data;
	}
};
















