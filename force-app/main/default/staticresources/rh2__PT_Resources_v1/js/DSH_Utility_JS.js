/*global dsh:true*/

function selectTab(tabIndex, numberOfTabs){
    var selectTabName = 'tab' + tabIndex;
    var selectTabContent = 'tab-default-' + tabIndex;

    document.getElementById(selectTabName).className = 'slds-tabs__item slds-text-heading--label slds-active';
    document.getElementById(selectTabContent).style.display = 'block';

    for(var i = 1; i < (numberOfTabs + 1); i++){
        if(i === tabIndex){
            continue;
        }

        var deselectTabName = 'tab' + i;
        var deselectTabContent = 'tab-default-' + i;

        document.getElementById(deselectTabName).className = 'slds-tabs__item slds-text-heading--label';
        document.getElementById(deselectTabContent).style.display = 'none';
    }
}

function isValidEmail(email) {
    var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return re.test(email);
}

function isBlank(value){
    switch (value) {
    case "":
    case " ":
    case null:
    case false:
    case typeof this === "undefined":
      return true;
    default:
      return false;
  }
}

function isValidFilter(hasFilterCriteriaVariable){
    if(!isBlank(dsh.j$("[Id$='objFields']").val()) && !isBlank(dsh.j$("[Id$='NewCriteriaOper']").val()) && (!hasFilterCriteriaVariable || (hasFilterCriteriaVariable && !isBlank(dsh.j$("[Id$='newFilterCon']").val())))){
        return true;
    }
    return false;
}

function isGreaterThanMaxLimit(limit, payingCustomer){
    if(payingCustomer){
        return limit.split(',').join('') > 50000;
    }else{
        return limit.split(',').join('') > 20000;
    }
}

function getNameFieldIndex(allFields, nameField){
    for(var i = 0; i < allFields.length; i++){
        if(allFields[i].toLowerCase() === nameField){
          return i;
        }
      }
}

function CSVToArray(CSV_string, delimiter) {
    delimiter = (delimiter || ","); // user-supplied delimeter or default comma
    
    var pattern = new RegExp(
     ( // Delimiters:
       "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
       // Quoted fields.
       "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
       // Standard fields.
       "([^\"\\" + delimiter + "\\r\\n]*))"
     ), "gi"
    );

    var rows = [[]];
    var matches = false; // false if we don't find any matches
    while (matches = pattern.exec( CSV_string )) {
       var matched_delimiter = matches[1];
       if (matched_delimiter.length && matched_delimiter !== delimiter) {
         rows.push( [] );
       }
       var matched_value;
       if (matches[2]) {
        matched_value = matches[2].replace(
          new RegExp( "\"\"", "g" ), "\""
        );
       } else { // found a non-quoted value
         matched_value = matches[3];
       }
       rows[rows.length - 1].push(matched_value);
    }
    return rows; // Return the parsed data Array
}

function getRecordName(recordFieldValues, nameIndex, selectedRecName){
    var csvRecName;
    if(selectedRecName.indexOf(',') !== -1 && recordFieldValues[nameIndex].startsWith('"')){
        var nameValueIndex = nameIndex;
        csvRecName = recordFieldValues[nameValueIndex];

        do{
            nameValueIndex++;
            csvRecName += ',' + recordFieldValues[nameValueIndex];
        }while((!csvRecName.endsWith('"') || csvRecName[csvRecName.length - 2] === '"') && nameValueIndex < recordFieldValues.length);

        if(csvRecName.startsWith('"') && csvRecName.endsWith('"')){
            csvRecName = csvRecName.substr(1).slice(0, -1);
        }
    }else{
        csvRecName = recordFieldValues[nameIndex];
    }
    return csvRecName;
}

function getFieldValues(allFields, recordFieldValues){
    var recordFound = [];
    var fieldValueIndex = 0;

    for(var j = 0; j < allFields.length; j++){
        recordFound.push(allFields[j] + '&&&' + recordFieldValues[fieldValueIndex]);
        fieldValueIndex++;
    }
    return recordFound;
}

function buildRecordFoundInBackup(backupBody, recordName, nameField, recordID){
    var bodyString = atob(backupBody);
    var allRecords = CSVToArray(bodyString, ',');
    var allFields = allRecords[0];
    var indexOfNameField;
    var recordFound = [];

    indexOfNameField = getNameFieldIndex(allFields, nameField.toLowerCase());

    if(indexOfNameField != '' && indexOfNameField != null){
        for(var i = 1; i < allRecords.length; i++){
            var csvRecName = '';
            var csvRecID = '';
            var recordFieldValues = allRecords[i];

            csvRecName = getRecordName(recordFieldValues, indexOfNameField, recordName);
            if(!recordID){
                if(csvRecName === recordName){
                    recordFound = getFieldValues(allFields, recordFieldValues);
                    break;
                }
            }else{
                if(csvRecName === recordName && recordFieldValues[0] === recordID){
                    recordFound = getFieldValues(allFields, recordFieldValues);
                    break;
                }
            }
        }
    }
    return recordFound;
}

function processSelectedSetting(settingId, nameError, context){
    if(!isBlank(settingId)){
        var settings = document.getElementsByTagName("tr");
        for(var i = 0; i < settings.length; i++) {
            if(settings[i].getAttribute('id') != null && settings[i].getAttribute('id').indexOf('s_') === 0) {
                var id = settings[i].getAttribute('id').split('s_')[1];
                settings[i].className = 'slds-hint-parent';
                settings[i].setAttribute('onclick', 'updateSelectedSettingAction("' + id + '")');
            }
        }
        document.getElementById('s_' + settingId).className += ' slds-is-selected';
        document.getElementById('s_' + settingId).removeAttribute("onclick");
    }
    
    if(context === 'New' && context !== ''){
      if(nameError === true){
        document.getElementById('newSettingNameError').style.display = 'block';
      }else{
        document.getElementById('newSetting').style.display = 'none';
        document.getElementById('newCriterion').style.display = 'block';
        document.getElementById('NewSettingObjectError').style.display = 'none';
        document.getElementById('newSettingNameError').style.display = 'none';
      }
    }
    if(context === 'Edit' && context !== ''){
      if(nameError === true){
        document.getElementById('editSettingNameError').style.display = 'block';
      }else{
        document.getElementById('editSetting').style.display = 'none';
        document.getElementById('s_' + settingId).className += ' slds-is-selected';
        document.getElementById('EditSettingObjectError').style.display = 'none';
        document.getElementById('editSettingNameError').style.display = 'none';
      }
    }
}

function setPositionOfTooltip(tooltip, label){
    var height = 0;
    
    var item = document.getElementById(label);
    var tt = document.getElementById(tooltip);
    height = dsh.j$('#' + tooltip).height();

    tt.style.top = '-' + (height + 30) + 'px';
    item.style.maxHeight = '0px';
}

function setShowTooltipFormatting(tooltip){
    var tt = document.getElementById(tooltip);
    
    tt.style.display = 'block';
    tt.style.overflow = 'visible';
}

function setFildSelectListSize(context, fkListSize){
    if(context === 'new'){
        if(fkListSize > 0){
            document.getElementById('newFieldSelection').className = 'slds-size--1-of-2';
            document.getElementById('newFKSelection').style.display = 'block';
        }else{
            document.getElementById('newFieldSelection').className = 'slds-size--1-of-1';
            document.getElementById('newFKSelection').style.display = 'none';
        }
    }else{
        if(fkListSize > 0){
            document.getElementById('editFieldSelection').className = 'slds-size--1-of-2';
            document.getElementById('editFKSelection').style.display = 'block';
        }else{
            document.getElementById('editFieldSelection').className = 'slds-size--1-of-1';
            document.getElementById('editFKSelection').style.display = 'none';
        }
    }
}

function showError(error, tagToDisplay){
    document.getElementById(tagToDisplay).style.display = 'block';
    document.getElementById(tagToDisplay).innerHTML = "<font style='color:red'>" + error + "</font>";
}

function showSettingInfo(){
    document.getElementById('settingInfo').style.display = 'block';
    document.getElementById('criterion').style.display = 'none';
    document.getElementById('recordPreview').style.display = 'none';
    document.getElementById('backupSettings').style.display = 'none';
    document.getElementById("infoTab").className = "slds-tabs--scoped__item slds-text-heading--label slds-active";
    document.getElementById("criteriaTab").className = "slds-tabs--scoped__item slds-text-heading--label";
    document.getElementById("backupTab").className = "slds-tabs--scoped__item slds-text-heading--label";
}

function showCriterion(){
    document.getElementById('criterion').style.display = 'block';
    document.getElementById('settingInfo').style.display = 'none';
    document.getElementById('recordPreview').style.display = 'none';
    document.getElementById('backupSettings').style.display = 'none';
    document.getElementById('editSetting').style.display = 'none';
    document.getElementById("infoTab").className = "slds-tabs--scoped__item slds-text-heading--label";
    document.getElementById("criteriaTab").className = "slds-tabs--scoped__item slds-text-heading--label slds-active";
    document.getElementById("backupTab").className = "slds-tabs--scoped__item slds-text-heading--label";
}

function showBackup(){
    document.getElementById('criterion').style.display = 'none';
    document.getElementById('settingInfo').style.display = 'none';
    document.getElementById('recordPreview').style.display = 'none';
    document.getElementById('backupSettings').style.display = 'block';
    document.getElementById('editSetting').style.display = 'none';
    document.getElementById("infoTab").className = "slds-tabs--scoped__item slds-text-heading--label";
    document.getElementById("criteriaTab").className = "slds-tabs--scoped__item slds-text-heading--label";
    document.getElementById("backupTab").className = "slds-tabs--scoped__item slds-text-heading--label slds-active";
}

function showSettingActivation(shouldShow){
    if(shouldShow){
        document.getElementById('activateSetting').style.display = 'block';
    }
}

function showBackupChildObjects(){
    document.getElementById('backupConfig').style.display = 'none';
    document.getElementById('cascadeDeleteBackup').style.display = 'none';
    document.getElementById('cascadeDeleteObjectList').style.display = 'block';
}

function showBackupDownload(){
    document.getElementById('deletionWarning').style.display = 'none';
    document.getElementById('backupDownload').style.display = 'block';
}

function showChildBackupModal(){
    document.getElementById('cascadeDeleteObjectList').style.display = 'none';
    document.getElementById('cascadeDeleteBackup').style.display = 'block';
}

function hideSettingConfig(){
    document.getElementById('settingConfig').style.display = 'none';
    document.getElementById('maxRecordsError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
}

function hideNewCriteriaVariableError(){
    if(document.getElementById('newCriteriaVariableError') != null){
        document.getElementById('newCriteriaVariableError').style.display = 'none';
    }
}

function hideEditCriteriaVariableError(){
    if(document.getElementById('editCriteriaVariableError') != null){
        document.getElementById('editCriteriaVariableError').style.display = 'none';
    }
}

function hideEditSchedule(error){
    if(isBlank(error)){
        document.getElementById('editSchedule').style.display = 'none';
        document.getElementById('settingConfig').style.display = 'block';
        try{
            document.getElementById('incrementError').style.display = 'none';
            document.getElementById('nextRunError').style.display = 'none';
        }catch(error){}
    }else{
        document.getElementById('nextRunError').style.display = 'block';
        document.getElementById('nextRunError').innerHTML = "<font style='color:red'>" + error + "</font>";
    }
}

function hideChildBackupModal(){
    document.getElementById('cascadeDeleteBackup').style.display = 'none';
    document.getElementById('cascadeDeleteObjectList').style.display = 'block';
}

function hideAllModals(){
    var modalIds = ["newSetting", "newCriterion", "manualRun", "editCriterion", "editSetting", "settingConfig", "recordPreview", "editSchedule",
                    "activateSetting", "helpScreen", "agModal", "backupConfig", "backupDownload", "deletionWarning", "EditCriteriaFieldError", 
                    "EditCriteriaOperError", "NewCriteriaFieldError", "NewCriteriaOperError", "maxRecordsError", "emailError", "incrementError", "nextRunError"];
    for(var i = 0; i < modalIds.length; i++){
        try{
            document.getElementById(modalIds[i]).style.display = 'none';
        }catch(e){}
    }
}

function displayActivationConfigAfterBackupConfig(){
    document.getElementById('activateSetting').style.display = 'block';
    document.getElementById('backupConfig').style.display = 'none';
}

function closeCouponCodeModal(emailError, consentError){
    if(!emailError && !consentError){
        document.getElementById('nfpDiscount').style.display = 'none';
    }
}