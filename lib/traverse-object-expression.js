'use strict';

const {ObjectMethod} = require('@babel/types');

const {assign} = Object;

module.exports = (properties) => {
    for (const [i, property] of properties.entries()) {
        const {
            computed,
            key,
            value,
        } = property;
        
        if (value?.type === 'FunctionExpression') {
            properties[i] = ObjectMethod('method', key, value.params, value.body, computed);
            
            assign(property, {
                id: null,
                method: true,
                generator: value.generator,
                loc: getObjectMethodLoc(key, value),
                async: value.async,
                type: 'ObjectMethod',
            });
        }
    }
};

function getObjectMethodLoc(key, value) {
    if (key.loc && value.loc)
        return {
            start: key.loc.start,
            end: value.loc.end,
        };
}

