import $ from 'jquery';
import {codeViewer} from './code-viewer';
import {subedCode} from './sub';
import {parseCode} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let originInputCode = $('#originInputCode').val().replace('    \n', '');
        originInputCode = originInputCode.replace(/[\r\n]+/g, '\r\n');
        originInputCode = originInputCode.replace(/[\r\n]+/g, '\r\n');
        originInputCode = originInputCode.replace('\r\n{','{');
        originInputCode = originInputCode.replace('}\r\n','}');

        let funcArgsInput = $('#funcArgsInput').val();
        let answersNoEvalAndArgs = subedCode(parseCode(originInputCode), {}, '', false);
        let ansWithEvalAndArgs = subedCode(parseCode(originInputCode),{} ,funcArgsInput, true);

        $('#substituteParsedCodeResult').val(JSON.stringify(answersNoEvalAndArgs['newJson'], null, 2));

        let codeViewerResult = codeViewer(answersNoEvalAndArgs['newJson'], ansWithEvalAndArgs['greenLines'], ansWithEvalAndArgs['redLines'], answersNoEvalAndArgs['listRowsToIgnore']);
        $('#substituteCodeResult').empty();
        for(let i= 0; i < codeViewerResult.length; i++)
            $('#substituteCodeResult').append('<span style="color:' + codeViewerResult[i].color + ';">' + codeViewerResult[i].line + '</span><br>');
    });
});