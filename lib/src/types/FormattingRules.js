import { defaultFont, defaultPadding } from "../core-utils/defaults.js";
import getResolvedFunction from "../state-utils/getResolvedFunction.js";
import Edition from "./Edition.js";
import RulesLookup from "./RulesLookup.js";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

// TODO: better handle default validate for toggle edit
/** @type {Edit} */
const defaultEdit = { validate: () => true, parse: ({ string }) => string };

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

function getText(context) {
    if ('text' in context)
        return `${context.text}`;
    if ('newValue' in context)
        return `${context.newValue}`;
    if (context.value !== undefined)
        return `${context.value}`;
    return '';
}

function getEdit(rule, context) {
    if (rule.edit === false)
        return undefined;
    if (rule.edit === true)
        return 'edit' in context ? context.edit : defaultEdit;
    if ('edit' in context)
        return { ...context.edit, ...rule.edit };
    return { ...defaultEdit, ...rule.edit };
}

// TODO: Rename to FormatResolver
// TODO: Optimize by not searching using keys that don't have correlated type rules
// TODO: Accept both a function and an object as a style (where the object is a resolved style)
// TODO: Consider removing index from the lookup
export default class FormattingRules {
    /**
     * @param {Rule[]} rules
     */
    constructor(rules) {
        /** @type {RulesLookup<FormattingRule>} */
        this.rulesLookup = new RulesLookup();

        for (const [index, rule] of rules.entries()) {
            /** @type {FormattingRule} */
            const entry = { index };

            // TODO: Mark which rules are actually present and only check those in resolve
            if ('condition' in rule)
                entry.condition = rule.condition;
            if ('style' in rule)
                entry.style = getResolvedFunction(rule.style);
            if ('value' in rule)
                entry.value = getResolvedFunction(rule.value);
            if ('text' in rule)
                entry.text = getResolvedFunction(rule.text);
            if ('font' in rule)
                entry.font = getResolvedFunction(rule.font);
            if ('padding' in rule)
                entry.padding = getResolvedFunction(rule.padding);
            if ('edit' in rule)
                entry.edit = rule.edit;
            if ('tooltip' in rule)
                entry.tooltip = getResolvedFunction(rule.tooltip);
            if ('draw' in rule)
                entry.draw = rule.draw;

            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    /**
     * @param {Data} data
     * @param {ResolvedRow[]} rows
     * @param {ResolvedColumn[]} columns
     * @param {ResolvedRow} row
     * @param {ResolvedColumn} column
     * @param {Edition} edition
     * @returns {Cell}
     */
    resolve(data, rows, columns, row, column, edition) {
        const rules = this.rulesLookup
            .getRules(column, row)
            .sort((a, b) => a.index - b.index)
            .filter((value, index, array) => value.index !== array[index - 1]?.index);

        /** @type {FunctionContext} */
        let context = { data, rows, columns, row, column };
        let style = {};
        /** @type {InternalDrawFunction} */
        let draw = undefined;
        let padding = defaultPadding;
        let font = defaultFont;
        let tooltip = undefined;

        if (edition.hasValueByKey(row.key, column.key))
            context = { ...context, newValue: edition.getValueByKey(row.key, column.key) };

        for (const rule of rules) {
            if ('condition' in rule && !rule.condition(context))
                continue;

            // TODO: Don't actually add things like `edit` to the context
            if ('value' in rule)
                context = { ...context, value: rule.value(context) };
            if ('style' in rule)
                style = { ...style, ...indexBorders(rule.style(context), rule.index) };
            if ('text' in rule)
                context = { ...context, text: rule.text(context) };
            if ('font' in rule)
                font = rule.font(context);
            if ('padding' in rule)
                padding = { ...padding, ...rule.padding(context) };
            if ('edit' in rule)
                context = { ...context, edit: getEdit(rule, context) };
            if ('tooltip' in rule)
                tooltip = rule.tooltip(context);
            if ('draw' in rule) {
                const currentContext = context;
                draw = (ctx) => rule.draw({ ...currentContext, ctx });
            }

            // TODO: Add StopPropagation
        }

        const text = getText(context);

        /** @type {Cell} */
        const result = {
            style,
            text,
            padding,
            font
        };

        if ('value' in context)
            result.value = context.value;
        if ('edit' in context && context.edit !== undefined)
            result.edit = context.edit;
        if (tooltip !== undefined)
            result.tooltip = tooltip;
        if (draw !== undefined)
            result.draw = draw;

        return result;
    }
}