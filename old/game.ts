import { Rules, IDice } from './rules';
import { Player } from './player';
import { Map } from './map';

export class Game {

    currentPlayerIndex = -1;

    currentObjectType = '';
    map = null;
    objects = {};

    rules: Rules | null = null;
    players: Player[] = [];

    // Players

    createPlayers(count: number) {
        this.currentPlayerIndex = -1;
        this.players = Player.create(this, count);
    }

    // Game Process

    create(players_count, width, height) {
        this.rules = new Rules(width, height);
        this.map = new Map({
            parent: this,
            rules: this.rules
        });

        this.createPlayers(players_count);

        this.Render('main', {
            map: this.map.Generate(),
            description: {types: this.rules.getRecipes()}
        });
    }

    NewGame(players_count: number, width: number, height: number) {
        this.rules.setSize(width, height);
        this.createPlayers(players_count);
        this.Render('new_game', { map: this.map.Generate()});
    }

    dice: IDice;

    Step() {
        this.rules.step += 1;
        const rule = this.rules.getCurrentRule();

        this.currentPlayerIndex = rule.order < 0 ? this.players.length - 1 : 0;
        const currentPlayer = this.getCurrentPlayer();

        if (rule.type === 'prepare') {
            return;
        }

        this.dice = this.rules.getNextDigit();

        const cells = this.map.getCellsByDice(digit);

        for (const coo in cells) {
            objects = this.getObjects(coo);
            res = cells[coo].type;

            for (const i in objects) {
                bonus = this.rules.getBonuses(objects[i].type);

                if (bonus)
                    objects[i].owner.AddRes(res, bonus.resources);
            }
        }

        this.CheckEnabledObjects(rule);

        this.SubStep({ rule, message: true, dice });
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    SubStep(o) {
        o = o || {};
        const step_params = .Step(o.rule);

        if (o.is_human === undefined) o.is_human = !this.getCurrentPlayer().ai;

        if (o.message) {
            o.message = {
                text: o.message.text === undefined ? this.getCurrentPlayer().getRoundMessage() : o.message.text,
                ms: o.message.ms === undefined ? this.getCurrentPlayer().getMessageTimeout() : o.message.ms
            };
        }

        this.Render('next_step', $.extend(o, {
            header: {
                start: o.is_human,
                step: o.is_human && (!this.rules.getPrepareStep() || !step_params.enabled.length)
            },
            map: { hover: false },
            description: step_params,
            actual: {
                objects: this.getCurrentPlayer().resources,
                exchange: this.getCurrentPlayer().getExchange()
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
            if (this.map.getData(coo_arr[i]))
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

    Exchange(type1, type2) {
        this.getCurrentPlayer().Exchange(type1, type2);
        this.CheckEnabledObjects();
        this.SubStep();
    }

    getCurrentObjectType() {
        return this.currentObjectType;
    }

    setCurrentObjectType(type) {
        this.currentObjectType = type;
    }

    CheckEnabledObjects(rule) {
        const p = this.getCurrentPlayer();
        p.setRule(rule);
        p.CheckObjects();
        p.setEnabled( this.Render('check_enabled_objects', {enabled: p.getEnabled(), filtered: p.getFiltered()}) );
    }
};
