function navigateToURL(pageName){
	if(typeof sforce != 'undefined')
		sforce.one.navigateToURL(pageName, true);
	else
		window.open(pageName, '_self');	
}

function showElement(elementId){
    showModal(true, elementId);
}

function hideElement(elementId){
    showModal(false, elementId);
}

function overridePageMessagesNormalSize(){   
    overridePageMessages('');
}

function overridePageMessages(themeSize){   
    if(themeSize === undefined){
      themeSize = 'slds-box_x-small';
    }  
    stylePageMessageTheme('errorM3', 'slds-theme_error', themeSize);
    stylePageMessageTheme('warningM3', 'slds-theme_warning', themeSize);
    stylePageMessageTheme('confirmM3', 'slds-theme_success', themeSize);
    stylePageMessageTheme('infoM3', 'slds-theme_info', themeSize);
}
          
function stylePageMessageTheme(className, themeType, themeSize){
    [].forEach.call( document.getElementsByClassName(className), function (e) { e.className = 'message slds-box ' + themeSize + ' ' + themeType + ' slds-text-body_regular customMessage'; });
}

function showOrHideDropdown(dropDownId) {
    var dropdownClassList = document.getElementById(dropDownId).classList;

    if(dropdownClassList.contains('slds-is-open')){
        dropdownClassList.remove('slds-is-open');
    }

    else{
    if (prevValue != null) {
        var prevClassList = document.getElementById(prevValue).classList;
        prevClassList.remove('slds-is-open');
    } 

    dropdownClassList.add('slds-is-open');

    if(dropDownId != prevValue) 
        prevValue = dropDownId;
    }
}

function confirmActive(checkActive, fieldName, count, notpaid) {
    var statusString = (checkActive == "true") ? "Are you sure you would like to deactivate " : "Are you sure you would like to activate ";
    statusString += fieldName + "?";

    if(notpaid == true && count >= 3 && checkActive != "true") {
        return false;
    }

    return confirm(statusString);
}

function selectAllCheckboxes(obj,receivedInputID) {
        var inputCheckBox = document.getElementsByTagName("input"); 

        for(var i=0; i<inputCheckBox.length; i++){          
            if(inputCheckBox[i].id.indexOf(receivedInputID)!=-1){                                     
            inputCheckBox[i].checked = obj.checked;       
        }
    }
}

function confirmOverwrite(checkOverwrite, fieldName) 
{

    if(checkOverwrite == "true") {
        return confirm("Are you sure you do not want to overwrite information in the " + fieldName + " field?");
    } else {
        return true;
    }

}

function closeToastInClassic(toastContainer) {
    document.getElementById(toastContainer).classList.add("slds-hide");

}

function showToastInClassic(toastAttributes) {
    const toastTypeList = document.getElementById('toastType').classList; 
      if (toastTypeList.contains("slds-theme_success")) {
        toastTypeList.remove("slds-theme_success");
      }
      else if (toastTypeList.contains("slds-theme_error")) {
        toastTypeList.remove("slds-theme_error");
      }
      toastTypeList.add("slds-theme_" + toastAttributes.type);
      document.getElementById('toastContainer').classList.remove("slds-hide");
      document.getElementById('toastAssist').innerHTML = toastAttributes.type.toString();
      document.getElementById('toastTitle').innerText = toastAttributes.title;
      document.getElementById('toastMessage').innerText = toastAttributes.message.toString();
      if(toastAttributes.type === 'success') {
        setTimeout(() => {
           if(!document.getElementById('toastContainer').classList.contains("slds-hide")) {
              document.getElementById('toastContainer').classList.add("slds-hide");
           }
        }, 3000);
     }

}

function unhideTDAndPopulateRels(){
    document.getElementById("relFieldSelect").style.display="table-cell";
}
    
function showModal(showMessage, modalId){
    if (showMessage == true) {
        document.getElementById(modalId).style.display = 'block';
    } else {
        document.getElementById(modalId).style.display = 'none';
    }
}

function extractRecordCount(result, event) {
    var maxRecords, totalRecords;

    if (event.status && event.result) {
        maxRecords = result[1];
        totalRecords = result[0];
    } else {
        maxRecords = 50000;
    }

    console.log('RESULT LOG: ', result);

    rh.j$( "[id$=maxRecords]" ).val(maxRecords);

    return {maxRecords: maxRecords, totalRecords: totalRecords};
}

function estimateRecordsDuration(result, event) {
    var result = extractRecordCount(result, event);
    var estDuration = RollupRun.calculateDuration(result.maxRecords, batchSize);

    rh.j$( "[id$=estWaitTime]" ).html(estDuration + ' to complete');              
    rh.j$( "[id$=runOnce]" ).val('Run Once For All Records');     
}

function populateRecordCount(result, event) {
    var result = extractRecordCount(result, event);

    maxRecords = result.maxRecords;
    totalRecords = result.totalRecords;

    var estDuration = RollupRun.calculateDuration(maxRecords, batchSize);

    rh.j$( "[id$=rollupRunTime]").val(estDuration);
    rh.j$( "[id$=NumRecords]" ).text('You currently have ' + totalRecords + ' ' + objName + ' records.');
    rh.j$( "[id$=runEstTime]" ).text('This rollup will take ' + estDuration + ' to process.');

}

function limitNumberInput(event) {
    var AllowableCharacters = '0123456789';
    return limitInputCharacters(AllowableCharacters, event);
}

function limitInputCharacters(AllowableCharacters, event) {
    var k = document.all?parseInt(event.keyCode): parseInt(event.which);
    if (k!=13 && k!=8 && k!=0){
        if ((event.ctrlKey==false) && (event.altKey==false)) {
        return (AllowableCharacters.indexOf(String.fromCharCode(k))!=-1);
        } else {
        return true;
        }
    } else {
        return true;
    }
}

function showSettingsModal() {
    showModal(true, 'settingsModal');
    populateSettingModalOptions();
}

function closeSettingsModal() {
    showModal(false, 'settingsModal');
}

function captureEnterAndBuildList(e, search, searchWhat, searchWhere){
	var key = e.key;
	if(key === "Enter"){
		e.preventDefault();
		searchFromInput(search, searchWhat, searchWhere);
	}    
}

function loading(val) {
    if(val){
        document.getElementById('loading').style.display = 'block';
    }else{
        document.getElementById('loading').style.display = 'none';
    }
}

function searchFromInput(inputId, searchFunction, optionalParam){
    var searchInput = document.getElementById(inputId);
    var timeout = null;
    searchInput.onkeyup = function (e) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if(optionalParam == undefined){
                searchFunction(searchInput.value);
            }else{
                searchFunction(searchInput.value, optionalParam);
            }
        }, 300);
    };
}

function createRemoteSite(sessionId, settingName, metaUrl, postUrl) {
	if (!metaUrl.startsWith('https://')) {
		metaUrl = 'https://' + metaUrl;
	}
	if (!postUrl.startsWith('https://')) {
		postUrl = 'https://' + postUrl;
	}

	// Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
	var binding = new XMLHttpRequest();
	var request = 
		'<?xml version="1.0" encoding="utf-8"?>' + 
		'<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			'<env:Header>' + 
				'<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' + 
					'<urn:sessionId>' + sessionId + '</urn:sessionId>' + 
				'</urn:SessionHeader>' + 
			'</env:Header>' + 
			'<env:Body>' +
				'<upsertMetadata xmlns="http://soap.sforce.com/2006/04/metadata">' + 
					'<metadata xsi:type="RemoteSiteSetting">' + 
						'<fullName>' + settingName + '</fullName>' +  + 
						'<disableProtocolSecurity>false</disableProtocolSecurity>' + 
						'<isActive>true</isActive>' + 
						'<url>' + metaUrl + '</url>' +
					'</metadata>' +
				'</upsertMetadata>' +
			'</env:Body>' + 
		'</env:Envelope>';
	binding.open('POST', postUrl + '/services/Soap/m/28.0');
	binding.setRequestHeader('SOAPAction','""');
	binding.setRequestHeader('Content-Type', 'text/xml');
	binding.onreadystatechange = 
		function() { 
			if(this.readyState==4) {
				var parser = new DOMParser();
				var doc  = parser.parseFromString(this.response, 'application/xml');
				var errors = doc.getElementsByTagName('errors');
				var messageText = '';

				for(var errorIdx = 0; errorIdx < errors.length; errorIdx++) {
					messageText+= errors.item(errorIdx).getElementsByTagName('message').item(0).innerHTML + '\n';
				}	                
			} 
		}
	binding.send(request);
}

function fixHeader(lwcElement, additionalTopOffset, headerPosition){
    try{
        const dataTable = lwcElement.getElementsByClassName("dataTable")[0];
        const bottomAnchor = lwcElement.getElementsByClassName("bottomAnchor")[0];
        const floatingHeader = lwcElement.getElementsByClassName("floatingHeader")[0];

        var scroll = rh.j$(window).scrollTop();
        var anchor_top = dataTable.offsetTop;
        var anchor_bottom = bottomAnchor.offsetTop; 
        var full_width = dataTable.offsetWidth;

        if (scroll > (anchor_top + additionalTopOffset) && scroll < anchor_bottom) {
            floatingHeader.style.position = headerPosition;
            floatingHeader.style.top = 0;
            floatingHeader.style.zIndex = 999;
            floatingHeader.style.display = 'inline-block';
            floatingHeader.style.width = full_width + 'px';
        } else {
            floatingHeader.style.display = 'none';
        }

        sendColumnWidths(lwcElement);
    
    } catch (error){}
}

function fixWidth(lwcElement){
    try{
        const dataTable = lwcElement.getElementsByClassName("dataTable")[0];
        const floatingHeader = lwcElement.getElementsByClassName("floatingHeader")[0];
        
        if(dataTable != null && floatingHeader != null){
            var full_width = dataTable.offsetWidth;
            floatingHeader.style.width = full_width + 'px';
        }

        setTimeout(() => {
            sendColumnWidths(lwcElement);
        }, 500);
        
    } catch (error){}
}