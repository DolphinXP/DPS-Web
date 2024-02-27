export default class MyContextMenuProvider {
    constructor(eventBus, contextMenu, translate) {
        this.eventBus = eventBus;
        this.translate = translate;

        contextMenu.registerProvider(this);
    }

    getContextPadEntries(element) {
        return function (entries) {
            delete entries["replace"];
            delete entries["append.gateway"];
            delete entries["append.intermediate-event"];

            return entries;
        };
    }
}

MyContextMenuProvider.$inject = ["eventBus", "contextPad", "translate"];
