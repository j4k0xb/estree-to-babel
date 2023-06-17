'use strict';

const {assign} = Object;

module.exports = (node) => {
    const {assertions = []} = node;
    
    assign(node, {
        assertions,
    });
};
