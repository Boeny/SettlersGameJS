window.Views = {
    opened_menu: null,

    Trigger: function(event_name, elem) {
        $(elem || document).trigger(event_name);
    },
    setElements: function(names) {
        for (const i in names) {
            this[i] = $(names[i]);
        }
    },

    isDisabled: function(elem) {
        return $(elem).is('.disabled');
    },
    enable: function(elem) {
        $(elem).removeClass('disabled');
    },
    disable: function(elem) {
        $(elem).addClass('disabled');
    },
    toggle: function(elem, show) {
        this[show ? 'enable' : 'disable'](elem);
    },

    getType: function(elem) {
        return $(elem).attr('data-type');
    },
    setType: function(elem, type) {
        $(elem).attr('data-type', type);
    },
    removeType: function(elem) {
        $(elem).removeAttr('data-type');
    },

    toggleModalMessage: function(elem, show) {
        this[(show ? 'show' : 'hide')+'ModalMessage'](elem);
    },
    showModalMessage: function(elem) {
        $(elem).removeClass('hidden');
    },
    hideModalMessage: function(elem) {
        $(elem).addClass('hidden');
    },
    message: function(o) {
        const elem = this.message_elem;

        if (o.text) {
            if (elem) {
                elem.html(o.text);
                this.showModalMessage(elem);
            }
            else{
                elem = $(this.html.span(o.text, {'class': 'modal-message msg'}));
                this.main_elem.append(elem);
                this.message_elem = elem;
            }
        }

        const $this = this;
        setTimeout(function() {$this.hideModalMessage(elem); (o.success && o.success())}, o.ms || 1000);
    },
    enter_string: function(o) {
        const elem = this.prompt_elem;

        if (elem) {
            if (o.cls) elem.removeClass().addClass('modal-message prompt '+cls);
            elem.attr('data-validator', o.validator);
            elem.data('action', o.action);
            elem.find('.title').html(o.title);

            this.showModalMessage(elem);
        }
        else{
            elem = $(this.html.div({
                'class': 'modal-message prompt'+(o.cls ? ' '+o.cls : ''),
                'data-validator': o.validator,
                'data-action': o.action,

                content: this.html.div({'class': 'overlay'})+
                    this.html.div(
                        this.html.div(o.title, {'class': 'title'})+
                        this.html.form(
                            this.html.div(this.html.input({value: 2, required: 'required'}))+
                            this.html.div(this.html.select({5:5,6:6,7:7,8:8,9:9,10:10})+this.html.select({5:5,6:6,7:7,8:8,9:9,10:10}))+
                            this.html.div(this.html.button('OK', {type: 'submit', 'class': 'btn'})+this.html.span('Отмена', {'class': 'btn cancel'}))
                        ),
                        {'class': 'container'}
                    )
            }));

            this.main_elem.append(elem);
            this.prompt_elem = elem;
        }

        const cancel_btn = elem.find('.cancel');
        const overlay = elem.find('.overlay');

        if (o.cancel) {
            cancel_btn.show();
            cancel_btn.attr('data-cancel',1);
            overlay.attr('data-cancel',1);
        }
        else{
            cancel_btn.hide();
            cancel_btn.removeAttr('data-cancel');
            overlay.removeAttr('data-cancel');
        }

        if (o.focus) elem.find('[type="text"]').focus();
    },

    toggleMenu: function(elem) {
        if (this.opened_menu) {
            this.dropup();
        }
        else{
            this.dropdown(elem);
        }
    },
    dropdown: function(elem) {
        this.opened_menu = $(elem).next();
        this.opened_menu.slideDown();
    },
    dropup: function() {
        if (!this.opened_menu) return;
        this.opened_menu.slideUp();
        this.opened_menu = null;
    },

    // Game

    main: function(o) {
        this.main_elem.append(
            this.html.div({
                'class': 'header',

                content: this.html.button('Новая игра', {'class': 'start_btn btn'})+
                    this.html.button('Завершить ход', {'class': 'step_btn btn disabled'})
            })+
            this.html.div({
                'class': 'game_field',

                content: this.html.div({
                        'class': 'map_container',
                        content: this.html.div({'class': 'map'})
                    })+
                    this.html.div({'class': 'actual'})
            })+
            this.html.div({
                'class': 'bottom',

                content: this.html.div({'class': 'description'})
            })
        );

        this.setElements({
            header_elem: '.header',
            map_elem: '.map',
            descr_elem: '.description',
            act_elem: '.actual'
        });

        this.setActualData(o.actual);
        this.setDescrData(o.description);
        this.new_game(o);
    },
    new_game: function(o) {
        this.setMapData(o.map);
        this.Trigger('next_step');
    },
    next_step: function(o) {
        this.dropup();// close any menu if opened
        this.map.ToggleHover(o.map.hover);

        o.header = o.header || {};
        for (const name in o.header) {
            this.toggle($('.'+name+'_btn'), o.header[name]);
        }

        _Error.ThrowTypeIf(!o.is_human && o.description.enabled.length, 'all must be disabled while comp is stepping', 'views.next_step');

        this.description.Toggle(o.description.enabled);
        this.description.Filter(o.description.filtered);

        if (o.is_human) this.actual.setObjects(o.actual);

        if (o.message) {
            const $this = this;

            o.message.success = function() {
                $this.showDice(o.dice);

                if (!o.is_human) {
                    $this.Trigger('next_step');
                }
            };

            this.message(o.message);
        }
    },

    // Map

    setMapData: function(params) {
        const o = $.extend({},params);
        o.parent = this;
        o.DOM = this.map_elem;
        o.html = this.html;
        this.map = new this.Map(o);
    },
    CheckFilter: function(elem) {
        const type = this.getType(elem);
        _Error.ThrowTypeIf(!type, 'cell has no type');
        this.map.setType(type);

        if (this.needFilter(elem)) {
            this.map.CreateNearest(type);
        }
        else
            this.map.CreateHovers(type);
    },
    toggleHoverTable: function(elem, old_type) {
        const type = this.getType(elem);
        const show = old_type !== type;

        if (show) {
            this.CheckFilter(elem);
        }

        this.map.ToggleHover(type, show);
        return show ? type : null;
    },
    check_enabled_objects: function(o) {
        this.description.Filter(o.filtered);

        const objects = this.description.getElem();
        const result = [];
        const type;

        for (const i in o.enabled) {
            type = o.enabled[i];

            if (!this.needFilter(objects[type]) || this.map.getNearest(type).length) {
                result.push(type);
            }
        }

        return result;
    },

    // Description

    setDescrData: function(params) {
        const o = $.extend({},params);
        o.parent = this;
        o.DOM = this.descr_elem;
        o.html = this.html;
        this.description = new this.Description(o);
    },

    // Actual

    setActualData: function(params) {
        const o = $.extend({},params);
        o.parent = this;
        o.DOM = this.act_elem;
        o.html = this.html;
        this.actual = new this.Actual(o);
    },

    // Filter

    needFilter: function(elem) {
        return $(elem).is('.filtered');
    },
    setFilter: function(elem) {
        $(elem).addClass('filtered');
    },
    toggleFilter: function(elem, filter) {
        this[filter ? 'setFilter' : 'removeFilter'](elem);
    },
    removeFilter: function(elem) {
        $(elem).removeClass('filtered');
    },

    showDice: function(digit) {
        if (digit) this.map.showDice(digit);
    }
};
