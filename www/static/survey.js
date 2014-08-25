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
	localStorage.synccode='';
		
	localStorage.repListShowReport='';
	
	localStorage.clientListStr='';
	localStorage.visitTypeListStr='';
	localStorage.repListStr='';
		
	localStorage.report_data=""
	localStorage.report_visitdata=""
	
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
   		
		//alert(apipath+'check_user?cid='+localStorage.cid+'&repid='+localStorage.cm_id+'&rep_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);	
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
								
								
								localStorage.synccode=resultArray[1];
								localStorage.clientListStr=resultArray[2];
								localStorage.visitTypeListStr=resultArray[3];
								localStorage.repListStr=resultArray[4];
								
								var rep_string=resultArray[4];
															
								var repList = rep_string.split('<rd>');
								
								//======= Name of rep/KAM report
								var repListShowReport=''
								var rptRepListShowLength=repList.length
								if (rep_string!=''){									
									repListShowReport='<select name="rpt_rep" id="rpt_rep_id" data-native-menu="false"><option value="0" >Select KAM</option>'
									repListShowReport=repListShowReport+'<option value="ALL" >ALL</option>'
									for (var i=0; i < rptRepListShowLength; i++){
										var rptRepValueArray = repList[i].split('<fd>');
										var repID=rptRepValueArray[0];
										var repName=rptRepValueArray[1];																		
										repListShowReport=repListShowReport+'<option value="'+repID+'" >'+repName+'-'+repID+'</option>'
									}
									repListShowReport=repListShowReport+'</select>'									
								
								}
								localStorage.repListShowReport=repListShowReport;
								
								//====================
								
								localStorage.synced='YES';
									
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


//===========  Client List Combo
function addClientList() {
	var client_string=localStorage.clientListStr;
	
	var clientList = client_string.split('<rd>');
	var clientListShowLength=clientList.length	
	
	var ob1 = $("#client_org_id");
	var ob2 = $("#rpt_client_org_id");
		
	for (var i=0; i < clientListShowLength; i++){
		var clientValueArray = clientList[i].split('<fd>');
		var clientID=clientValueArray[0];
		var clientName=clientValueArray[1];
		var clientZone=clientValueArray[2];
		
		ob1.append('<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>');
		ob2.append('<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>');		
	}
	ob1.append('<option value="Others" >Others</option>');	
	ob2.append('<option value="Others" >Others</option>');
	
}

//======= Visit Type Combo
function addVisitTypeList() {
	var visit_type_string=localStorage.visitTypeListStr;
	
	var visitTypeList = visit_type_string.split('<rd>');
	var visitTypeListShowLength=visitTypeList.length	
	
	var ob3 = $("#visit_type_id");
			
	for (var i=0; i < visitTypeListShowLength; i++){
		var visitTypeValue = visitTypeList[i];
		
		ob3.append('<option value="'+visitTypeValue+'" >'+visitTypeValue+'</option>');		
	}
	ob3.append('<option value="Others" >Others</option>');
		
}

//=====================  Menu Page Refresh
function getMenuPage() { 
	clientListStr=localStorage.clientListStr;
	visitTypeListStr=localStorage.visitTypeListStr;
	
	if((visitTypeListStr!=undefined) && (clientListStr!='undefined')){
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


//================= visit log
function get_visitlog(){
	localStorage.report_data="";	
	//=====	
	var url = "#visitlog_page";
	$.mobile.navigate(url);	
}

//================= Reports
function get_visit_reports(){
	localStorage.reports_visitdata="";	
	//=====
	var url = "#report_page";
	$.mobile.navigate(url);
	location.reload();
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
									
									//var resultHeadShow='<b>'+resultRetArray[1]+'-'+resultRetArray[0]+'</b>'
									//00B7B7,00AEAE
									
									//var resultShow='<table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-color:#EEEEEE;font-size:11px">'
									var resultShow='<table class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%">'
									
									if (resultRetArray[0]!="00000"){
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>V.Date</b></td><td ><b>Visit Type</b></td><td ><b>Remarks</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');	
											if(resultValArray[5]=='' || resultValArray[5]==undefined){
												continue;
												}
																		
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[5]+'</td><td >'+resultValArray[2]+'</td><td >'+resultValArray[3]+'</td></tr>'
										}
									}else{
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>New Org.</b></td><td ><b>V.Date</b></td><td ><b>Visit Type</b></td><td ><b>Remarks</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');										
											if(resultValArray[0]=='' || resultValArray[5]==undefined){
												continue;
												}
											
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[0]+'</td><td >'+resultValArray[5]+'</td><td >'+resultValArray[2]+'</td><td >'+resultValArray[3]+'</td></tr>'
										}
										
									}
									
									resultShow=resultShow+'</table>'
									
									localStorage.report_data=resultShow	
																			
									//==========
									$("#report_data").html(localStorage.report_data);
									$('#loader').hide();					
									//=====
									
									var url = "#visitlog_page";
									$.mobile.navigate(url);								
									//location.reload();	
								
							}
						};
						
					},error: function(result) {		
					  $('#loader').hide();		  
					  $("#report_message").html("Connectivity Error.Please Check Your Network Connection and Try Again");
					  var url = "#visitlog_page";
					  $.mobile.navigate(url);
					  
				  }
			  });//end ajax
		  
		};
		 
}

//=============

function getSummaryReport(){
		localStorage.report_visitdata="";
		$("#report_visit_message").html('');
		$("#report_visitdata").html('');
		
		var rpt_rep_val=$( "#rpt_rep_id").val();
		
		var selected_period_rpt=($("input:radio[name='RadioPeriodRpt']:checked").val())	
		if (selected_period_rpt=="" || selected_period_rpt==undefined){
			$("#report_visit_message").html("Required Day");
		}else{			
			if (rpt_rep_val=="0"){
				$("#report_visit_message").html('Select KAM');
			}else{
				
				if (rpt_rep_val==undefined){
					rpt_rep_val='ALL'
					}
				
				$('#summary_loader').show();
				//alert(apipath+'getSummaryReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&period='+selected_period_rpt+'&kamid='+rpt_rep_val);
				$.ajax({
					type: 'POST',
					url: apipath+'getSummaryReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&period='+selected_period_rpt+'&kamid='+rpt_rep_val,
					success: function(result) {	
							//alert ('nadira');
							if (result==''){
								$('#summary_loader').hide();
								$("#report_visit_message").html('Sorry Network not available');												
							
							}else if (result=='FAILED'){
								$('#summary_loader').hide();							
								$("#report_visit_message").html('Unauthorized User');
							
							}else{	
									var resultRetArray = result.split('<rdrd>');
									
									if (resultRetArray.length==3){
										var resultStrList = resultRetArray[2].split('<rd>');								
										
										
										var resultStrListLength=resultStrList.length
										
										//var resultHeadShow='<b>'+resultRetArray[1]+'-'+resultRetArray[0]+'</b>'
										//00B7B7,00AEAE
										
										//var resultShow='<table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-color:#EEEEEE;font-size:11px">'
										var resultShow='<table class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%">'
										
										var visitCount=0
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>Region</b></td><td ><b>Type</b></td><td ><b>Visit</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');
											if(resultValArray[0]=='' || resultValArray[0]==undefined){
												continue;
												}
																					
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[0]+'</td><td >'+resultValArray[1]+'</td><td >'+resultValArray[2]+'</td></tr>'
											visitCount=visitCount+eval(resultValArray[2]);
											
										}
										if (visitCount>0){
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td ></td><td ><b>Total</b></td><td ><b>'+visitCount+'</b></td></tr>'
											}
										
										resultShow=resultShow+'</table>'
										
										localStorage.report_visitdata=resultShow	
										
										//==========
										$("#report_visitdata").html(localStorage.report_visitdata);
										$('#summary_loader').hide();					
										//=====
										
										var url = "#report_page";
										$.mobile.navigate(url);								
										//location.reload();
								}
							};
							
						},error: function(result) {		
						  $('#summary_loader').hide();		  
						  $("#report_visit_message").html("Connectivity Error.Please Check Your Network Connection and Try Again");
						  var url = "#report_page";
						  $.mobile.navigate(url);
						  
					  }
				  });//end ajax
			  
			};
	};
}
		