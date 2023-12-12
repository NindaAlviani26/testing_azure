$("#loading").removeClass('hide');
$.ajax({
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
    url : serverHost + "addons/base/dashboard.api",
    dataType : "json",
    method : "POST",
    success : function(msg){
      // console.log(msg)
      if(msg.status == 'success'){
        var leng = msg.data.length;
        var index =[];

        var message =`<div class="col-md-12">
            <div class="alert alert-success alert-dismissible">
              <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
              <p><i class="fa fa-user"></i> <span class="welcome-message"></span></p>
            </div>
        </div>`;

        var data_notif =[];

        for (var i=0; i<leng; i++) {
          var namemodul = msg.data[i].module;

          if(i%2==1){
            index[i]= `<div class="col-md-6 ">`;
          }
          else{
            index[i]=`<div class="col-md-6 ">`;
          }
          index[i]+= `
                      <div class="box" >
                      <div class="box-header with-border">
                          <h3 class="box-title">`+namemodul+`</h3>
                          <div class="box-tools">
                            <button type="button" class="btn btn-tool" data-widget="collapse">
                              <i class="fa fa-minus"></i>
                            </button>
                          </div>
                      </div>
                      <div class="box-body">
                        <div class="row">
                          <div class="col-md-12">
                          <table id="tbl`+[i]+`" class="table table-bordered table-hover" >
                          <thead>
                            <tr>
                              <th class="ini">No.</th>
                              <th>Form Name</th>
                              <th>Buss Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>`;
               var ind='';
               var dataDetail =msg.data[i].detail;
              
               var nomor = 1;
               var label_status ='';
               var id_label ='';

              for (var a=0; a< dataDetail.length ; a++) {

                if(msg.data[i].detail[a].status == "RUNNING"){
                  label=`<span class="label label-warning click-label cursor-pointer" title="Show Log `+msg.data[i].detail[a].formName+`" style="display:block" id="`+i+`_`+a+`">`+msg.data[i].detail[a].status.toUpperCase()+`</span>`;
                }else if(msg.data[i].detail[a].status == "SUCCESS"){
                  label=`<span class="label label-success click-label cursor-pointer" title="Show Log `+msg.data[i].detail[a].formName+`" style="display:block" id="`+i+`_`+a+`">`+msg.data[i].detail[a].status.toUpperCase()+`</span>`;
                }else{
                  label=`<span class="label label-danger click-label cursor-pointer" title="Show Log `+msg.data[i].detail[a].formName+`" style="display:block" id="`+i+`_`+a+`">`+msg.data[i].detail[a].status.toUpperCase()+`</span>`;
                }
               
                 ind += `<tr><td>`+ nomor++ +`</td>
                            <td>`+msg.data[i].detail[a].formName+`</td>
                            <td>`+msg.data[i].detail[a].buss_date+`</td>
                            <td>`+label+`</td></tr>`;
                
                
                // template modal
                var modal =`
                  <div class="modal fade" id="modalLog" tabindex="-1" role="dialog" aria-labelledby="emodalLogLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <h5 class="modal-title" id="modalLogLabel">Log Job Process</h5>
                        </div>
                        <div class="modal-body">
                          <pre class="show_data"></pre>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                
                `;
                            
              }
              index[i] += ind +`</tbody> </table> </div></div></div></div>`;
              if(i%2==1){
                index[i] += `</div><div class="row"></div>`;
              }
              else{
                index[i]+=`</div>`;
              }
              
            }

            // console.log(msg.data_module[0].module_running);
            var length_module_running = msg.data_module[0].module_running.length;
            var length_module_failed = msg.data_module[0].module_failed.length;
            var length_module_success = msg.data_module[0].module_success.length;
            var module_running='';
            var module_failed ='';
            var module_success ='';
            var comma =',';
            for(var rn=0; rn<length_module_running; rn++){

              if(rn==0){
                comma ='';
              }else{
                comma =',';
              }
              var status_x='running';
              for (var i=0; i<leng; i++) {
                var namemodul = msg.data[i].module;

                if(msg.data[i].module == msg.data_module[0].module_running[rn]){
                  module_running +=comma +' <a href="#" class="modal-detail " id="'+namemodul+'_'+status_x+'">'+ msg.data_module[0].module_running[rn]+'</a>';
                  // console.log(namemodul);
                  
                 
                }
              }
              
     
            }
            for(var fl=0; fl<length_module_failed; fl++){

              if(fl==0){
                comma='';
              }else{
                comma =',';
              }

              var status_x='failed';
              for (var i=0; i<leng; i++) {
                var namemodul = msg.data[i].module;

                if(msg.data[i].module == msg.data_module[0].module_failed[fl]){
                  module_failed +=comma +' <a href="#" class="modal-detail " id="'+namemodul+'_'+status_x+'">'+ msg.data_module[0].module_failed[fl]+'</a>';
                }
              }
            }

            for(var sc=0; sc<length_module_success; sc++){
              if(sc==0){
                comma='';
              }else{
                comma =',';
              }
              module_success +=comma +' '+ msg.data_module[0].module_success[sc];
     
            }
          
            // count tiap2 modul
            data_notif[i] =`
            <div class="col-md-12">
              <div class="box" >
                <div class="box-body">
                  <h5 class="text-bold">List Status Job</h5>
                  <ul style="padding-left: 0px; list-style:none">
                    <li style="margin-bottom:10px;"><span class="label label-success" style="font-size:12px ;margin: 0 5px 0 5px;">Success: <b>`+msg.total_status[0].total_success+`</b>  </span> <i class="fa fa-caret-right"></i> ( `+module_success+` )</li>
                    <li style="margin-bottom:10px;"><span class="label label-warning cursor-pointer"  style="font-size:12px ; margin: 0 5px 0 5px;" >Running: <b>`+msg.total_status[0].total_running+`</b> </span> <i class="fa fa-caret-right"></i> ( `+module_running+` )</li>
                    <li style="margin-bottom:10px;"><span class="label label-danger cursor-pointer"  style="font-size:12px; margin: 0 5px 0 5px;">Failed: <b>`+msg.total_status[0].total_failed+`</b> </span> <i class="fa fa-caret-right"></i> ( `+module_failed+` )</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-12"></div>
          `;

          // template modal detail
          var modal_detail =`
          <div class="modal fade" id="modalDetail" tabindex="-1" role="dialog" aria-labelledby="modalDetailLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h5 class="modal-title" id="modalDetailLabel">Detail</h5>
                </div>
                <div class="modal-body" id="detailData">
                
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                </div>
              </div>
            </div>
          </div>
        
        `;
            
          // untuk halaman utama
            $( "#rowContent" ).html( index);

            
            // untuk modal
            $(document.body).append(modal);

            
            $("#rowContent td span.label.click-label").on('click',function(){
              var attribut = $(this).attr('id');
              var get_value =attribut.split('_');

              $('#modalLog').modal();
              var data_modal = msg.data[get_value[0]].detail[get_value[1]].log;
              var header_title = 'Log Process '+msg.data[get_value[0]].detail[get_value[1]].formName;
              
              if(data_modal ==null){
                data_modal='No process log ';
              }
              $('.show_data').html(data_modal);
              $('#modalLogLabel').html(header_title);
            });
            // end untuk modal

            // untuk notif
            $("#rowContent").prepend(data_notif);

            $("#rowContent li a.modal-detail").on('click',function(){
              // untuk modal detail 
              $(document.body).append(modal_detail);
              $('#modalDetail').modal();
              var attr_id = $(this).attr('id');
              var get_value2 =attr_id.split('_');
              $('#modalDetailLabel').html('Detail '+get_value2[1]+' '+get_value2[0]);

              for (var i=0; i<leng; i++) {
                  
                if(msg.data[i].module == get_value2[0]){

                  var tableDetailBody='';
                  var tableDetail =`
                      <table id="tableDetailModal" class="table table-bordered table-hover" >
                        <thead>
                          <tr>
                            <th class="ini">No.</th>
                            <th>Form Name</th>
                            <th>Buss Date</th>
                            <th>Log</th>
                          </tr>
                        </thead>
                        <tbody>
                  `;

                 
                  var no=1;
                  var dataDetailTable =msg.data[i].detail;
                  for (var b=0; b< dataDetailTable.length ; b++) {

                    if(msg.data[i].detail[b].status.toLowerCase() == get_value2[1]){
                      
                      var status_log='';
                      if(msg.data[i].detail[b].log == null){
                        status_log = 'No Status Log';
                      }else{
                        status_log = msg.data[i].detail[b].log;
                      }
                      tableDetailBody +=`
                        <tr>
                          <td>`+ no++ +`</td>
                          <td>`+ msg.data[i].detail[b].formName +`</td>
                          <td>`+ msg.data[i].detail[b].buss_date +`</td>
                          <td><pre>`+ status_log +`</pre></td>
                        </tr>
                      `;
                    }
                    
                  }
                  tableDetail += tableDetailBody+`
                        </tbody>
                      </table>
                  `;

                  
                }
                
              }
              $('#detailData').html(tableDetail);
              // data table modal detail
              $('#tableDetailModal').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true
              });
            });
            

            // untuk welcome
            $("#rowContent").prepend(message);
            var text_message='Welcome <b>'+msg.user+',</b> login at <b>'+msg.today+'</b>';
            $(".welcome-message").html(text_message);
            
        for (var i=0; i<leng; i++) {
          // $('#tbl'+[i]).DataTable({
          //   searching: false,
          //   lengthMenu: [5, 10],
          // });
          
          $('#tbl'+[i]).DataTable({
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true
          });
          // ganti text Next dengan icon right dan berikan title
          $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
          $("li.paginate_button.previous > a").attr('title','Previous');

          $(document).ready(function(){
            $(this).click(function(){
              $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
              $("li.paginate_button.previous > a").attr('title','Previous');
            });
          });

          // ganti text Previous dengan icon left dan berikan title
          $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
          $("li.paginate_button.next > a").attr('title','Next');

          $(document).ready(function(){
            $(this).click(function(){
              $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
              $("li.paginate_button.next > a").attr('title','Next');
            });
          });

          
        }
      }
      $("#loading").addClass('hide');

      
    }
});



