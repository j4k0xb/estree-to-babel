'use strict';

const {ObjectMethod} = require('@babel/types');

const {assign} = Object;

module.exports = (properties) => {
    // eslint-disable-next-line
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
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
    return {
        start: key.loc.start,
        end: value.loc.end,
    };
}

