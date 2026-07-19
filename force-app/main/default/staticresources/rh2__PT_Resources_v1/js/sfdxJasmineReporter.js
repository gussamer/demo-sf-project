/* 
   Extracted from the Lightning Test Service 1.3
   
   Original Description:
     [Internal Only] used by test runner component to prepare test results for sfdx extraction.
   PackageID: 
     04tJ00000006jBu
   File:
     https://github.com/forcedotcom/LightningTestingService/blob/e503cbef4a4421008adb9ad357da1b1fdc458cde/lightning-component-tests/test/default/staticresources/lts_testutil.resource#L139
   
*/ 
    function sfdxReportForJasmine  (jasmine) {

        var run_results_full = { "tests": [] };
        var suiteDescription = '';
        var specStartTime = 0;
        
        var setHiddenDivContent = function (id, content) {
            var aDiv = document.getElementById(id);
            
            if (!aDiv) {
                aDiv = document.createElement("div");
                aDiv.id = id;
                aDiv.style.display = "none";
                document.body.appendChild(aDiv);
            }
            
            aDiv.innerHTML = content;
            return aDiv;
        };
        
        var sfdxReporter = {
            suiteStarted: function(suite) {
                suiteDescription = suite.description;
            },
            specStarted: function(spec) {
                specStartTime = Date.now();
            },
            specDone: function(spec) {
                var fullReport = {};
                var failedStr = '';
                fullReport.FullName =  suiteDescription + ' : ' + spec.description;
                fullReport.Outcome = 'Pass';
                fullReport.RunTime = Date.now() - specStartTime;
                
                if ('passed' === spec.status) {
                    console.log('passed!', fullReport.FullName, '- ' + fullReport.RunTime + 'ms');
                } else if ('pending' === spec.status) {
                    console.log('pending!', fullReport.FullName, '- ' + fullReport.RunTime + 'ms');
                    fullReport.Outcome = 'Skip';
                    fullReport.Message = ' # SKIP disabled by xit or similar';
                } else if ('disabled' === spec.status) {
                    console.log('disabled!', fullReport.FullName, '- ' + fullReport.RunTime + 'ms');
                    fullReport.Outcome = 'Disabled';
                } else {
                    console.log('failed!', fullReport.FullName, '- ' + fullReport.RunTime + 'ms');
                    for (var i = 0, failure; i < spec.failedExpectations.length; i++) {
                        var failureMessage = spec.failedExpectations[i].message;
                        failureMessage.replace(/^\s+/, "" ).replace(/\s+$/, "" );
                        failedStr += '\n  ' + failureMessage;
                    }
                    
                    fullReport.Outcome = 'Fail';
                    fullReport.Message = failedStr;
                }
                run_results_full.tests.push(fullReport);
            },
            jasmineDone: function(result) {
                setHiddenDivContent("run_results_full", JSON.stringify(run_results_full));
            }
        };
        jasmine.getEnv().addReporter(sfdxReporter);
    }
    
    (function(){
        sfdxReportForJasmine(jasmine);
    })();