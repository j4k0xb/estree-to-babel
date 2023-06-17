'use strict';

const {walk} = require('estree-walker');
const {isExportDeclaration} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');
const setClassMethod = require('./set-class-method');
const setClassPrivateProperty = require('./set-class-private-property');
const setClassPrivateName = require('./set-class-private-name');
const convertImportToCall = require('./convert-import-to-call');
const convertChainExpression = require('./convert-chain-expression');
const convertImportDeclaration = require('./convert-import-declaration');
const convertExportDeclaration = require('./convert-export-declaration');
const {
    convertTSClassImplements,
    convertTSInterfaceHeritage,
    convertTSAbstractMethodDefinition,
    convertPropertyDefinition,
    convertPrivateIdentifier,
} = require('./ts');

const {convertNodeComments} = require('./comments');

const setLiteral = require('./set-literal');
const getAST = require('./get-ast');

module.exports = (node) => {
    const ast = getAST(node);
    
    walk(ast, {
        enter(node) {
            const {type} = node;
            
            if (type.endsWith('Literal')) {
                setLiteral(node);
                return setEsprimaRaw(node);
            }
            
            if (type === 'Property')
                return setObjectProperty(node);
            
            if (type === 'MethodDefinition')
                return this.replace(setClassMethod(node));
            
            if (type === 'FieldDefinition')
                return setClassPrivateProperty(node);
            
            if (type === 'PrivateName')
                return setClassPrivateName(node);
            
            if (type === 'ImportExpression')
                return this.replace(convertImportToCall(node));
            
            if (type === 'ImportDeclaration')
                return convertImportDeclaration(node);
            
            if (isExportDeclaration(node))
                return convertExportDeclaration(node);
            
            if (type === 'ChainExpression')
                return this.replace(convertChainExpression(node));
            
            if (type === 'TSAbstractMethodDefinition')
                return this.replace(convertTSAbstractMethodDefinition(node));
            
            if (type === 'TSInterfaceHeritage')
                return convertTSInterfaceHeritage(node);
            
            if (type === 'PropertyDefinition')
                return convertPropertyDefinition(node);
            
            if (type === 'PrivateIdentifier')
                return this.replace(convertPrivateIdentifier(node));
            
            if (type === 'TSClassImplements')
                return convertTSClassImplements(node);
        },
        leave(node) {
            if (node.type !== 'File')
                convertNodeComments(node);
            
            if (node.type === 'ObjectExpression')
                return traverseObjectExpression(node.properties);
        },
    });
    
    return ast;
};

function setObjectProperty(node) {
    node.type = 'ObjectProperty';
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
