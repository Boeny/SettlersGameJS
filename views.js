window.Views = {
	description: function(){
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
