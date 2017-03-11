window.Canvas = function(o){
	this.canvas = $(o.elem)[0].getContext('2d');
	this.canvas.params = o;
	
	if (o.width) this.canvas.lineWidth = o.width;
	this.setColor(o.color);
	if (!o.render) this.canvas.beginPath();
};
Canvas.prototype = {
	setColor: function(color){
		if (!color) return;
		var tmp = is_object(color) ? color : {fill: color, stroke: color};
		if (tmp.stroke) this.canvas.strokeStyle = tmp.stroke;
		if (tmp.fill) this.canvas.fillStyle = tmp.fill;
	},
	render: function(){
		this.canvas.closePath();
		this.canvas.stroke();
	},
	drawLine: function(x1, y1, x2, y2, color, width){
		this.setColor(color);
		if (width) this.canvas.lineWidth = width;
		if (this.canvas.params.render) this.canvas.beginPath();
		
		this.canvas.moveTo(x1+0.5, y1+0.5);
		this.canvas.lineTo(x2+0.5, y2+0.5);
		
		if (this.canvas.params.render) this.render();
	},
	drawLineTo: function(x, y, init_x, init_y){
		if (init_x) this.init_line_x = init_x;
		if (init_y) this.init_line_y = init_y;
		
		this.drawLine(this.init_line_x, this.init_line_y, x, y);
		
		this.init_line_x = x;
		this.init_line_y = y;
	},
	drawLines: function(lines){
		var l;
		for (var i in lines){
			l = lines[i];
			this.drawLine(l[0], l[1], l[2], l[3], l[4], l[5]);
		}
	},
	drawRect: function(x1, y1, x2, y2, color){
		this.setColor(color);
		if (this.canvas.params.render) this.canvas.beginPath();
		
		this.canvas.fillRect(x1+0.5, y1+0.5, x2+0.5, y2+0.5);
		
		if (this.canvas.params.render) this.render();
	},
	drawText: function(text, x, y, font, color){
		this.setColor(color);
		if (font) this.canvas.font = font;
		this.canvas.fillText(text, x, y);
	},
	drawTexts: function(texts){
		var t;
		for (var i in texts){
			t = texts[i];
			this.drawText(t[0], t[1], t[2], t[3], t[4]);
		}
	},
	
	drawSymbol: function(max_lines, max_length, modify_id){
		if (modify_id) this.id += max_lines;
		
		var max = max_length || 50;
		this.init_line_x = max_length ? random(max/4,3*max/4) : random(1,max);
		this.init_line_y = max_length ? random(max/4,3*max/4) : random(1,max);
		
		if (modify_id) this.id += Math.round(this.init_line_x) + Math.round(this.init_line_y);
		
		max_lines = random(3,max_lines);
		
		if (modify_id) this.id += max_lines;
		
		iterate(max_lines, (i) => {
			var x = this.init_line_x;
			var y = this.init_line_y;
			var x1 = max_length ? random(x-max/2,x+max/2) : random(1,max);
			var y1 = max_length ? random(y-max/2,y+max/2) : random(1,max);
			
			var dx = x1 - x;
			var dy = y1 - y;
			var adx = Math.abs(dx);
			var ady = Math.abs(dy);
			
			if (adx < ady/4 || adx > 3*ady/4){
				if (adx < ady/4)
					x1 = x;
				else
					y1 = y;
			}
			else{
				x1 = x + dx;
				y1 = y + dy;
			}
			
			this.id += Math.round(x1) + Math.round(y1);
			this.drawLineTo(x1, y1);
		});
	}
}

$(function(){
	var c = new Canvas({elem: $('#canvas'), color: '#333', width: 3, render: true});
	
	c.id = 0;
	c.drawSymbol(5);
	
	var id2 = [Math.abs(c.id)];
	c.id = 0;
	
	iterate(random(3), function(i){
		c.drawSymbol(2, 25);
		id2.push(Math.abs(c.id));
		c.id = 0;
	});
	
	$('#canvas_id').html(id2.join());
});