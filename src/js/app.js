import $ from 'jquery';
import {parseCode, codeViewer} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let listStructureModels = codeViewer(JSON.stringify(parsedCode));
        $('#parsedView').empty();
        let htmlTable = '';
        for(let i = 0; i < listStructureModels.length; i++)
        {
            htmlTable = htmlTable +listStructureModels[i].structureModelTrToString();
        }
        $('#parsedView').append('<table class="w3-class"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody>' + htmlTable +'</tbody></table>');

    });
});
