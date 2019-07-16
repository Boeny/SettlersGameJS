
export class Game {

    constructor(o) {
        this.players = [];
        this.current_player = null;
        this.current_player_index = -1;

        this.current_object_type = '';
        this.map = null;
        this.rules = null;
        this.objects = {};

        const validation = o.validation;

        this.Validate = function (v, type) {
            return validation ? this.rules.Validate(v, type) : v;
        };

        const _views = o.views;

        this.Render = function (name, o) {
            return _views[name](o);
        };

        this.EnterPlayersCount('Create');
    }

    // Players

    CreatePlayers(count) {
        this.current_player_index = -1;
        this.players = this.Player.prototype.Create(this, count);
    }

    getCurrentPlayer() {
        return this.Validate(this.current_player, 'current_player');
    }

    setCurrentPlayer() {
        this.current_player = this.players[this.current_player_index];
    }

    getPlayersCount() {
        return this.players.length;
    }

    ValidatePlayersCount(count) {
        count = +count;
        return count && count > 1;
    }

    // Game Process

    EnterPlayersCount(action, cancel) {
        this.Render('enter_string', {
            title: 'Введите кол-во игроков:',
            validator: 'ValidatePlayersCount',
            action: action,
            cancel: cancel,
            focus: true
        });
    }

    Create(players_count, width, height) {
        this.rules = new this.Rules(width, height);
        this.map = new this.Map({
            parent: this,
            rules: this.rules
        });

        this.CreatePlayers(players_count);

        this.Render('main', {
            map:  this.CreateMap(),
            description: {types: this.Validate(this.rules.getReceipts(), 'receipts')}
        });
    }

    CreateMap() {
        this.map.Generate();

        return this.Validate({
            object_types: this.map.getTypes(),
            data: this.map.getData(),
            resources: this.map.getRes(),
            dices: this.map.getDices(),
            width: this.map.rules.width,
            height: this.map.rules.height
        }, 'map');
    }

    NewGame(players_count, width, height) {
        this.rules.setSize(width, height);
        this.CreatePlayers(players_count);
        this.Render('new_game', {map:  this.CreateMap()});
    }

    // Step

    setNextPlayer(order) {
        if (order > 0)
            this.current_player_index++;
        else
            this.current_player_index--;
    }

    ValidatePlayerIndex(rule) {
        const count = this.getPlayersCount();

        if (this.current_player_index < 0 || this.current_player_index === count) {
            this.rules.setNextRound();
            rule = this.rules.getCurrentRule();

            // initial index depends on order
            this.current_player_index = rule.order < 0 ? count - 1 : 0;
        }

        return rule;
    }

    Step() {
        const rule = this.Validate(this.rules.getCurrentRule(), 'rule');

        this.setNextPlayer(rule.order);
        rule = this.ValidatePlayerIndex(rule);
        this.setCurrentPlayer();

        const dice;
        if (!this.rules.getPrepareStep()) {
            dice = this.rules.getNextDice();
            this.UpdateRes(dice);
        }

        this.CheckEnabledObjects(rule);

        this.SubStep({ rule, message: true, dice });
    }

    SubStep(o) {
        o = o || {};
        const p = this.getCurrentPlayer();
        const step_params = p.Step(o.rule);

        if (o.is_human === undefined) o.is_human = !p.ai;

        if (o.message) {
            o.message = {
                text: o.message.text === undefined ? p.getRoundMessage() : o.message.text,
                ms: o.message.ms === undefined ? p.getMessageTimeout() : o.message.ms
            };
        }

        this.Render('next_step', $.extend(o, {
            header: {
                start: o.is_human,
                step: o.is_human && (!this.rules.getPrepareStep() || !step_params.enabled.length)
            },
            map: {hover: false},
            description: step_params,
            actual: {
                objects: p.getRes(),
                exchange: p.getExchange()
            }
        }));
    }

    // Interaction

    setObject(coo) {
        const p = this.getCurrentPlayer();
        const type = this.getCurrentObjectType();

        p.AddObject(type);
        this.CheckEnabledObjects();
        this.AddObject(coo, type, p);

        // close hovers at the next substep
        this.setCurrentObjectType(null);

        // if preparing step and all objects are set -> next nonhuman substep, redirecting to the next game step
        const params = {};
        if (this.rules.getPrepareStep() && !p.hasRuleObjects()) {
            params.is_human = false;
            params.message = {text: ''};
        }

        this.SubStep(params);
    }

    AddObject(coo, type, owner) {
        coo = coo.split('-');
        const coo_arr = [[coo[0],coo[1]], [coo[0]-1,coo[1]], [coo[0],coo[1]-1], [coo[0]-1,coo[1]-1]];

        for (const i in coo_arr) {
            if (this.map.getRes(coo_arr[i]))
            {
                coo = coo_arr[i].join('-');

                if (!this.objects[coo])
                    this.objects[coo] = [];

                this.objects[coo].push({
                    type: type,
                    owner: owner
                });
            }
        }
    }

    getObjects(coo) {
        return this.objects[coo];
    }

    UpdateRes(digit) {
        const cells = this.map.getCellsByDice(digit);
        const objects, res, bonus;

        for (const coo in cells) {
            objects = this.getObjects(coo);
            res = cells[coo].type;

            for (const i in objects) {
                bonus = this.rules.getBonuses(objects[i].type);

                if (bonus)
                    objects[i].owner.AddRes(res, bonus.resources);
            }
        }
    }

    Exchange(type1, type2) {
        this.getCurrentPlayer().Exchange(type1, type2);
        this.CheckEnabledObjects();
        this.SubStep();
    }

    getCurrentObjectType() {
        return this.current_object_type;
    }

    setCurrentObjectType(type) {
        this.current_object_type = type;
    }

    CheckEnabledObjects(rule) {
        const p = this.getCurrentPlayer();
        p.setRule(rule);
        p.CheckObjects();
        p.setEnabled( this.Render('check_enabled_objects', {enabled: p.getEnabled(), filtered: p.getFiltered()}) );
    }
};
