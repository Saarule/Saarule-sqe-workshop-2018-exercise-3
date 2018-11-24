import * as esprima from 'esprima';
import * as escodegen  from 'escodegen';
import {StructureModel} from './StructureModel';

let typeDictionary = {
    'UpdateExpression': 'update expression',
    'VariableDeclaration': 'variable declaration' ,
    'IfStatement': 'if statement' ,
    'FunctionDeclaration': 'function declaration' ,
    'WhileStatement': 'while statement',
    'ForStatement': 'for statement',
    'ReturnStatement': 'return statement' ,
    'AssignmentExpression': 'assignment expression' ,
    'VariableDeclarator': 'variable declarator' ,
};
let functionDictionary = {
    'ExpressionStatement': parseExpStatement ,
    'UpdateExpression': parseUpdateExpression ,
    'WhileStatement': parseWhileStatement ,
    'VariableDeclarator': parseVariableDeclarator ,
    'FunctionDeclaration': parseFuncDeclaration ,
    'VariableDeclaration': parseVariableDeclaration ,
    'BlockStatement': parseBlockStatement ,
    'IfStatement': parseIfStatement ,
    'Identifier': parseIdentifier ,
    'ReturnStatement': parseReturnStatement ,
    'MemberExpression': parseMemberExpression ,
    'AssignmentExpression': parseAssignExpression ,
    'ForStatement': parseForStatement,
    'Program': parseProgram ,
    'Literal': parseLiteral ,
    'BinaryExpression': parseBinaryExpression ,
    'UnaryExpression': parseUnaryExpression ,
};
let listOfModels;

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};
const codeViewer = (parsedCode) => {
    listOfModels = [];
    let jsonObject = JSON.parse(parsedCode);
    getDetails(jsonObject);
    return listOfModels;
};
function getDetails(jsonObject) {
    if (jsonObject == null){
        return jsonObject;
    }
    let type = jsonObject.type;
    return functionDictionary[type](jsonObject);
}
function parseUpdateExpression(jsonObject) {
    return escodegen.generate(jsonObject);
}
function parseBinaryExpression(jsonObject) {
    return escodegen.generate(jsonObject);
}
function parseUnaryExpression(jsonObject) {
    return escodegen.generate(jsonObject);
}
function parseMemberExpression(jsonObject) {
    return escodegen.generate(jsonObject);
}
function parseLiteral(jsonObject) {
    return jsonObject.value;
}
function parseIdentifier(jsonObject) {
    return jsonObject.value;
}
function parseAssignExpression(jsonObject) {
    let curr_model = new StructureModel(jsonObject.loc.start.line, getDetails[jsonObject.type], getDetails(jsonObject.left),'',  getDetails(jsonObject.right) );
    listOfModels.push(curr_model);
}
function parseExpStatement(jsonObject) {
    return getDetails(jsonObject.expression);
}
function parseReturnStatement(jsonObject) {
    let curr_model = new StructureModel(jsonObject.loc.start.line, typeDictionary[jsonObject.type],'','',getDetails(jsonObject.argument));
    listOfModels.push(curr_model);
}
function parseBlockStatement(jsonObject) {
    for (let i = 0; i < jsonObject.body.length; i++) {
        getDetails(jsonObject.body[i]);
    }
}
function parseVariableDeclarator(jsonObject) {
    let curr_model = new StructureModel(jsonObject.loc.start.line,typeDictionary[jsonObject.type], getDetails(jsonObject.id),'',getDetails(jsonObject.init));
    listOfModels.push(curr_model);
}
function parseFuncDeclaration(jsonObject) {
    let curr_model = new StructureModel(jsonObject.loc.start.line,typeDictionary[jsonObject.type], getDetails(jsonObject.id) ,'','');
    listOfModels.push(curr_model);
    for (let i = 0; i < jsonObject.params.length; i++) {
        curr_model = new StructureModel(jsonObject.params[i].loc.start.line, 'variable declaration', getDetails(jsonObject.params[i]), '', '');
        listOfModels.push(curr_model);
    }
    getDetails(jsonObject.body);
}
function parseVariableDeclaration(jsonObject) {
    for (let i = 0; i < jsonObject.declarations.length; i++) {
        getDetails(jsonObject.declarations[i]);
    }
}
function parseProgram(jsonObject) {
    for (let i = 0; i < jsonObject.body.length; i++) {
        getDetails(jsonObject.body[i]);
    }
}
function parseIfStatement(jsonObject, inside_else_stmt) {
    let operator = jsonObject.test.operator;
    let left = getDetails(jsonObject.test.left);
    let right = getDetails(jsonObject.test.right);
    let condition = left + ' ' + operator + ' ' + right;
    let type = typeDictionary[jsonObject.type];
    if(inside_else_stmt) type = 'else if statement';
    let curr_model = new StructureModel(jsonObject.loc.start.line,type,'',condition,'');
    listOfModels.push(curr_model);
    getDetails(jsonObject.consequent);
    if(jsonObject.alternate && jsonObject.alternate.type  === jsonObject.type) parseIfStatement(jsonObject.alternate, true );
    else getDetails(jsonObject.alternate);
}
function parseWhileStatement(jsonObject) {
    let condition = getDetails(jsonObject.test.left) + ' ' + jsonObject.test.operator + ' ' + getDetails(jsonObject.test.right);
    let curr_model = new StructureModel(jsonObject.loc.start.line, typeDictionary[jsonObject.type],'',condition,'');
    listOfModels.push(curr_model);
    getDetails(jsonObject.body);
}
function parseForStatement(jsonObject) {
    let condition = getDetails(jsonObject.test);
    let curr_model = new StructureModel(jsonObject.loc.start.line, typeDictionary[jsonObject.type],'',condition,'');
    listOfModels.push(curr_model);
    getDetails(jsonObject.init);
    getDetails(jsonObject.update);
    getDetails(jsonObject.body);
}
export {parseCode,codeViewer};
