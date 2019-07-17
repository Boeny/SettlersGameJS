import { Rules } from './game.rules';
import { Player } from './player';
import { Map } from './map';

export class Game {

    currentPlayer = null;
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

    Step() {
        let rule = this.rules.getCurrentRule();

        this.currentPlayerIndex = rule.order

        const count = this.players.length;

        if (this.currentPlayerIndex < 0 || this.currentPlayerIndex === count) {
            this.rules.setNextRound();
            rule = this.rules.getCurrentRule();

            // initial index depends on order
            this.currentPlayerIndex = rule.order < 0 ? count - 1 : 0;
        }

        this.currentPlayer = this.players[this.currentPlayerIndex];

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
        const step_params = this.currentPlayer.Step(o.rule);

        if (o.is_human === undefined) o.is_human = !this.currentPlayer.ai;

        if (o.message) {
            o.message = {
                text: o.message.text === undefined ? this.currentPlayer.getRoundMessage() : o.message.text,
                ms: o.message.ms === undefined ? this.currentPlayer.getMessageTimeout() : o.message.ms
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
                objects: this.currentPlayer.resources,
                exchange: this.currentPlayer.getExchange()
            }
        }));
    }

    // Interaction

    setObject(coo) {
        const p = this.currentPlayer;
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
        this.currentPlayer.Exchange(type1, type2);
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
        const p = this.currentPlayer;
        p.setRule(rule);
        p.CheckObjects();
        p.setEnabled( this.Render('check_enabled_objects', {enabled: p.getEnabled(), filtered: p.getFiltered()}) );
    }
};
