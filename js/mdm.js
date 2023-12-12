
function exportToCSV(ElemetID, formid, idmodule, prefixtbl, urlApi) {
	var xx = ElemetID.getGridParam('colModel').length;
	var strField = '';
	var strDesc = '';
	for (i = 1; i <= xx; i++) {
		try {
			if (!(ElemetID.getGridParam('colModel')[i].hidden)
			) {
				strField = strField + ElemetID.getGridParam('colModel')[i].index + ',';
				strDesc = strDesc + '"' + ElemetID.getGridParam('colNames')[i] + '",';

				console.log("loh".strField);
			}

		}
		catch (e) {
			console.log(e);
		}
	}
	var filtered = '';
	try {
		if (ElemetID.getGridParam("postData").filters != undefined) {
			filtered = ElemetID.getGridParam("postData").filters;

			console.log("log".filtered);
		}
	}
	catch (e) {
		console.log(e);
	}

	var f = formid;
	var m = idmodule;
	var p = prefixtbl;
	var param = "'" + $("#ProcessDate" + ElemetID[0].id).val() + "'";

	$("#loading").removeClass('hide');
	$.ajax({
		url: urlApi,
		type: 'post',
		data: {
			f: formid,
			m: idmodule,
			p: prefixtbl,
			param: $("#ProcessDate" + ElemetID[0].id).val(),
			filtered: filtered,
			fieldname: strField,
			fielddesc: strDesc
		},
		success: function (response) {
			console.log(response.info);

			var currentdate = new Date();
			var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() + "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
			filename = ElemetID[0].id + datetime;
			var blob = new Blob([response]);
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = filename + ".csv";
			link.click();
			$("#loading").addClass('hide');
			return true;
		}
	});
};

function exportToCSVTable(ElemetID, formid, idmodule, prefixtbl, tablename, urlApi) {
	var xx = ElemetID.getGridParam('colModel').length;
	var strField = '';
	var strDesc = '';

	for (i = 1; i < xx; i++) {
		try {
			if (!(ElemetID.getGridParam('colModel')[i].hidden)
			) {
				if (ElemetID.getGridParam('colModel')[i].index != null) {
					strField = strField + ElemetID.getGridParam('colModel')[i].index + ',';
					strDesc = strDesc + '"' + ElemetID.getGridParam('colNames')[i] + '",';
				}
			}

		}
		catch (e) {
			console.log(e);
		}
	}
	var filtered = '';
	try {
		if (ElemetID.getGridParam("postData").filters != undefined) {
			filtered = ElemetID.getGridParam("postData").filters;
		}
	}
	catch (e) {
		console.log(e);
	}

	var f = formid;
	var m = idmodule;
	var p = prefixtbl;
	var t = tablename;
	var param = "'" + $("#ProcessDate" + ElemetID[0].id).val() + "'";

	$("#loading").removeClass('hide');
	$.ajax({
		url: urlApi,
		type: 'post',
		data: {
			m: idmodule,
			p: prefixtbl,
			t: tablename,
			param: $("#ProcessDate" + ElemetID[0].id).val(),
			filtered: filtered,
			fieldname: strField,
			fielddesc: strDesc
		},
		success: function (response) {
			console.log(response);

			var currentdate = new Date();
			var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() + "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
			filename = ElemetID[0].id + datetime;
			var blob = new Blob([response]);
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = filename + ".csv";

			link.click();
			$("#loading").addClass('hide');
			return true;
		}, error: function (response) {
			console.log(response.info);
		}
	});
};

function exportToCSVTable2(ElemetID, formid, idmodule, prefixtbl, tablename, urlApi) {
	$("#loading").removeClass('hide');
	$.ajax({
		url: urlApi,
		type: 'post',
		data: {
			m: idmodule,
			p: prefixtbl,
			t: tablename,
			c: ElemetID
		},
		success: function (response) {
			console.log(response);

			var currentdate = new Date();
			var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() + "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
			filename = "ob_form"+formid+ datetime;
			var blob = new Blob([response]);
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = filename + ".csv";

			link.click();
			$("#loading").addClass('hide');
			return true;
		}, error: function (response) {
			console.log(response.info);
		}
	});
};

function exportToXLSTable(ElemetID, formid, idmodule, prefixtbl, tablename, urlApi, filterexternal = null) {
	var xx = ElemetID.getGridParam('colModel').length;
	var strField = '';
	var strDesc = '';

	for (i = 1; i < xx; i++) {

		try {
			if (!(ElemetID.getGridParam('colModel')[i].hidden)
			) {
				if (ElemetID.getGridParam('colModel')[i].index != null) {
					strField = strField + ElemetID.getGridParam('colModel')[i].index + ',';
					strDesc = strDesc + '"' + ElemetID.getGridParam('colNames')[i] + '",';

				}
			}

		}
		catch (e) {
			console.log(e);
		}
	}
	var filtered = '';
	try {
		if (ElemetID.getGridParam("postData").filters != undefined) {
			filtered = ElemetID.getGridParam("postData").filters;
		}
	}
	catch (e) {
		console.log(e);
	}

	var currentdate = new Date();
	var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() + "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
	filename = ElemetID[0].id + datetime;

	var f = formid;
	var m = idmodule;
	var p = prefixtbl;
	var t = tablename;
	var file_name = filename;
	var param = "'" + $("#ProcessDate" + ElemetID[0].id).val() + "'";

	$("#loading").removeClass('hide');


	$.ajax({
		url: urlApi,
		type: 'post',
		data: {
			m: idmodule,
			p: prefixtbl,
			t: tablename,
			file_name: filename,
			param: $("#ProcessDate" + ElemetID[0].id).val(),
			filtered: filtered,
			fieldname: strField,
			fielddesc: strDesc,
			filterexternal : filterexternal
		},
		success: function (response) {
			console.log(response.info);

			var file_location = serverHost + "download/" + filename + ".xlsx";
			var link = document.createElement('a');
			link.href = file_location;
			//link.download = true;

			link.click();
			$("#loading").addClass('hide');
			return true;
		}, error: function (e) {
			console.log(e);
		}
	});
};

function generateAntasena() {
	// $("#btnSubmit").click(function () {
	var id_pelapor = $("#idPelapor").val();
	var periode_data = $("#periodeData").val();
	var periode_laporan = $("#periodeLaporan").val();
	console.log("Id Pelapor: " + id_pelapor + "\n Periode Data: " + periode_data + "\n Periode Laporan: " + periode_laporan);
	// });

}
function appendElement(idIndex, remove) {
	var x = "";
	if (remove == idIndex) {
		x = '';
		return x;
	}
	for (var i = 1; i <= idIndex; i++) {
		var selectoption = document.getElementById("selectoption" + i).value;
		var jqg = document.getElementById("jqg" + i).value;
		var select = document.getElementById("selected" + i).value;
		$("#jqg" + i).attr("readonly", false);
		if (document.getElementById("selectoption" + i).value == 'LIKE%') {
			selectoption = 'LIKE';
			jqg = "'" + jqg.replaceAll("'", "") + "%'";
		} else if (document.getElementById("selectoption" + i).value == 'NOT LIKE%') {
			selectoption = 'NOT LIKE';
			jqg = "'" + jqg.replaceAll("'", "") + "%'";
		} else if (document.getElementById("selectoption" + i).value == '%LIKE') {
			selectoption = 'LIKE';
			jqg = "'%" + jqg.replaceAll("'", "") + "'";
		} else if (document.getElementById("selectoption" + i).value == '%NOT LIKE') {
			selectoption = 'NOT LIKE';
			jqg = "'%" + jqg.replaceAll("'", "") + "'";
		} else if (document.getElementById("selectoption" + i).value == '%LIKE%') {
			selectoption = 'LIKE';
			jqg = "'%" + jqg.replaceAll("'", "") + "%'";
		} else if (document.getElementById("selectoption" + i).value == '%NOT LIKE%') {
			selectoption = 'NOT LIKE';
			jqg = "'%" + jqg.replaceAll("'", "") + "%'";
		} else if (document.getElementById("selectoption" + i).value == 'IS NOT NULL') {
			selectoption = 'IS NOT NULL';
			$("#jqg" + i).attr("readonly", true);
			document.getElementById("jqg" + i).value = "";
		} else if (document.getElementById("selectoption" + i).value == 'IS NULL') {
			selectoption = 'IS NULL';
			$("#jqg" + i).attr("readonly", true);
			document.getElementById("jqg" + i).value = "";
		}

		if (select == "" && i == idIndex) {
			x += '';
		} else if (select == "") {
			x += '';
		} else {
			x += select + " " + selectoption + " " + jqg; 
			if (idIndex > 1 && i != idIndex) {
				x += " " + document.getElementById("idEqual").value + " ";
			}
		}

	}
	if (x == '') {
		x = '';
	} else {
		x += "";
	}
	return x;
}


function filemanager(){
	return `<div class="modal" id="modals" style="top: 50px;">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">×</span></button>
		  <h4 class="modal-title">File Manager</h4>
		</div>
		<div class="modal-body">
			<input type="text" name="hide" id="hide" hidden>
			<table class="groupTbl table table-condensed ui-search-table" style="border:0px none;">
			<tbody>
				<tr>
					<td>
						<label for="select">Select file to upload:</label>
					</td>
					<td>
					   <button name="file" id="file">Upload File</button>
					   <label id="fileLabel"></label>
					</td>
				</tr>
			   
			</table>
		</div>
		<div class="modal-footer">
		  <button id="btnConfrim" class="btn btn-success">Confirm</button>
		</div>
	  </div>
	</div>
  </div>`;
}		

function condition() {
	return `<div class="modal" id="modals" style="top: 50px;">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">×</span></button>
		  <h4 class="modal-title">Condition Builder</h4>
		</div>
		<div class="modal-body">
			<p id="demo"></p>
			<table class="groupTbl table table-condensed ui-search-table" style="border:0px none;">
			<tbody>
				<tr class="error" style="display:none;">
					<th colspan="5" class="bg-danger" align="left"></th>
				</tr>
				<tr>
					<th colspan="5" align="left">
						<select id="idEqual" class="opsel form-control">
							<option value="AND" selected="selected">all</option>
							<option value="OR">any</option>
						</select>
						<input type="button" value="+" title="Add rule" id="buton" class="add-rule btn btn-default">
					</th>
				</tr>
				<tr class = "trContent"></tr>
			</tbody>
			</table>
		</div>
		<div class="modal-footer">
		  <button id="btnConfrim" class="btn btn-success">Confirm</button>
		</div>
	  </div>
	</div>
  </div>`;
}

function isiCondition(idIndex) {
	return `<tr>
		  <td></td>
		  <td>
		  	  <input type="text" id="selected`+ idIndex + `" class="form-control" list="selectedList` + idIndex + `" />
				<datalist id="selectedList`+ idIndex + `">
				</datalist>
		  </td>
		  <td>
			  <select id="selectoption`+ idIndex + `" class="selectoption form-control">
				  <option value="=" selected="selected">equal</option>
				  <option value="<>">not equal</option>
				  <option value="LIKE%">begins with</option>
				  <option value="NOT LIKE%">does not begin with</option>
				  <option value=">">Greater than</option>
				  <option value="<">Less than</option>
				  <option value="%LIKE">ends with</option>
				  <option value="%NOT LIKE">does not end with</option>
				  <option value="%LIKE%">contains</option>
				  <option value="%NOT LIKE%">does not contain</option>
				  <option value="IS NULL">is null</option>
				  <option value="IS NOT NULL">is not null</option>
				  <option value="IN">is in</option>
				  <option value="NOT IN">is not in</option>
			  </select></td>
		  <td>
			  <input type="text" id="jqg`+ idIndex + `" name="code" role="textbox" class="input-elment form-control" style="width: 96%;">
		  </td>
		  <td>
			  <button title="Delete rule" class="delete-rule ui-del btn btn-default">-</button>
		  </td>
	  </tr>`;
}

function appendOption(optionName, optionIndex, idIndex) {
	var len = optionName.split(",").length;
	var value = optionIndex.split(",");
	var nameOption = optionName.split(",");
	for (var i = 0; i < len; i++) {
		var id = value[i].replaceAll("'", "");
		var name = nameOption[i].replaceAll("'", " ");
		// $("#selected" + idIndex).append("<option id='" + id + "' value='" + id + "'>" + name + "</option>");
		$("#selectedList" + idIndex).append("<option>" + id + "</option>");
	}
}

function editValue(split, length, idEqual, optionName, optionIndex) {
	if (length >= 2) {
		for (var i = 1; i <= length; i++) {
	
			document.getElementById("idEqual").value = idEqual;
			$('.trContent').append(isiCondition(i));
			appendOption(optionName, optionIndex, i);
			var replaceStr = split[i - 1].toLowerCase();
			//find is null or is not null
			if (replaceStr.search(" is null") > 1) {
				var splitSpasi = replaceStr.split(" is null");
				document.getElementById("selected" + i).value = splitSpasi[0];
				document.getElementById("selectoption" + i).value = "IS NULL";
				$("#jqg" + i).attr("readonly", true);

			} else if (replaceStr.search(" is not null") > 1) {
				var splitSpasi = replaceStr.split(" is null");
				document.getElementById("selected" + i).value = splitSpasi[0];
				document.getElementById("selectoption" + i).value = "IS NOT NULL";
				$("#jqg" + i).attr("readonly", true);

			} else if (replaceStr.search(" not like ") > 1) {
				var splitSpasi = replaceStr.split(" not like ");
				document.getElementById("selected" + i).value = splitSpasi[0];
				document.getElementById("selectoption" + i).value = "NOT LIKE";
				document.getElementById("jqg" + i).value = splitSpasi[1];

			} else {
				var splitSpasi = replaceStr.split(" ");
				console.log("cek " + replaceStr);
				document.getElementById("selected" + i).value = splitSpasi[0];
				document.getElementById("selectoption" + i).value = splitSpasi[1].toUpperCase();

				var values = '';
				for (var a = 2; a < splitSpasi.length; a++) {
					console.log(splitSpasi[a]);
					values += splitSpasi[a];
				}
				document.getElementById("jqg" + i).value = values;
			}
		}
	} else {
		document.getElementById("idEqual").value = idEqual;
		$('.trContent').append(isiCondition(length));
		appendOption(optionName, optionIndex, length);
		var replaceStr = split[length - 1].toLowerCase();
		//find is null or is not null
		if (replaceStr.search(" is null") > 1) {
			var splitSpasi = replaceStr.split(" is null");
			document.getElementById("selected" + length).value = splitSpasi[0];
			document.getElementById("selectoption" + length).value = "IS NULL";
			$("#jqg" + length).attr("readonly", true);

		} else if (replaceStr.search(" is not null") > 1) {
			var splitSpasi = replaceStr.split(" is null");
			document.getElementById("selected" + length).value = splitSpasi[0];
			document.getElementById("selectoption" + length).value = "IS NOT NULL";
			$("#jqg" + length).attr("readonly", true);

		} else if (replaceStr.search(" not like ") > 1) {
			var splitSpasi = replaceStr.split(" not like ");
			document.getElementById("selected" + length).value = splitSpasi[0];
			document.getElementById("selectoption" + length).value = "NOT LIKE";
			document.getElementById("jqg" + length).value = splitSpasi[1];

		} else {
			var splitSpasi = replaceStr.split(" ");
			console.log("cek " + replaceStr);
			document.getElementById("selected" + length).value = splitSpasi[0];
			document.getElementById("selectoption" + length).value = splitSpasi[1].toUpperCase();

			var values = '';
			for (var a = 2; a < splitSpasi.length; a++) {
				console.log(splitSpasi[a]);
				values += splitSpasi[a];
			}
			document.getElementById("jqg1").value = values;
		}


	}

}


