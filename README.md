# Estree-to-babel [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]:                https://img.shields.io/npm/v/estree-to-babel.svg?style=flat&longCache=true
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/estree-to-babel/master.svg?style=flat&longCache=true
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/estree-to-babel.svg?style=flat&longCache=true
[NPMURL]:                   https://npmjs.org/package/estree-to-babel "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/estree-to-babel  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/estree-to-babel "Dependency Status"

[CoverageURL]:              https://coveralls.io/github/coderaiser/estree-to-babel?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/estree-to-babel/badge.svg?branch=master&service=github

Convert [estree](https://github.com/estree/estree) compatable `JavaScript AST` to `babel AST`.

To use parsers like:
- [cherow](https://github.com/cherow/cherow)
- [espree](https://github.com/eslint/espree)
- etc...

With `babel` tools like:

- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)
- [@babel/types](https://babeljs.io/docs/en/babel-types)
- etc...

The thing is `@babel/parser` has a [little differences](https://babeljs.io/docs/en/babel-parser#output) with `estree` standard:
- `Property` of `ObjectExpression` called `ObjectProperty`;
- `FunctionExpression` of a `Property` located in `ObjectMethod` node;
- `File` node;
- `StringLiteral`, `NumericLiteral`, `NullLiteral` instead of `Literal`;
- `ClassMethod` instead of `MethodDefinition`;
- etc...

`estree-to-babel` aims to smooth this differences.

## Install

```
npm i estree-to-babel
```

### Example

```js
const cherow = require('cherow');
const toBabel = require('estree-to-babel');
const traverse = require('@babel/traverse').default;

const ast = toBabel(cherow.parse(`
    const const f = ({a}) => a;
`));

traverse({
    ObjectProperty(path) {
        console.log(path.value.name);
        // output
        'a';
    });
});
```

## License

MIT

