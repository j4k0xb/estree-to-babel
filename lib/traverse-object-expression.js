'use strict';

const {ObjectMethod} = require('@babel/types');

const {assign} = Object;

module.exports = (properties) => {
    // eslint-disable-next-line
    for (let i = 0; i < properties.length; i++) {
        const {
            computed,
            key,
            value,
        } = properties[i];
        
        if (value?.type === 'FunctionExpression') {
            properties[i] = ObjectMethod('method', key, value.params, value.body, computed, value.generator, value.async);
            
            assign(properties[i], {
                id: null,
                method: true,
                loc: getObjectMethodLoc(key, value),
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

