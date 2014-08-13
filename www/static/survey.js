// Put your custom code here
//var apipath='http://127.0.0.1:8000/em/default/';
//var apipath='http://e.businesssolutionapps.com/em/default/';
//var apipath='http://127.0.0.1:8000/em/default/';

//var apipath='http://e2.businesssolutionapps.com/unilever/syncmobile/';
//var apipath_image = 'http://e2.businesssolutionapps.com/unilever/';
//var apipath_image = 'http://127.0.0.1:8000/gpmreporting/';

var apipath='http://e.businesssolutionapps.com/gp/syncmobile/';
//var apipath='http://127.0.0.1:8000/gpmreporting/syncmobile/';


//-------GET GEO LOCATION Start----------------------------
function getlocationand_askhelp() { //location
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
}
	 
// onSuccess Geolocation
function onSuccess(position) {		
	$("#lat").val(position.coords.latitude);
	$("#long").val(position.coords.longitude);

}

function onError(error) {
	$("#lat").val(0);
	$("#long").val(0);
	}
	
//-------GET GEO LOCATION End----------------------------
//=============get time start===================
function get_date() {
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() + "-" 
			+ (currentdate.getMonth()+1)  + "-"  
			+ currentdate.getDate() + " "
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
	return datetime;
}
//=============get tieme end=============


//--------------------------------------------- Exit Application
function exit() {
navigator.app.exitApp();
}

		
// -------------- If Not synced, Show login
function first_page(){
	if ((localStorage.synced!='YES')){
		var url = "#login";
		$.mobile.navigate(url);		
	}
}

//=================after select an outlet
function clear_autho(){
	localStorage.cid='';
	localStorage.cm_id='';
	localStorage.cm_pass='';
	localStorage.synced='';
	localStorage.synced='';
	localStorage.synccode='';
	localStorage.clientListShow='';
	localStorage.clientListShowReport='';
	
	localStorage.visitTypeListShow='';	
	localStorage.report_data=""
	
	var url = "#login";
	$.mobile.navigate(url);	
	location.reload();
	
}

//========================= Longin-Check user
function check_user() {
	var cm_id=$("#cm_id").val();
	var cm_pass=$("#cm_pass").val();
	
	if (cm_id=="" || cm_id==undefined || cm_pass=="" || cm_pass==undefined){
		var url = "#login";      
		$.mobile.navigate(url);
		$("#error_login").html("Required Rep ID and Rep Pass");	
	}else{
		$("#error_login").html("");	
		
		$("#login_image").show();
		$("#loginButton").hide();
		localStorage.cid='GP';
		localStorage.cm_id=cm_id;
   		localStorage.cm_pass=cm_pass;
   		//localStorage.synccode=synccode;
		localStorage.synced='NO'
   				
		//$("#error_login").html(apipath+'check_user?cid='+localStorage.cid+'&repid='+localStorage.cm_id+'&rep_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);	
   		
		$.ajax({
				 type: 'POST',
				 url: apipath+'check_user?cid='+localStorage.cid+'&repid='+localStorage.cm_id+'&rep_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode,
				 success: function(result) {
					 	//$("#error_login").html('ajax');				
						if (result==''){
							$("#loginButton").show();
							$("#login_image").hide();
							alert ('Sorry Network not available');
							
						}else{
							
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){
								$("#loginButton").show();
								$("#login_image").hide();
								$("#error_login").html('Unauthorized User');
								
							}else if (resultArray[0]=='SUCCESS'){
								$("#loginButton").show();
								$("#login_image").hide();
								
								localStorage.synced='YES';
								localStorage.synccode=resultArray[1];								
								var client_string=resultArray[2];																
								var visit_type_string=resultArray[3];
								
								var clientList = client_string.split('<rd>');
								var visitTypeList = visit_type_string.split('<rd>');								
								
								//alert (client_string);
								
								//======= Name of org/Client
								var clientListShow='<select name="client_org" id="client_org_id" onChange="checkOthersComp()" data-native-menu="false"><option value="0" >Name Of the Org.</option>'
								clientListShowLength=clientList.length								
								for (var i=0; i < clientListShowLength; i++){
									var clientValueArray = clientList[i].split('<fd>');
									var clientID=clientValueArray[0];
									var clientName=clientValueArray[1];
									var clientZone=clientValueArray[2];
									
									clientListShow=clientListShow+'<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>'
								}
								clientListShow=clientListShow+'<option value="Others" >Others</option>'
								clientListShow=clientListShow+'</select>'
								
								localStorage.clientListShow=clientListShow;
								
								//======= Name of org/Client report
								var clientListShowReport='<select name="rpt_client_org" id="rpt_client_org_id" data-native-menu="false"><option value="0" >Name Of the Org.</option>'
								var rptclientListShowLength=clientList.length								
								for (var i=0; i < rptclientListShowLength; i++){
									var rptclientValueArray = clientList[i].split('<fd>');
									var clientID=rptclientValueArray[0];
									var clientName=rptclientValueArray[1];
									var clientZone=rptclientValueArray[2];
									
									clientListShowReport=clientListShowReport+'<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>'
								}
								clientListShowReport=clientListShowReport+'<option value="Others" >Others</option>'
								clientListShowReport=clientListShowReport+'</select>'
								
								localStorage.clientListShowReport=clientListShowReport;
								
								//======= Visit Type
								var visitTypeListShow=''
								visitTypeListShow='<select name="visit_type" id="visit_type_id" onChange="checkOthersVisitType()" data-native-menu="false"><option value="0" >Visit Type</option>'
								visitTypeListShowLength=visitTypeList.length								
								for (var i=0; i < visitTypeListShowLength; i++){
									visitTypeValue = visitTypeList[i];
									
									visitTypeListShow=visitTypeListShow+'<option value="'+visitTypeValue+'" >'+visitTypeValue+'</option>'
								}
								visitTypeListShow=visitTypeListShow+'<option value="Others" >Others</option>'
								visitTypeListShow=visitTypeListShow+'</select>'
								
								localStorage.visitTypeListShow=visitTypeListShow;
								
								//====================
								//$("#visit_type_div_id").html(visitTypeListShow);
								
								//$('#client_org_div_id').empty();
								//$('#client_org_div_id').append(clientListShow).trigger('create');
								
								//$('#visit_type_div_id').empty();
								//$('#visit_type_div_id').append(visitTypeListShow).trigger('create');
													
								var url = "#menuPage";
								$.mobile.navigate(url);
								location.reload();
								
								//getMenuPage();
							}else{
								$("#loginButton").show();
								$("#login_image").hide();
								$("#error_login").html('Unauthorized User');							
								}
						}
				      },
				  error: function(result) {
					  $("#loginButton").show();
					  $("#login_image").hide();
					  var url = "#login";
					  $.mobile.navigate(url);	
				  }
			  });//end ajax
		  }//end else	
	}//function


//=====================  Menu Page Refresh
function getMenuPage() { 
	clientListShow=localStorage.clientListShow;
	visitTypeListShow=localStorage.visitTypeListShow;
	if((visitTypeListShow!=undefined) && (clientListShow!='undefined')){
		var url = "#menuPage";
		$(location).attr('href',url);
		location.reload();
	}
}

//======================Submit Data
function submit_data() {
		
	$("#submit_data").html("Sync in progress. Please Wait ..");
	//=========================AJAX Submit
	
	var selected_period=($("input:radio[name='RadioPeriod']:checked").val())
	
	if (selected_period=="" || selected_period==undefined){
		$("#submit_data").html("Required Day");
	}else{
		
		var client_org_val=$( "#client_org_id").val();
		var visit_type_val=$( "#visit_type_id").val();
		var client_org_others_val=$( "#client_org_others_id").val();
		var visit_type_others_val=$( "#visit_type_others_id").val();
		var remarks_val=$( "#remarks_id").val();
		
		var lat=$( "#lat").val().toString();
		var long=$( "#long").val().toString();	
		///var latlong=lat.toString()+","+long.toString()
		//alert (selected_period);
		var client_new="";
		if (client_org_val=='Others'){
			client_new=client_org_others_val
			}
		var visit_type_new="";
		if (visit_type_val=='Others'){
			visit_type_new=visit_type_others_val
			}
		
		if (client_org_val=="0"){
			$("#submit_data").html("Required Name Of Org.");
		}else{
			if (visit_type_val=="0"){
				$("#submit_data").html("Required Visit Type");
			}else{
				
				if (client_org_val=='Others' && client_new==''){
					$("#submit_data").html("Required Others Organization");
				}else{
					if (visit_type_val=='Others' && visit_type_new==''){
						$("#submit_data").html("Required Others Visit Type");
					}else{
					
						$("#sub_button").hide();
						
						//alert(apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long);
						//$("#submit_data").html(apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long);
						
						$.ajax({
								type: 'POST',
								url: apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long,
								success: function(result) {	
										//alert ('nadira');
										if (result==''){
											$("#sub_button").show();
											$("#submit_data").html('Sorry Network not available');												
										
										}else if (result=='FAILED'){
											$("#sub_button").show();
											$("#submit_data").html('Unauthorized User');
										
										}else if (result=='SUCCESS'){
												var url = "#endPage";
												$.mobile.navigate(url);								
												//location.reload();				
										};
										
									},error: function(result) {
									  //alert ("error");
									  $("#sub_button").show();
									  $("#submit_data").html("Connectivity Error.Please Check Your Network Connection and Try Again");
									  var url = "#menuPage";
									  $.mobile.navigate(url);	
								  }
							  });//end ajax
					
					}//check others visit type
				}//check Other organization
			}//check visit type
		}//check name of org
	}//check period
}


//================= Reports
function get_report(){
	localStorage.report_data="";	
	//=====	
	var url = "#report_page";
	$.mobile.navigate(url);
	//location.reload();
}


function getLastFiveVisit(){
		localStorage.report_data="";
		$("#report_message").html('');
		$("#report_data").html('');
		
		var rpt_client_val=$( "#rpt_client_org_id").val();
		
		if (rpt_client_val=="0"){
			$("#report_message").html('Required Name Of Org.');
		}else{
			if (rpt_client_val=='Others'){
				rpt_client_val='00000'
			}
			$('#loader').show();
			
			$.ajax({
				type: 'POST',
				url: apipath+'getLastFiveVisitReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&client_id='+rpt_client_val,
				success: function(result) {	
						//alert ('nadira');
						if (result==''){
							$('#loader').hide();
							$("#report_message").html('Sorry Network not available');												
						
						}else if (result=='FAILED'){
							$('#loader').hide();							
							$("#report_message").html('Unauthorized User');
						
						}else{	
								var resultRetArray = result.split('<rdrd>');
								
								if (resultRetArray.length==3){
									var resultStrList = resultRetArray[2].split('<rd>');								
									
									
									var resultStrListLength=resultStrList.length
									
									var resultHeadShow='<b>'+resultRetArray[1]+'-'+resultRetArray[0]+'</b>'
									//00B7B7,00AEAE
									
									//var resultShow='<table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-color:#EEEEEE;font-size:11px">'
									var resultShow='<table class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%">'
									
									if (resultRetArray[0]!="00000"){
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>V.Date</b></td><td ><b>Visit Type</b></td><td ><b>Remarks</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');										
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[5]+'</td><td >'+resultValArray[2]+'</td><td >'+resultValArray[3]+'</td></tr>'
										}
									}else{
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>New Org.</b></td><td ><b>V.Date</b></td><td ><b>Visit Type</b></td><td ><b>Remarks</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');										
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[0]+'</td><td >'+resultValArray[5]+'</td><td >'+resultValArray[2]+'</td><td >'+resultValArray[3]+'</td></tr>'
										}
										
									}
									
									resultShow=resultShow+'</table>'
									
									localStorage.report_data=resultShow	
																			
									//==========
									$("#report_data").html(localStorage.report_data);
									$('#loader').hide();					
									//=====
									
									var url = "#report_page";
									$.mobile.navigate(url);								
									//location.reload();	
								
							}
						};
						
					},error: function(result) {		
					  $('#loader').hide();		  
					  $("#report_message").html("Connectivity Error.Please Check Your Network Connection and Try Again");
					  var url = "#report_page";
					  $.mobile.navigate(url);
					  
				  }
			  });//end ajax
		  
		};
		 
}

//=============


		