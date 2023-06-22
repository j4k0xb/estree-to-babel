'use strict';

const {walk} = require('estree-walker');

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

const transforms = {
    ChainExpression: convertChainExpression,
    ExportAllDeclaration: convertExportDeclaration,
    ExportDefaultDeclaration: convertExportDeclaration,
    ExportNamedDeclaration: convertExportDeclaration,
    FieldDefinition: setClassPrivateProperty,
    ImportDeclaration: convertImportDeclaration,
    ImportExpression: convertImportToCall,
    Literal: setLiteral,
    MethodDefinition: setClassMethod,
    ObjectExpression: traverseObjectExpression,
    PrivateIdentifier: convertPrivateIdentifier,
    PrivateName: setClassPrivateName,
    Property: setObjectProperty,
    PropertyDefinition: convertPropertyDefinition,
    TSAbstractMethodDefinition: convertTSAbstractMethodDefinition,
    TSClassImplements: convertTSClassImplements,
    TSInterfaceHeritage: convertTSInterfaceHeritage,
    // compatibility when using babel ast as input
    BigIntLiteral: setEsprimaRaw,
    RegExpLiteral: setEsprimaRaw,
    NullLiteral: setEsprimaRaw,
    BooleanLiteral: setEsprimaRaw,
    NumericLiteral: setEsprimaRaw,
    StringLiteral: setEsprimaRaw,
    TemplateLiteral: setEsprimaRaw,
};

const transformTypes = Object.keys(transforms);

module.exports = (node) => {
    const ast = getAST(node);
    
    walk(ast, {
        enter(node) {
            const {type} = node;
            
            if (type !== 'File')
                convertNodeComments(node);
            
            if (transformTypes.includes(type))
                this.replace(transforms[type](node));
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
