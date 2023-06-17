'use strict';

const {
    classPrivateMethod,
    classMethod,
} = require('@babel/types');

const {assign} = Object;

module.exports = (node) => {
    const {
        key,
        kind,
        computed,
        loc,
    } = node;
    
    const {
        body,
        params,
        expression,
        generator,
    } = node.value;
    
    const method = getClassMethod({
        kind,
        key,
        params,
        body,
        computed,
        nodeStatic: node.static,
    });
    
    assign(method, {
        loc,
        expression,
        generator,
    });
    return method;
};

function getClassMethod({kind, key, params, body, computed, nodeStatic}) {
    if (key.type === 'PrivateName')
        return classPrivateMethod(
            kind,
            key,
            params,
            body,
            computed,
        );
    
    return classMethod(
        kind,
        key,
        params,
        body,
        computed,
        nodeStatic,
    );
}
