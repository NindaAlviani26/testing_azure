function getForm(urlServer){
	$("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', "Bearer "+sessionStorage.token);
        },
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
			$("#loading").addClass('hide');
        	if(msg.status == "success"){
                $.get("./templates/ob/customer_360.template?v=2", function(data){
                    // end tab 1
                    $("#mainContent").html(data);
					var dataCrnContainer = '';
					$.each(msg.dataCRN, function(key, val){
						dataCrnContainer += '<option>'+val.crn+'</option>';
					});
					
					$(".listCrn").html(dataCrnContainer);

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " +sessionStorage.token
                        }
                    });
					
					am4core.ready(function() {
						
						
						

						// Themes begin
						am4core.useTheme(am4themes_animated);
						// Themes end

						// Create chart instance
						var chart = am4core.create("colCharts", am4charts.PieChart);

						// Add data
						chart.data = [];

						// Add and configure Series
						var pieSeries = chart.series.push(new am4charts.PieSeries());
						pieSeries.dataFields.value = "amount";
						pieSeries.dataFields.category = "colleteral";
						pieSeries.slices.template.stroke = am4core.color("#fff");
						pieSeries.slices.template.strokeWidth = 2;
						pieSeries.slices.template.strokeOpacity = 1;

						// This creates initial animation
						pieSeries.hiddenState.properties.opacity = 1;
						pieSeries.hiddenState.properties.endAngle = -90;
						pieSeries.hiddenState.properties.startAngle = -90;
						
						
						$(".showData").on("click", function(){
							
							var crn = $("#crn").val();
							$("#loading").removeClass('hide');
							$.ajax({
								url: serverHost + "addons/ob/customer_360.api?getData=data&crn="+crn,
								type: "POST",
								dataType: "JSON",
								success: function (result_data) {
									
									//$(".cif-detail").html(result_data.detailCustomer.cif);
									$(".crn-detail").html(result_data.detailCustomer.crn);
									$(".source_system-detail").html(result_data.detailCustomer.source_system);
									$(".identity_type-detail").html(result_data.detailCustomer.jenis_identitas);
									$(".identity_number-detail").html(result_data.detailCustomer.nomor_identitas);
									$(".full_name-detail").html(result_data.detailCustomer.nama_lengkap);
									$(".dob-detail").html(result_data.detailCustomer.tgl_lahir);
									$(".phone_number-detail").html(result_data.detailCustomer.no_telepon);
									$(".email-detail").html(result_data.detailCustomer.alamat_email);
									$(".office_address-detail").html(result_data.detailCustomer.alamat_tempat_bekerja);
									$(".spouse_name-detail").html(result_data.detailCustomer.nama_pasangan);
									$(".customer_type-detail").html(result_data.detailCustomer.customer_type);
									$(".open_date-detail").html(result_data.detailCustomer.open_date);
									
									$(".saving-amount").html(0);
									$(".loan-amount").html(0);
									$(".deposit-amount").html(0);
									$.each(result_data.portofolio, function(key, val){
										$("."+val.product+"-amount").html(mioAmount(val.amount));
									});
									
									chart.data = result_data.colletaral;
									chart.appear();
									
									
									$("#loading").addClass('hide');
									// console.log(result_data);
								}, error: function (e) {
									console.log(e.info);
								}
							});
						});

					});
					
					
					function mioAmount(number){
						var convert = '';
						if(number >= 1000000000000){
							//tio
							convert = number / 1000000000000;
							convert = convert.toFixed(2) + '<span style="font-size:25px">T</span>';
						}else if(number >= 1000000000){
							//bio
							convert = number / 1000000000;
							convert = convert.toFixed(2) + '<span style="font-size:25px">B</span>';
						}else if(number >= 1000000){
							//mio
							convert = number / 1000000;
							convert = convert.toFixed(2) + '<span style="font-size:25px">M</span>';
						}else if(number >= 1000){
							//k
							convert = number / 1000;
							convert = convert.toFixed(2) + '<span style="font-size:25px">K</span>';
						}else{
							convert = number;
						}
						return convert;
					}

					

                });
            }else{
            	alert(msg.info);
            }
        },
        error : function(msg){
        	console.log(msg);
        }
    });

	
}