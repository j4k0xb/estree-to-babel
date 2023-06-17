'use strict';

module.exports = (node) => {
    const {assertions = []} = node;
    node.assertions = assertions;
};
