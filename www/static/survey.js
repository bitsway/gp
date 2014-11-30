
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
	if (localStorage.synced=='YES'){		
		var url = "#menuPage";
		$.mobile.navigate(url);		
	}else{
		var url = "#login";
		$.mobile.navigate(url);		
		}
}

//=================after select an outlet
function clear_autho(){
	var check_clear=$("input[name='clear_auth_check']:checked").val();
	
	if(check_clear!='Yes'){
		$("#error_login").html("Required Confirm Clear");			
	}else{
		localStorage.cid='';
		localStorage.cm_id='';
		localStorage.cm_pass='';
		localStorage.synced='';
		localStorage.synccode='';
		
		localStorage.repListShowReport='';
		
		localStorage.clientListStr='';
		localStorage.visitTypeListStr='';
		localStorage.repListStr='';
		
		localStorage.client_org_combo='';
		localStorage.rpt_client_org_combo='';
		
		
		var url = "#login";
		$.mobile.navigate(url);	
		location.reload();
	}
}

function change_pass_clear_autho(){	
	localStorage.cid='';
	localStorage.cm_id='';
	localStorage.cm_pass='';
	localStorage.synced='';
	localStorage.synccode='';
	
	localStorage.repListShowReport='';
	
	localStorage.clientListStr='';
	localStorage.visitTypeListStr='';
	localStorage.repListStr='';
	
	localStorage.client_org_combo='';
	localStorage.rpt_client_org_combo='';
	
	
	var url = "#login";
	$.mobile.navigate(url);	
	location.reload();	
}


function login_clear_autho(){	
	localStorage.cid='';
	localStorage.cm_id='';
	localStorage.cm_pass='';
	localStorage.synced='';
	localStorage.synccode='';
	
	localStorage.repListShowReport='';
	
	localStorage.clientListStr='';
	localStorage.visitTypeListStr='';
	localStorage.repListStr='';
	
	localStorage.client_org_combo='';
	localStorage.rpt_client_org_combo='';
		
}

//========================= Longin-Check user
function check_user() {
	var cm_id=$("#cm_id").val();
	var cm_pass=$("#cm_pass").val();
	
	if (cm_id=="" || cm_id==undefined || cm_pass=="" || cm_pass==undefined){
		var url = "#login";      
		$.mobile.navigate(url);
		$("#error_login").html("Required ID and Pass");	
	}else{
		$("#error_login").html("");	
		
		$("#wait_image_login").show();
		$("#loginButton").hide();
		
		login_clear_autho();
		
		localStorage.cid='GP';
		localStorage.cm_id=cm_id;
   		localStorage.cm_pass=cm_pass;   		
		localStorage.synced=''
   		
		//$("#error_login").html(apipath+'check_user?cid='+localStorage.cid+'&repid='+localStorage.cm_id+'&rep_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);	
   		
		$.ajax({
				 type: 'POST',
				 url: apipath+'check_user?cid='+localStorage.cid+'&repid='+localStorage.cm_id+'&rep_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode,
				 success: function(result) {
					 	//$("#error_login").html('ajax');				
						if (result==''){
							$("#loginButton").show();
							$("#wait_image_login").hide();							
							$("#error_login").html("Sorry Network not available");	
						}else{
							
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){
								$("#loginButton").show();
								$("#wait_image_login").hide();
								$("#error_login").html('Unauthorized User');
								
							}else if (resultArray[0]=='SUCCESS'){
								$("#loginButton").show();
								$("#wait_image_login").hide();
								
								localStorage.synccode=resultArray[1];
								
								//localStorage.clientListStr=resultArray[2];								
								//localStorage.visitTypeListStr=resultArray[3];
								//localStorage.repListStr=resultArray[4];
								
								var client_string=resultArray[2];
								var visitTypeListStr=resultArray[3];
								var rep_string=resultArray[4];
								
								
								//======= Name of rep/KAM report
								var repList = rep_string.split('<rd>');
								var rptRepListShowLength=repList.length
								
								var repListShowReport=''								
								if (rep_string!=''){									
									repListShowReport='<option value="0" >Select KAM</option>'
									repListShowReport+='<option value="ALL" >ALL</option>'
									for (var i=0; i < rptRepListShowLength; i++){
										var rptRepValueArray = repList[i].split('<fd>');
										var repID=rptRepValueArray[0];
										var repName=rptRepValueArray[1];																		
										repListShowReport+='<option value="'+repID+'" >'+repName+'-'+repID+'</option>'
									}
								}
								localStorage.repListShowReport=repListShowReport;
								
								//==================== Client/Organization Combo															
								var clientList = client_string.split('<rd>');
								var clientListShowLength=clientList.length	
								
								var client_org_id='<option value="0" >Name Of the Org.</option>';
								var rpt_client_org_id='<option value="0" >Name Of the Org.</option>';
								
								for (var i=0; i < clientListShowLength; i++){
									var clientValueArray = clientList[i].split('<fd>');
									var clientID=clientValueArray[0];
									var clientName=clientValueArray[1].replace('-',' ');
									var clientZone=clientValueArray[2];
									
									client_org_id+='<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>';
									rpt_client_org_id+='<option value="'+clientID+'" >'+clientName+'-'+clientID+'</option>';
											
								}
								client_org_id+='<option value="Others" >Others</option>';
								rpt_client_org_id+='<option value="Others" >Others</option>';
								
								localStorage.client_org_combo=client_org_id;
								localStorage.rpt_client_org_combo=rpt_client_org_id;
								
								
								//==================== Visit Type Combo
								var visitTypeList = visitTypeListStr.split('<rd>');
								var visitTypeListShowLength=visitTypeList.length	
								
								var visit_type_id='<option value="0" >Visit Type</option>';
								for (var i=0; i < visitTypeListShowLength; i++){
									var visitTypeValue = visitTypeList[i];
									
									visit_type_id+='<option value="'+visitTypeValue+'" >'+visitTypeValue+'</option>';		
								}
								visit_type_id+='<option value="Others" >Others</option>';	
								
								localStorage.visitTypeListStr=visit_type_id;
								
								//=========================
								localStorage.synced='YES';
								
								var url = "#menuPage";
								$.mobile.navigate(url);
								location.reload();
								
							}else{
								$("#loginButton").show();
								$("#wait_image_login").hide();
								$("#error_login").html('Unauthorized User');							
								}
						}
				      },
				  error: function(result) {
					  $("#loginButton").show();
					  $("#wait_image_login").hide();
					  var url = "#login";
					  $.mobile.navigate(url);	
				  }
			  });//end ajax
		  }//end else	
	}//function


//===========  Client List Combo
/*function addClientList() {
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
	
}*/

//======= Visit Type Combo
/*function addVisitTypeList() {
	var visit_type_string=localStorage.visitTypeListStr;
	
	var visitTypeList = visit_type_string.split('<rd>');
	var visitTypeListShowLength=visitTypeList.length	
	
	var ob3 = $("#visit_type_id");
			
	for (var i=0; i < visitTypeListShowLength; i++){
		var visitTypeValue = visitTypeList[i];
		
		ob3.append('<option value="'+visitTypeValue+'" >'+visitTypeValue+'</option>');		
	}
	ob3.append('<option value="Others" >Others</option>');
		
}*/

//=====================  Menu Page Refresh
/*function getMenuPage() { 
	clientListStr=localStorage.clientListStr;
	visitTypeListStr=localStorage.visitTypeListStr;
	
	if((visitTypeListStr!=undefined) && (clientListStr!='undefined')){
		var url = "#menuPage";		
		$.mobile.navigate(url);		
	}
}*/

//=====================  Menu Page Refresh
function visit_report() {	
	//var selected_route=($("input:radio[name='RadioRoute']:checked").val())	
	//$( "input:radio[name='RadioPeriod'][value='Today']" ).attr('checked','true');	
	//$( "input:radio[name='RadioPeriod'][value='Today']" ).attr('checked',true);
	
	client_org_combo=localStorage.client_org_combo;
	visitTypeListCombo=localStorage.visitTypeListStr;
	
	//------
	var client_org_id_ob=$("#client_org_id");
	client_org_id_ob.empty();
	client_org_id_ob.append(client_org_combo);
	client_org_id_ob.selectedIndex = 0;
	
	//------
	var visit_type_id_ob=$("#visit_type_id");
	visit_type_id_ob.empty();
	visit_type_id_ob.append(visitTypeListCombo);
	visit_type_id_ob.selectedIndex = 0;
	
	//------
	$("#client_org_others_id").val('');
	$("#visit_type_others_id").val('');
	$("#remarks_id").val('');
	
	$("#client_org_others_id").hide();
	$("#visit_type_others_id").hide();
	
	var url = "#visit_page";
	$.mobile.navigate(url);	
	
	//-----------------
	client_org_id_ob.selectmenu("refresh");
	visit_type_id_ob.selectmenu("refresh");
}

//====================== Submit Data
function submit_data() {
	$("#error_visit_submit").html("");
	
	var selected_period=($("input:radio[name='RadioPeriod']:checked").val())
	
	if (selected_period=="" || selected_period==undefined){
		$("#error_visit_submit").html("Day Required");
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
			$("#error_visit_submit").html("Name Of Org. Required");
		}else{
			if (visit_type_val=="0"){
				$("#error_visit_submit").html("Visit Type Required");
			}else{
				
				if (client_org_val=='Others' && client_new==''){
					$("#error_visit_submit").html("Others Organization Required");
				}else{
					if (visit_type_val=='Others' && visit_type_new==''){
						$("#error_visit_submit").html("Others Visit Type Required");
					}else{
					
						$("#btn_visit_submit").hide();
						$("#wait_visit_submit").show();
						
						//alert(apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long);
						//$("#submit_data").html(apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long);
						
						$.ajax({
								type: 'POST',
								url: apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&visit_day='+selected_period+'&client_id='+client_org_val+'&client_new='+client_new+'&visit_type='+visit_type_val+'&visit_type_new='+ visit_type_new +'&remarks='+remarks_val+'&lat='+lat+'&long='+long,
								success: function(result) {	
										//alert ('nadira');
										if (result==''){
											$("#error_visit_submit").html('Sorry Network not available');	
											$("#wait_visit_submit").hide();
											$("#btn_visit_submit").show();
																						
										
										}else if (result=='FAILED'){											
											$("#error_visit_submit").html('Unauthorized User');
											$("#wait_visit_submit").hide();
											$("#btn_visit_submit").show();	
											
										}else if (result=='SUCCESS'){
											
											$("#client_org_others_id").val('');
											$("#visit_type_others_id").val('');
											$("#remarks_id").val('');
											
											$("#client_org_others_id").hide();
											$("#visit_type_others_id").hide();
											
											
											$("#wait_visit_submit").hide();
											$("#btn_visit_submit").show();
																				
											var url = "#endPage";
											$.mobile.navigate(url);
																						
										};
										
									},error: function(result) {
									  $("#error_visit_submit").html("Connectivity Error.Please Check Your Network Connection and Try Again");
									  
									  $("#wait_visit_submit").hide();
									  $("#btn_visit_submit").show();
									  	
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
		
	client_org_combo=localStorage.client_org_combo;
	
	//------
	var rpt_client_org_id_ob=$("#rpt_client_org_id");
	rpt_client_org_id_ob.empty();
	rpt_client_org_id_ob.append(client_org_combo);
	rpt_client_org_id_ob.selectedIndex = 0;
	
	//------
	
	var url = "#visitlog_page";
	$.mobile.navigate(url);	
	
	//-----------------
	rpt_client_org_id_ob.selectmenu("refresh");
	
}
//======
function getLastFiveVisit(){
		
		$("#error_lastFiveVisit").html('');
		$("#report_data").html('');
		
		$("#tbl_lastFiveVisit_show").empty();
		
		var rpt_client_val=$( "#rpt_client_org_id").val();
		
		if (rpt_client_val=="0"){
			$("#error_lastFiveVisit").html('Name Of Org. Required');
		}else{
			if (rpt_client_val=='Others'){
				rpt_client_val='00000'
			}
			$('#btn_lastFiveVisit').hide();
			$('#wait_lastFiveVisit').show();
			
			
			$.ajax({
				type: 'POST',
				url: apipath+'getLastFiveVisitReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&client_id='+rpt_client_val,
				success: function(result) {	
						//alert ('nadira');
						if (result==''){							
							$("#error_lastFiveVisit").html('Sorry Network not available');	
							$('#wait_lastFiveVisit').hide();
							$('#btn_lastFiveVisit').show();																		
						
						}else if (result=='FAILED'){						
							$("#error_lastFiveVisit").html('Unauthorized User');
							$('#wait_lastFiveVisit').hide();
							$('#btn_lastFiveVisit').show();	
						}else{	
							var resultRetArray = result.split('<rdrd>');
							
							if (resultRetArray.length==3){
								var resultStrList = resultRetArray[2].split('<rd>');								
								
								var resultStrListLength=resultStrList.length
								
								//var resultShow='<table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-color:#EEEEEE;font-size:11px">'
								var resultShow='<table class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%">'
								//var resultShow='';
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
												
								//==========
								$("#report_data").html(resultShow);
								
								$('#wait_lastFiveVisit').hide();
								$('#btn_lastFiveVisit').show();
								//=====
								
								var url = "#visitlog_page";
								$.mobile.navigate(url);								
									
							}
						};
						
					},error: function(result) {	  
					  $("#error_lastFiveVisit").html("Connectivity Error.Please Check Your Network Connection and Try Again");
					  $('#wait_lastFiveVisit').hide();
					  $('#btn_lastFiveVisit').show();
				  }
				  
			  });//end ajax		  
		};
}


//================= Reports
function get_visit_reports(){
		
	repListShowReport_combo=localStorage.repListShowReport;
	
	//------
	var rpt_rep_id_ob=$("#rpt_rep_id");
	rpt_rep_id_ob.empty();
	rpt_rep_id_ob.append(repListShowReport_combo);
	rpt_rep_id_ob.selectedIndex = 0;
	
	//------
	if (repListShowReport_combo=='' || repListShowReport_combo==undefined){
		$("#rpt_rep_div_id").hide();		
	}else{
		$("#rpt_rep_div_id").show();
	}
	
	
	
	//------
	var url = "#report_page";
	$.mobile.navigate(url);	
	
	//-----------------
	rpt_rep_id_ob.selectmenu("refresh");
	
}

//=============

function getSummaryReport(){		
		$("#error_report_summary").html('');
		$("#report_visitdata").html('');
		
		var rpt_rep_val=$( "#rpt_rep_id").val();
		
		var selected_period_rpt=($("input:radio[name='RadioPeriodRpt']:checked").val())	
		if (selected_period_rpt=="" || selected_period_rpt==undefined){
			$("#error_report_summary").html("Day Required");
		}else{			
			if (rpt_rep_val=="0"){
				$("#error_report_summary").html('KAM Required');
			}else{
				
				if (rpt_rep_val==undefined){
					rpt_rep_val='ALL'
					}
				
				$('#btn_report_summary').hide();
				$('#wait_report_summary').show();
				
				//alert(apipath+'getSummaryReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&period='+selected_period_rpt+'&kamid='+rpt_rep_val);
				$.ajax({
					type: 'POST',
					url: apipath+'getSummaryReport?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&period='+selected_period_rpt+'&kamid='+rpt_rep_val,
					success: function(result) {	
							//alert ('nadira');
							if (result==''){
								$("#error_report_summary").html('Sorry Network not available');												
								$('#wait_report_summary').hide();
								$('#btn_report_summary').show();
								
							}else if (result=='FAILED'){					
								$("#error_report_summary").html('Unauthorized User');
								$('#wait_report_summary').hide();
								$('#btn_report_summary').show();
							
							}else{	
									var resultRetArray = result.split('<rdrd>');
									
									if (resultRetArray.length==3){
										var resultStrList = resultRetArray[2].split('<rd>');								
										var resultStrListLength=resultStrList.length
										
										//var resultShow='<table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-color:#EEEEEE;font-size:11px">'
										var resultShow='<table class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:0px; width:100%">'
										
										var visitCount=0
										resultShow=resultShow+'<tr style="font-size:11px;background-color:#96CBCB;"><td ><b>Visit Type</b></td><td ><b>Visit</b></td></tr>'	
										for (var i=0; i < resultStrListLength; i++){
											resultValArray = resultStrList[i].split('<fd>');
											if(resultValArray[0]=='' || resultValArray[0]==undefined){
												continue;
												}
																					
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td >'+resultValArray[0]+'</td><td >'+resultValArray[1]+'</td></tr>'
											visitCount=visitCount+eval(resultValArray[1]);
											
										}
										if (visitCount>0){
											resultShow=resultShow+'<tr style="font-size:11px;background-color:#FFF;"><td ><b>Total</b></td><td ><b>'+visitCount+'</b></td></tr>'
											}
										
										resultShow=resultShow+'</table>'
										
										//==========
										$("#report_visitdata").html(resultShow);
										$('#wait_report_summary').hide();
										$('#btn_report_summary').show();		
										
										//=====
										var url = "#report_page";
										$.mobile.navigate(url);
								}
							};
							
						},error: function(result) {	  
						  $("#error_report_summary").html("Connectivity Error.Please Check Your Network Connection and Try Again");
						  $('#wait_report_summary').hide();
						  $('#btn_report_summary').show();						  
					  }
					  
				  });//end ajax
			  
			};
	};
}
	

//=============
function change_password(){		
		$("#error_change_password").html('');
		
		var old_password=$( "#old_password").val();
		var new_password=$( "#new_password").val();
		var confirm_password=$( "#confirm_password").val();
		
		
		var selected_period_rpt=($("input:radio[name='RadioPeriodRpt']:checked").val())	
		if (old_password!=localStorage.cm_pass){
			$("#error_change_password").html("Invalid Old Password");
		}else{
			var specialChar1=new_password.indexOf('&')
			var specialChar2=new_password.indexOf('#')
			
			if(specialChar1 >= 0 || specialChar2 >= 0){
				$("#error_change_password").html("Character '&','#'  not allowed");
			}else{
			if (new_password.length < 8 || new_password.length>12){
				$("#error_change_password").html("8-12 Character required");
			}else{
				if (new_password!=confirm_password){
					$("#error_change_password").html("New Password and Confirm Password Required Same");
				}else{
					
					$('#btn_change_password').hide();
					$('#wait_change_password').show();
					
					//$("#error_change_password").html(apipath+'changePassword?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&new_pass='+new_password);
					$.ajax({
						type: 'POST',
						url: apipath+'changePassword?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&new_pass='+new_password,
						success: function(result) {	
								//alert ('nadira');
								if (result==''){
									$("#error_change_password").html('Sorry Network not available');												
									$('#wait_change_password').hide();
									$('#btn_change_password').show();
									
								}else if (result=='FAILED'){					
									$("#error_change_password").html('Unauthorized User');
									$('#wait_change_password').hide();
									$('#btn_change_password').show();
								
								}else if (result=='SUCCESS'){
									//==========
																	
									$('#wait_change_password').hide();
									$('#btn_change_password').show();		
									
									var url = "#change_password_success";
									$.mobile.navigate(url);
									
									//=====
								};
								
							},error: function(result) {	  
							  $("#error_change_password").html("Connectivity Error.Please Check Your Network Connection and Try Again");
							  $('#wait_change_password').hide();
							  $('#btn_change_password').show();						  
						  }
						  
					  });//end ajax
				};
			};
			
		};
	};
}
	