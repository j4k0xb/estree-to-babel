'use strict';

const isString = (a) => typeof a === 'string';
const isNumber = (a) => typeof a === 'number';
const isNull = (a) => a === null;
const isBool = (a) => typeof a === 'boolean';

module.exports = (node) => {
    const {value} = node;
    
    setEsprimaRaw(node);
    
    if (isNull(value)) {
        node.type = 'NullLiteral';
        return;
    }
    
    if (isString(value)) {
        node.type = 'StringLiteral';
        return;
    }
    
    if (isNumber(value)) {
        node.type = 'NumericLiteral';
        return;
    }
    
    if (isBool(value)) {
        node.type = 'BooleanLiteral';
        return;
    }
    
    if (node.regex) {
        transformRegExp(node);
        return;
    }
};

function transformRegExp(node) {
    node.type = 'RegExpLiteral';
    
    Object.assign(node, node.regex);
    
    delete node.regex;
}

// avoid additional traversing in @putout/engine-parser
// add "raw" field, that exists in all ESTREE AST
// but located in "extra.raw" in BABEL AST
// which makes writing transforms more long and error prone
function setEsprimaRaw(node) {
    const {raw} = node;
    
    node.raw = raw || node.extra?.raw;
    node.extra = node.extra || {
        raw,
    };
}
