export default class MyPaletteProvider {
    constructor(eventBus, palette, translate) {
        this.eventBus = eventBus;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        return function (entries) {
            delete entries["hand-tool"];
            delete entries["lasso-tool"];
            delete entries["space-tool"];
            delete entries["create.data-store"];
            delete entries["create.intermediate-event"];
            delete entries["create.group"];
            delete entries["create.participant-expanded"];
            delete entries["create.exclusive-gateway"];
            delete entries["create.data-object"];

            return entries;
        };
    }
}

MyPaletteProvider.$inject = ["eventBus", "palette", "translate"];
