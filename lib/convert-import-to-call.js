'use strict';

const {
    CallExpression,
    Identifier,
} = require('@babel/types');

const setLiteral = require('./set-literal');

module.exports = ({source}) => {
    setLiteral(source);
    
    const callNode = CallExpression(Identifier('import'), [
        source,
    ]);
    
    return callNode;
};

