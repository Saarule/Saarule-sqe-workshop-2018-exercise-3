import $ from 'jquery';
import {parseCode} from './codeAnalyzer';
import {createGraph} from './graphGenerator';
import {colorGraph} from './graphColor';
import {buildGraph} from './graphBuilder';
import {Module, render } from 'viz.js/full.render.js';
import Viz from 'viz.js';


$(document).ready(function () {
    $('#createGraphButton').click(() => {
        let number = 1;
        let myParsedCode = parseCode($('#originCodeInput').val());
        let myGraphNodes = createGraph(myParsedCode);
        let funcArgsInput =$('#funcArgsInput').val();
        if (number==1){
            let fillShapes = colorGraph(myGraphNodes, funcArgsInput, myParsedCode);
            let answer = buildGraph(myGraphNodes, fillShapes);
            let myGraph = document.getElementById('graphResult');
            let myViz = new Viz({Module, render });
            myViz.renderSVGElement(answer).then(function (element) {
                myGraph.innerHTML ='';
                myGraph.append(element);
            });
        }

    });
});