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
                $.get("./templates/ob/dashboard.template?v=6", function(data){
                    var template = data.replaceAll("{{process_cif}}", msg.structure.process_cif);
                    template = template.replaceAll("{{rejected_record}}", msg.structure.rejected_record);
                    template = template.replaceAll("{{invalid_record}}", msg.structure.invalid_record);
                    template = template.replaceAll("{{unique_customer}}", msg.structure.unique_customer);
                    template = template.replaceAll("{{process_cif_total}}", msg.structure.process_cif_total);
                    template = template.replaceAll("{{rejected_record_total}}", msg.structure.rejected_record_total);
                    template = template.replaceAll("{{invalid_record_total}}", msg.structure.invalid_record_total);
                    template = template.replaceAll("{{unique_customer_total}}", msg.structure.unique_customer_total);

					// tab 1
					template = template.replaceAll("{{count_data_cif}}", msg.structure.count_data_cif);
					template = template.replaceAll("{{count_data_cif_year1}}", msg.structure.count_data_cif_year1);
					template = template.replaceAll("{{count_data_cif_year2}}", msg.structure.count_data_cif_year2);
					// end tab 1
                    $("#mainContent").html(template);

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " +sessionStorage.token
                        }
                    });

					
					$("#years").change(function () {
						// console.log(this.value);
						$.ajax({
							url: serverHost + "addons/ob/dashboard.api?tahun="+this.value,
							type: "POST",
							dataType: "JSON",
							success: function (result_data) {
								// $("#chartdiv2").html(result_data.structure.data_x);
								
								var data_xx=result_data.structure.data_x;
					
								var data_total_cif_bersih=result_data.structure.count_bersih;
								var data_total_cif_kotor=result_data.structure.count_kotor;

								grafikChart1(data_xx,data_total_cif_bersih,data_total_cif_kotor);
								$("#loading").addClass('hide');
							}, error: function (e) {
								console.log(e.info);
							}
						});
					});

					$(".filterData").on("click", function(){
                        var cabang = $(".cabangData").val() == '' ? '' : "kode_cabang='"+$(".cabangData").val()+"'";
                        var area = $(".areaData").val() == '' ? '' : "kode_area='"+$(".areaData").val()+"'";
                        var regional = $(".regionalData").val() == '' ? '' : "regional='"+$(".regionalData").val()+"'";
						var jenis_nasabah = $(".jenisNasabahData").val() == '' ? '' : "customer_type='"+$(".jenisNasabahData").val()+"'";
						var profile_risiko = $(".profileRisikoData").val() == '' ? '' : "risk_customer='"+$(".profileRisikoData").val()+"'";
						var subTipeNasabah = $(".subTipeNasabah").val() == '' ? '' : "kelompok_nasbaah='"+$(".subTipeNasabah").val()+"'";

						$("#loading").removeClass('hide');
						$.ajax({
							url: serverHost + "addons/ob/dashboard.api?cabang="+cabang+"&area="+area+"&regional="+regional+"&jenis_nasabah="+jenis_nasabah+"&profile_risiko="+profile_risiko+"&kelompok_nasbaah="+subTipeNasabah,
							type: "POST",
							dataType: "JSON",
							success: function (result_data) {
								console.log(result_data);
								$("#count_data_cif").html(result_data.structure.count_data_cif);
								$("#count_data_cif_year1").html(result_data.structure.count_data_cif_year1);
								$("#count_data_cif_year2").html(result_data.structure.count_data_cif_year2);
								$("#loading").addClass('hide');
								// console.log(result_data);
							}, error: function (e) {
								console.log(e.info);
							}
						});
					});

					// chart 1
					var years = document.getElementById("years");

					var data_tahunan=msg.structure.data_tahun;
					for(var x=0; x<data_tahunan.length; x++){
						var newOption = document.createElement('option');
						newOption.innerText = data_tahunan[x].data_tahun;
						newOption.setAttribute('value',  data_tahunan[x].data_tahun);
						years.appendChild(newOption);
					}

					var data_xx=msg.structure.data_x;
					
					var data_total_cif_bersih=msg.structure.count_bersih;
					var data_total_cif_kotor=msg.structure.count_kotor;
					grafikChart1(data_xx,data_total_cif_bersih,data_total_cif_kotor);
				
					var data_1=msg.structure.data_n;
					var data_2=msg.structure.data_n2;

					// var data_1=[{count_cif:'4',last_update_date:'2022-02-12'},{count_cif:'6',last_update_date:'2022-03-15'},{count_cif:'12',last_update_date:'2022-05-14'}];
					// var data_2=[{count_cif:'12',last_update_date:'2022-04-18'},{count_cif:'19',last_update_date:'2022-09-10'},{count_cif:'56',last_update_date:'2022-10-17'}];
					

					// console.log(data_1);

                    am4core.ready(function() {
						
						// Themes begin
						am4core.useTheme(am4themes_animated);
						// Themes end
						
						// Create chart instance
						var chart = am4core.create("chartdiv", am4charts.XYChart);

						// Add data
						// var data_fix=[];
						var data_x=[];
						for(var x=0; x<data_1.length; x++){
							// var data_date_1 = msg.structure.data_n[x].last_update_date;
							var data_date_1 = data_1[x].last_update_date || '';
							data_date_1 = data_date_1.split('-'); 
							
							data_x[x] = {date:new Date(data_date_1[0],data_date_1[1]-1,data_date_1[2]), value1:data_1[x].count_cif};
							// console.log('sdf'+data_x);
							// data_fix[x]=data_x;
							
						}

						var data_x2=[];
						for(var x=0; x<data_2.length; x++){
							// var data_date_1 = msg.structure.data_n[x].last_update_date;
							var data_date_2 = data_2[x].last_update_date;
							data_date_2 = data_date_2.split('-'); 
							
							data_x2[x] = {date:new Date(data_date_2[0],data_date_2[1]-1,data_date_2[2]), value2:data_2[x].count_cif};
							// console.log('sdf'+data_x);
							// data_fix[x]=data_x2;
						}
						var data_fix=$.merge( $.merge( [], data_x ), data_x2 );
						// console.log(data_fix);
						chart.data = data_fix;
					
						
						  
						// Create axes
						var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
						dateAxis.renderer.minGridDistance = 50;
						  
						var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
						  
						function createSeries(value, name, color) {
							// Create series
							var series = chart.series.push(new am4charts.LineSeries());
							series.stroke = am4core.color(color);
							series.fill = am4core.color(color);
							series.dataFields.valueY = value;
							series.dataFields.dateX = "date";
							series.strokeWidth = 2;
							series.name = name;
							series.minBulletDistance = 10;
							series.tooltipText = "[bold]{date.formatDate()}\n [/] {name} :[/] {valueY}\n";
							series.tooltip.pointerOrientation = "vertical";
							
							// // Create series2
							// var series2 = chart.series.push(new am4charts.LineSeries());
							// series2.stroke = am4core.color(color);
							// series2.fill = am4core.color(color);
							// series2.dataFields.valueY = value;
							// series2.dataFields.dateX = "date";
							// series2.strokeWidth = 2;
							// series2.tooltipText = "[bold]{previousDate.formatDate()}:[/] {valueY}";
							// // series2.strokeDasharray = "3,4";
							// // series2.stroke = series.stroke;

							// Set up tooltip
							series.adapter.add("tooltipText", function(ev) {
								var text = "[bold]{dateX}[/]\n"
								chart.series.each(function(item) {
								text += "[" + item.stroke.hex + "]●[/] " +item.name + ": {" + item.dataFields.valueY + "}\n";
								});
								return text;
							});
  
							// one frame data
							series.tooltip.getFillFromObject = false;
							series.tooltip.background.fill = am4core.color("#fff");
							series.tooltip.label.fill = am4core.color("#00");

							// make circle data
							var bullet = series.bullets.push(new am4charts.CircleBullet());
							bullet.circle.stroke = am4core.color("#fff");
							bullet.circle.strokeWidth = 2;

							// var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
							// bullet2.circle.stroke = am4core.color("#fff");
							// bullet2.circle.strokeWidth = 2;
							// end make circle data

							return series;
							// return series2;
						}
						createSeries("value1", "On Boarding", "#365897");
						
						
						// Add cursor
						chart.cursor = new am4charts.XYCursor();
						chart.cursor.xAxis = dateAxis;

						// legenda
						chart.legend = new am4charts.Legend();
						chart.cursor = new am4charts.XYCursor();
						chart.cursor.maxTooltipDistance = 0;
						
					}); // end am4core.ready()
					
					function grafikChart1(data_xx,data_total_cif_bersih,data_total_cif_kotor){
						am4core.ready(function() {

							// Themes begin
							am4core.useTheme(am4themes_animated);
							// Themes end
							
							var chart = am4core.create("chartdiv2", am4charts.XYChart);
							
							var data_xy=[];
							for(var x=0; x<data_xx.length; x++){
								var data_cif_bersih = data_xx[x].count_data_bersih;
								var data_cif_kotor = data_xx[x].count_data_kotor;
								var data_date = data_xx[x].data_date.split("-");
								
								var dateFix = monthName(data_date[1]) + " " + data_date[0];
								
								
								if(data_date != null){
									data_xy[x] ={"data_key":"# CIF ("+dateFix+")", "cif_bersih":data_cif_bersih, "cif_kotor":data_cif_kotor};
								}else{
									data_xy[x] ='';
								}
							}
					
							var data_yx = [{"data_key":"[bold]Total Data ", "cif_bersih":data_total_cif_bersih, "cif_kotor":data_total_cif_kotor}];

							// gabungkan 2 array
							var data_consume=$.merge( $.merge( [], data_yx ), data_xy );
							chart.data =data_consume;
							// chart.data = [{
							// 	"data_key": "Total Data",
							// 	"values": data_total_x
							// }
							// , {
							// 	"data_key": "Data CIF Bersih",
							// 	"values": 5
							// }
							// ];
							
							chart.padding(40, 40, 40, 40);
							
							var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
							categoryAxis.renderer.grid.template.location = 0;
							categoryAxis.dataFields.category = "data_key";
							categoryAxis.renderer.minGridDistance = 10;
							categoryAxis.renderer.inversed = true;
							categoryAxis.renderer.labels.template.rotation = 55;
							categoryAxis.renderer.labels.template.horizontalCenter = "left";
							categoryAxis.renderer.labels.template.verticalCenter = "middle";
							
							// categoryAxis.renderer.grid.template.disabled = true;
							
							var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
							
							
							var series = chart.series.push(new am4charts.ColumnSeries());
							series.dataFields.categoryX = "data_key";
							series.dataFields.valueY = "cif_bersih";
							series.columns.template.strokeOpacity = 0;
							series.columns.template.column.cornerRadiusTopRight = 10;
							series.columns.template.column.cornerRadiusTopLeft = 10;
							series.columns.template.tooltipText = "Clean CIF : [bold]{valueY}[/]";
							series.columns.template.fillOpacity = .8;
							series.columns.template.fill = am4core.color("#009500");

							
							var series2 = chart.series.push(new am4charts.ColumnSeries());
							series2.dataFields.categoryX = "data_key";
							series2.dataFields.valueY = "cif_kotor";
							series2.columns.template.strokeOpacity = 0;
							series2.columns.template.column.cornerRadiusTopRight = 10;
							series2.columns.template.column.cornerRadiusTopLeft = 10;
							series2.columns.template.tooltipText = "Invalid CIF : [bold]{valueY}[/]";
							series2.columns.template.fillOpacity = .8;
							series2.columns.template.fill = am4core.color("#cf0303");
							//series.interpolationDuration = 1500;
							//series.interpolationEasing = am4core.ease.linear;
							
							
							// chart.zoomOutButton.disabled = true;
							
							
						
						}); // end am4core.ready()
					}
					function monthName(month){
						var start = 1;
						var finish = 12;
						var monthNameData = "";
						// console.log(month);
						switch(month){
							case '01' : monthNameData = "January"; break;
							case '02' : monthNameData = "February"; break;
							case '03' : monthNameData = "March"; break;
							case '04': monthNameData = "April"; break;
							case '05' : monthNameData = "May"; break;
							case '06' : monthNameData = "June"; break;
							case '07' : monthNameData = "July"; break;
							case '08' : monthNameData = "August"; break;
							case '09' : monthNameData = "September"; break;
							case '10' : monthNameData = "October"; break;
							case '11' : monthNameData = "November"; break;
							case '12' : monthNameData = "December"; break;
						}
						return monthNameData;
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