let fillMyShapes = false;

function buildFalseConn (graphNodes, nextNode, i){
    return 'n'+i+' -> n'+graphNodes.indexOf(nextNode)+' [label="F"]\n';

}
function buildTrueConn (graphNodes, nextNode, i){
    return 'n'+i+' -> n'+graphNodes.indexOf(nextNode)+' [label="T"]\n';
}



function buildNode(node, index) {
    let answer = '';
    answer += 'n'+index +' [label="['+(index+1)+']\n' + node.label +'"';
    let shape = 'box';
    if (node.true != null || node.false != null)
        shape = 'diamond';
    answer += ' shape="'+ shape+'"';
    if (fillMyShapes && node.green === true)
        answer +=' fillcolor=green style=filled';
    return answer+']\n';

}

const buildGraph = (graphNodes, argsEqParam) => {
    fillMyShapes = argsEqParam;
    let answer = 'digraph cfg {';
    answer = answer  + buildNodes(graphNodes) + buildConnections(graphNodes);
    answer = answer + ' }';
    return answer;
};

function buildConnections(myGraphNodes){
    let answer = '';
    for (const [i, node] of myGraphNodes.entries()) {
        if(node['normal']) answer = answer + buildNormalConn(myGraphNodes,node['normal'] , i);
        if(node['true']) answer = answer + buildTrueConn(myGraphNodes,node['true'], i);
        if(node['false']) answer = answer + buildFalseConn(myGraphNodes, node['false'], i);
    }
    return answer;
}
function buildNodes(myGraphNodes){
    let answer = '';
    for (let [i, node] of myGraphNodes.entries())
        answer = answer + buildNode(node, i);
    return answer;
}


function buildNormalConn(myGraphNodes,nextNode, i){
    return 'n'+i+' -> n'+myGraphNodes.indexOf(nextNode)+' []\n';
}




export {buildGraph};