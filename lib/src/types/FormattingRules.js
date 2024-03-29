import stringifyId from "../core-utils/stringifyId.js";
import RulesLookup from "./RulesLookup.js";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

// TODO: Don't recreate styles if they haven't changed
function indexBorders(style, index) {
    const newStyle = { ...style };

    if ('border' in newStyle) {
        for (const borderType of borderTypes)
            newStyle[borderType] = newStyle.border;
        delete newStyle.border;
    }

    for (const borderType of borderTypes)
        if (borderType in newStyle)
            newStyle[borderType] = { ...newStyle[borderType], index };

    return newStyle;
}

// TODO: Rename to FormatResolver
// TODO: Optimize by not searching using keys that don't have correlated match rules
// TODO: Accept both a function and an object as a style (where the object is a resolved style)
// TODO: Consider removing index from the lookup
export default class FormattingRules {
    constructor(rules) {
        this.rulesLookup = new RulesLookup();

        for (const [index, rule] of rules.entries()) {
            const entry = { index };
    
            if ('condition' in rule)
                entry.condition = rule.condition;
            if ('style' in rule)
                entry.style = typeof rule.style === 'function' ? rule.style : () => rule.style;
            if ('value' in rule)
                entry.value = typeof rule.value === 'function' ? rule.value : () => rule.value;
            if ('text' in rule)
                entry.text = typeof rule.text === 'function' ? rule.text : () => rule.text;
            if ('edit' in rule)
                entry.edit = rule.edit;
            if ('draw' in rule)
                entry.draw = rule.draw;
    
            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    resolve(data, rows, columns, row, column, edition) {
        const rules = this.rulesLookup.getRules(column, row);

        rules.sort((a, b) => a.index - b.index);

        let context = { data, rows, columns, row, column };
        let style = {};
        let draw = undefined;
        let visible = true;

        if (edition.hasValueByKey(row.key, column.key))
            context = { ...context, newValue: edition.getValueByKey(row.key, column.key) };

        for (const rule of rules) {
            if ('condition' in rule && !rule.condition(context))
                continue;

            if ('value' in rule)
                context = { ...context, value: rule.value(context) };
            if ('style' in rule)
                style = { ...style, ...indexBorders(rule.style(context), rule.index) };
            if ('text' in rule)
                context = { ...context, text: rule.text(context) };
            if ('edit' in rule)
                context = { ...context, edit: rule.edit };
            if ('draw' in rule) {
                const currentContext = context;
                draw = (ctx) => rule.draw({ ...currentContext, ctx });
            }

            // TODO: Add StopPropagation
        }

        const text = 'text' in context ? context.text : `${context.value}`;
        const result = {
            style,
            visible,
            text
        };

        if ('value' in context)
            result.value = context.value;
        if ('edit' in context)
            result.edit = context.edit;
        if (draw !== undefined)
            result.draw = draw;
        if ('text' in context)
            result.text = context.text;

        return result;
    }
}