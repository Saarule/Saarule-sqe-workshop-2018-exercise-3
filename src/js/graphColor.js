import {parseCode} from './codeAnalyzer';

let dicFunc = {
    'UpdateExpression': subUpdateExp,
    'VariableDeclarator': subVariableDeclarator ,
    'BinaryExpression': subBinaryExp,
    'MemberExpression': subMemberExp ,
    'AssignmentExpression': subAssignExp ,
    'VariableDeclaration': subVariableDeclaration ,
    'Identifier': subIdentifier,
};

function subUpdateExp(myJsonObj, env) {
    let argumentName = '';
    let operator = myJsonObj.operator[0];
    if (myJsonObj.argument.type === 'MemberExpression'){argumentName = myJsonObj.argument.object.name;}
    else{argumentName = myJsonObj.argument.name;}
    let envKey = createEnvKey(myJsonObj.argument, argumentName, env);
    let evaluated = eval(env[envKey].value+operator+1);
    env[envKey] = {
        'type': 'Literal',
        'value': evaluated,
        'raw': evaluated + '',
    };
    return myJsonObj;
}
function createEnvKey(myJsonObj,name,env) {
    let envKey = name;
    if (myJsonObj.type === 'MemberExpression'){
        let itemIndex = '';
        let itemIndexJsonObj = sub(myJsonObj.property, env);
        if(itemIndexJsonObj.type === 'Literal'){
            itemIndex = itemIndexJsonObj.raw;
        }
        envKey = myJsonObj.object.name+'['+itemIndex+']';
    }
    return envKey;
}

function createEnv(params, funcArgs) {
    let env = [];
    for (let i = 0; i < funcArgs.length; i++) {
        if (funcArgs[i].type === 'ArrayExpression') {
            for (let itemIndex = 0; itemIndex < funcArgs[i].elements.length; itemIndex++) {
                env[params[i].name + '[' + itemIndex + ']'] = funcArgs[i].elements[itemIndex];
            }
        } else {
            env[params[i].name] = funcArgs[i];
        }
    }
    return env;
}

function subVariableDeclaration(myJsonObj, env) {
    for (let i = 0; i < myJsonObj.declarations.length; i++) {
        myJsonObj.declarations[i] = sub(myJsonObj.declarations[i], env);
    }
    return myJsonObj;
}

function subAssignExp(myJsonObj, env) {
    let leftName = '';
    if (myJsonObj.left.type === 'MemberExpression'){leftName = myJsonObj.left.object.name;}
    else{leftName = myJsonObj.left.name;}
    myJsonObj.right = sub(myJsonObj.right, env);
    let envKey = createEnvKey(myJsonObj.left, leftName, env);
    env[envKey] = myJsonObj.right;

    return myJsonObj;
}

function subVariableDeclarator(myJsonObj, env) {
    if(myJsonObj.init != null){
        myJsonObj.init = sub(myJsonObj.init, env);
        if(myJsonObj.init.type === 'ArrayExpression'){
            for(let i = 0; i < myJsonObj.init.elements.length; i++){
                env[myJsonObj.id.name+'['+i+']'] = myJsonObj.init.elements[i];
            }
            return myJsonObj;
        }
    }
    env[myJsonObj.id.name] = myJsonObj.init;
    return myJsonObj;
}

function sub(jsonObj, env) {
    try {
        if (jsonObj.type === 'Literal')
            return subLiteral(jsonObj);

        return dicFunc[jsonObj.type](jsonObj, env);
    }
    catch (e) {
        return jsonObj;
    }
}

const colorGraph = (myGraphNodes, myFuncArgs, myJsonObj) => {
    let parsedArgs = getListParsedArgs(myFuncArgs);
    let params = myJsonObj.body[0].params;
    let addColors = parsedArgs.length === params.length;
    let env = createEnv(params, parsedArgs);
    let currentNode = myGraphNodes[0];
    while (currentNode.next.length !== 0) {
        currentNode.green = true;
        if (currentNode.normal) {
            sub(deepCopyDict(currentNode.astNode),env);
            currentNode = currentNode.normal;}
        else {
            if (evalExpression(deepCopyDict(currentNode.astNode), env) === true) currentNode = currentNode.true;
            else currentNode = currentNode.false;
        }
    }
    currentNode.green = true;
    return addColors;
};

function deepCopyDict(object){
    if(object == null || typeof(object) != 'object')
        return object;

    var temp = new object.constructor();
    for(var key in object)
        temp[key] = deepCopyDict(object[key]);

    return temp;
}

function getListParsedArgs(myArgs) {
    if(myArgs === ''){
        return [];
    }
    let parsedArgs = parseCode(myArgs);
    parsedArgs = parsedArgs.body[0].expression;
    if(parsedArgs.expressions !== undefined){
        return parsedArgs.expressions;
    }
    return [parsedArgs];

}


function subLiteral(myJsonObj) {
    return myJsonObj;
}
function subIdentifier(myJsonObj, env) {
    let ans = myJsonObj;
    if (myJsonObj.name in env) {
        ans = env[myJsonObj.name];
    }

    return ans;
}

function evalExpression(myJsonObj, env) {
    myJsonObj = sub(myJsonObj, env);
    return myJsonObj.value;
}

function subBinaryExp(myJsonObj, env) {
    myJsonObj.right = sub(myJsonObj.right, env);
    myJsonObj.left = sub(myJsonObj.left, env);
    let value = eval(myJsonObj.left.raw + myJsonObj.operator + myJsonObj.right.raw);
    myJsonObj = {'type': 'Literal', 'value': value, 'raw': value+'', loc:myJsonObj.loc} ;
    return myJsonObj;
}
function subMemberExp(myJsonObj, env) {
    myJsonObj.property = sub(myJsonObj.property, env);
    let key = '';
    key = myJsonObj.object.name+'['+myJsonObj.property.raw+']';
    if(key in env)
        return env[key];
    return myJsonObj;
}

export {colorGraph};