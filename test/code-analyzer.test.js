var assert = require('chai').assert;
import {parseCode,codeViewer} from '../src/js/codeAnalyzer';
import {StructureModel} from '../src/js/StructureModel';

describe('Expressions',() => {
    it('AssignmentExpression with MemberExpression', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('y = arr[y];'))),
            [new StructureModel(1,'assignment expression','y','','arr[y]'),]);});
    it('ExpressionStatement', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('let low;\n\n\nlow = 0;'))),
            [new StructureModel(1,'variable declarator','low','',null),
                new StructureModel(4,'assignment expression','low','',0)]);});
    it('ForStatement with UpdateExpression(prefix = false)', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('for(var i = 0; i < 5; i = i++)\n{x = x + 1;}'))),
            [new StructureModel(1,'for statement','','i < 5',''), new StructureModel(1,'variable declarator','i','',0), new StructureModel(1,'assignment expression','i','','i++'), new StructureModel(2,'assignment expression','x','','x + 1'),]);});
    it('ForStatement with UpdateExpression(prefix = true)', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('for(var i = 0; i < 5; i = ++i)\n{x = x + 1;}'))),
            [new StructureModel(1,'for statement','','i < 5',''),
                new StructureModel(1,'variable declarator','i','',0),
                new StructureModel(1,'assignment expression','i','','++i'),
                new StructureModel(2,'assignment expression','x','','x + 1'),]);});
});
describe('Statements',() => {
    it(': IfStatement followed by else ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('if(x < 10)\n{x = x - 7}\nelse\n{x = x + 7}'))),
            [new StructureModel(1,'if statement','','x < 10',''),
                new StructureModel(2,'assignment expression','x','','x - 7'),
                new StructureModel(4,'assignment expression','x','','x + 7')]);});
    it(': IfStatement and ElseIfStatement ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('if(j < 10)\n{j = j - 7;}\nelse\nif(x > 10)\n{j = 10;}'))),
            [new StructureModel(1,'if statement','','j < 10',''),
                new StructureModel(2,'assignment expression','j','','j - 7'),
                new StructureModel(4,'else if statement','','x > 10',''),
                new StructureModel(5,'assignment expression','j','',10)]);});
    it(':FunctionDeclaration with ReturnStatement', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('function binarySearch(){\nreturn -1;}'))),
            [new StructureModel(1, 'function declaration', 'binarySearch', '', ''),
                new StructureModel(2, 'return statement', '', '', '-1')]);});
    it(': ForStatement ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('for(var i = 0; i < 5; i = i++)\n{x = x + 1;}'))),
            [new StructureModel(1,'for statement','','i < 5',''),
                new StructureModel(1,'variable declarator','i','',0),
                new StructureModel(1,'assignment expression','i','','i++'),
                new StructureModel(2,'assignment expression','x','','x + 1'),]);});
    it(': WhileStatement ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('while(i < 10)\n{i = n-1}'))),
            [new StructureModel(1,'while statement','','i < 10',''),
                new StructureModel(2,'assignment expression','i','','n - 1')]);});
    it(': IfStatement ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('if(i < 10)\n{i = i - 7}'))),
            [new StructureModel(1,'if statement','','i < 10',''),
                new StructureModel(2,'assignment expression','i','','i - 7')]);});
});
describe('Model',() => {
    let model_for_test = new StructureModel(1,'for statement','','i < 5','');
    it('structureModelTrToString', () => {
        assert.equal(model_for_test.structureModelTrToString(),
            '<tr><td>1</td><td>for statement</td><td></td><td>i < 5</td><td></td></tr>');});
});
describe('Declarations',() => {
    it(':FunctionDeclaration', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('function b(x){}'))),
            [new StructureModel(1, 'function declaration', 'b', '', ''),
                new StructureModel(1, 'variable declaration', 'x', '', '')]);});
    it(': variableDeclarator ', () => {
        assert.deepEqual(codeViewer(JSON.stringify(parseCode('let a = 1;'))),
            [new StructureModel(1, 'variable declarator', 'a', '', 1)]);});
});


