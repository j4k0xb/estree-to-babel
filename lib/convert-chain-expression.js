'use strict';

module.exports = ({expression}) => {
    if (expression.type === 'CallExpression')
        expression.type = 'OptionalCallExpression';
    else
        expression.type = 'OptionalMemberExpression';
    
    return expression;
};
