
function getForm(urlServer) {
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
        url: urlServer,
        dataType: "json",
        method: "GET",
        success: function (msg) {
            $("#loading").addClass('hide');

            $.get("./templates/ob/consent_proc_propose.template?v=7", function (data) {
                // var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                // template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                $("#mainContent").html(data);

                $('.select2').select2({
                    ajax: {
                        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                        url: serverHost + 'addons/ob/consent_proc_propose.api',
                        method : "POST",
                        dataType: "json",
                        data: function (params) {
                            var query = {
                                search: params.term,
                                method: 'getcif'
                            }
                            return query;
                        },
                        cache: true,
                        processResults: function (response) {
                            return {
                                results: response
                            };
                        },
                    }
                });


                $(".findconsent").on("click", function(){
                    $("#loading").removeClass("hide");
                    var cif = $(".cifconsent").val();
                    $.ajax ({
                        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                        url: serverHost + 'addons/ob/consent_proc_propose.api',
                        method : "POST",
                        dataType: "json",
                        data: {method: "getrecapconsentcrn", cif : cif},
                        success: function(msg)
                        {
                            console.log(msg);
                            $("#loading").addClass("hide");
                            if(msg.status == 'success')
                            {
                                $(".cif").html(cif);
                                $(".crn").html(msg.crn);
                                var listcif = "";
                                var listfields = "";
                                var colorcif = {};
                                var i = 0;
                                $.each(msg.cif, function(key, val){
                                    colorcif[val] = indexcolorgradient(i);
                                    listcif += `<span class="label bg-`+colorcif[val]+`" style="font-size: 12px;">`+val+`</span>`;
                                    i++;
                                }); 
                                $(".listcif").html(listcif);
                                
                                $.each(msg.fieldrecap, function(key, val){
                                    var listexpired = [];
                                    var listeffective = [];
                                    var listconcentcapturedsource = [];
                                    var listcg = [];
                                    var labelconsentgiven = val.concent_given == '1' ? 
                                        '<span style="font-size:10px" class="label bg-green">True</span>' :
                                        '<span style="font-size:10px" class="label bg-red">False</span>';
                                    $.each(val.expiredate, function(k1, v1){
                                        listexpired.push(v1+` <small class="label bg-`+colorcif[val.cif[k1]]+`"><i class="fa fa-fw fa-tag"></i></small>`);
                                    });
                                    
                                    $.each(val.effectivedate, function(k1, v1){
                                        listeffective.push(v1+` <small class="label bg-`+colorcif[val.cif[k1]]+`"><i class="fa fa-fw fa-tag"></i></small>`);
                                    });

                                    $.each(val.concentcapturedsource, function(k1, v1){
                                        listconcentcapturedsource.push(v1+` <small class="label bg-`+colorcif[val.cif[k1]]+`"><i class="fa fa-fw fa-tag"></i></small>`);
                                    });

                                    $.each(val.concent_givenbycif, function(k1, v1){
                                        var labelv1 = v1 =='1' ? "True" : "False";
                                        listcg.push(val.cif[k1]+`=`+labelv1);
                                    });

                                    listfields += `
                                    <tr class='contentlistfield'>
                                        <td>`+key+`</td>
                                        <td>`+labelconsentgiven+` <i data-toggle="tooltip" title="`+listcg.join(", ")+`"   data-placement="right"  class="fa fa-fw fa-question-circle" style="color: orange;"></i></td>
                                        <td>`+listeffective.join("<br>")+`</td>
                                        <td>`+listexpired.join("<br>")+`</td>
                                        <td>`+listconcentcapturedsource.join("<br>")+`</td>
                                    </tr>
                                    `;
                                });
                                $(".contentlistfield").remove();
                                $(".bodyconsent").append(listfields);
                                $('[data-toggle="tooltip"]').tooltip();

                                $(".containerrecap").css("display", "block");

                            }else{
                                console.log(msg);
                            }
                            
                        },
                        error: function(err){
                            $("#loading").addClass("hide");
                            $alert("Error get data");
                            console.log(err);

                        }
                    });
                })
            })
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}


function indexcolorgradient(i)
{
    var color = [
        "blue",
        "red",
        "yellow",
        "orange",
        "purple",
        "green",
        "pink",
        "tomato",
        "orangered"
    ];

    return color[i];
}