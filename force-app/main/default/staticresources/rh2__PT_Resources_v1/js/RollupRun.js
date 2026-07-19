window.RollupRun = (function() {
    return {
        calculateDuration: function(numRecords, batchSize) {
            var estimate = 0;
            var firstTime = 65;
            var firstUnit = '';
            var secondTime = '';
            var secondUnit = '';
            var result = '';

            estimate = Math.ceil((numRecords / batchSize) * .75);

            if (estimate < 1440) {
                firstTime = Math.floor(estimate / 60);
                secondTime = Math.ceil(estimate % 60);
                firstUnit = 'hour';
                secondUnit = 'minute';
            } else if (estimate < 10080) {
                firstTime = Math.floor(estimate / 1440);
                secondTime = Math.ceil((estimate % 1440) / 60);
                firstUnit = 'day';
                secondUnit = 'hour';
            } else if (estimate < 43200) {
                firstTime = Math.floor(estimate / 10080);
                secondTime = Math.ceil((estimate % 10080) / 1440);
                firstUnit = 'week';
                secondUnit = 'day';
            } else if (estimate < 525600) {
                firstTime = Math.floor(estimate / 43200);
                secondTime = Math.ceil((estimate % 43200) / 10080);
                firstUnit = 'month';
                secondUnit = 'week';
            } else {
                firstTime = Math.floor(estimate / 525600);
                secondTime = Math.ceil((estimate % 525600) / 43200);
                firstUnit = 'year';
                secondUnit = 'month';
            }
        
            if(firstTime != 0 && firstUnit != ''){
                if (firstTime != 1) {
                    firstUnit += 's';
                }
                result += firstTime + ' ' + firstUnit;
            }
            if(secondTime != 0 && secondUnit != ''){
                if (secondTime != 1) {
                    secondUnit += 's';
                }
                if (result != '') {
                    result += ' ';
                }
                result += secondTime + ' ' + secondUnit;
            }
            
            if(result == ''){
                result = '0 minutes';
            }
        
            return result;
        }
    };
}());