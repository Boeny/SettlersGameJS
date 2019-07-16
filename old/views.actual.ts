
export class ViewsActual {

    constructor(o) {
        $.extend(this, o);
    }

    Create() {
        var content = '';
        var dropmenu;

        for (var type in this.objects) {
            dropmenu = '';

            for (var i in this.exchange[type].res) {
                dropmenu += this.html.div(this.exchange[type].res[i], {'class': 'item', 'data-type': this.exchange[type].res[i]});
            }

            content += this.html.div(
                this.html.div(this.html.span(type)+' '+this.html.span(this.objects[type], {'class': 'pull-right'}), {'class': 'res_info', 'data-type': type})+
                this.html.button({
                    'class': 'exchange_btn btn' + (this.objects[type] < this.exchange[type].count ? ' hidden' : ''),
                    'data-source': type,
                    content: 'exchange '+this.exchange[type].count+':1'
                })+
                this.html.div(dropmenu, {'class': 'menu abs right hidden'})+
                this.html.div({'class': 'clearfix'}),

                {'class': 'rel'}
            );
        }

        this.DOM.html(content);
    }

    setObjects(o) {
        $.extend(this, o);
        this.Create();
    }
}
