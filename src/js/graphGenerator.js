import * as escodegem from 'escodegen';
import * as esgraph  from 'esgraph';


const createGraph = (parsedCode) => {
    let myEsgraphRes = esgraph(parsedCode.body[0].body)[2];
    let myGraphNodes =  myEsgraphRes.slice(1, myEsgraphRes.length - 1);
    cleanGraph(myGraphNodes);
    return myGraphNodes;
};

function cleanGraph(myGraphNodes) {
    myGraphNodes[0].prev = [];
    fixReturnNodes(myGraphNodes);
    setLabelForNodes(myGraphNodes);
    //concatNodes(myGraphNodes);
}

function fixReturnNodes(myGraphNodes) {
    for(let i = 0; i < myGraphNodes.length; i++){
        if(myGraphNodes[i].astNode.type === 'ReturnStatement')
        {
            myGraphNodes[i].next=[]; delete myGraphNodes[i].normal;
        }
    }
}

function setLabelForNodes(myGraphNodes) {
    myGraphNodes.forEach(node => node.label = escodegem.generate(node.astNode, {format: {compact: true}}));
}


export {createGraph};