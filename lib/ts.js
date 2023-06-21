'use strict';

module.exports.convertTSClassImplements = (node) => {
    node.type = 'TSExpressionWithTypeArguments';
};

module.exports.convertPropertyDefinition = (node) => {
    if (node.key.type === 'PrivateIdentifier') {
        const {key} = node;
        
        node.type = 'ClassPrivateProperty';
        node.key = createPrivateName(key);
        
        return;
    }
    
    node.type = 'ClassProperty';
};

module.exports.convertTSInterfaceHeritage = (node) => {
    node.type = 'TSExpressionWithTypeArguments';
    
    let {expression} = node;
    
    while (expression.type === 'MemberExpression') {
        const {object, property} = expression;
        
        expression.type = 'TSQualifiedName';
        expression.left = object;
        expression.right = property;
        
        delete expression.object;
        delete expression.property;
        
        expression = object;
    }
};

module.exports.convertPrivateIdentifier = (node) => createPrivateName(node);

module.exports.convertTSAbstractMethodDefinition = (node) => {
    const {
        generator,
        async,
        params,
        id,
        returnType,
    } = node.value;
    
    const newNode = {
        ...node,
        abstract: true,
        generator,
        async,
        params,
        id,
        returnType,
        type: 'TSDeclareMethod',
    };
    
    delete newNode.value;
    
    return newNode;
};

function createPrivateName(node) {
    return {
        type: 'PrivateName',
        id: {
            ...node,
            type: 'Identifier',
        },
        loc: node.loc,
    };
}
