var selectedFile = null;
var selectedFileName = null;
var currentUpload = null;

function uploadProgress(a) {
  if (a.lengthComputable) {
    var b = Math.round(a.loaded * 100 / a.total);
    $("#upload_progress_bar").css("width", b + "%")
  }
}
function uploadComplete(a) {
  //alert("uploadComplete");
  $("#upload_progress_bar").css("width", "100%");
    // if no existing report for the file, the server will
    // arrange a scan task return the status right now.
  var text = this.responseText;
  console.log("response text (uploadComplete): " + text);
  console.log("a: " + a);
  try {
    var b = $.parseJSON(text);
    console.log("view_report_url: " + b.view_report_url);
    if (b.view_report_url) {
      $("#upload_progress_dialog").modal('hide');
      window.setTimeout(function() {
        window.location.href = b.view_report_url;
      }, 1000);
	 }
  } catch(e) {
    //alert(this.responseText);
    // if there is existing report for the uploaded file,
    // show the prompt dialog to let user choice:
    //      a. show the last analysis report.
    //      b. rescan the file.
    window.setTimeout(function() {
      //alert(e);
      $("#upload_progress_dialog").html(text);
      showUploadProgressDialog();
    }, 1000)
  }
}
function uploadFailed(a) {
  alert(getString("file_upload_failed"))
}
function cancelUpload() {
  if (currentUpload) {
    currentUpload.abort()
  }
  //$('.theme-popover-mask').fadeOut(100);
  $("#upload_progress_dialog").modal("hide");
}

function showUploadProgressDialog() {
  //$('.theme-popover-mask').fadeIn(100);
  //$("#upload_progress_dialog").show().removeClass('hidden');
  $("#upload_progress_dialog").modal('show');
}

function showFileScanConfirmationDlg(last_report_url,
		last_scan_time, last_scan_ago, first_scan_time, first_scan_ago, rescan_url, ratio) {
  $("#file_rescan_btn").attr("href", rescan_url);
  $("#view_last_report_btn").attr("href", last_report_url);
  $("div#file_scan_confirmation_dialog span#last_scan_time").html(last_scan_time);
  $("div#file_scan_confirmation_dialog span#last_scan_ago").html(last_scan_ago);
  $("div#file_scan_confirmation_dialog span#first_scan_time").html(first_scan_time);
  $("div#file_scan_confirmation_dialog span#first_scan_ago").html(first_scan_ago);
  console.log("ratio: " + ratio);
  $("div#file_scan_confirmation_dialog span#ratio").html(ratio);
  window.setTimeout(function() {
    $("#upload_progress_dialog").modal("hide");
		//$('.theme-popover-mask').fadeIn(100);
		$("#file_scan_confirmation_dialog").modal("show");
  }, 1000);
}

function ajaxFileUpload(url) {
    //开始上传文件时显示一个图片,文件上传完成将图片隐藏
    //$("#loading").ajaxStart(function(){$(this).show();}).ajaxComplete(function(){$(this).hide();});
    //执行上传文件操作的函数
  $("#upload_progress_container").addClass("hidden");
	$("#upload_progress_container2").removeClass("hidden").show();
	console.log("uploading file via ajaxFileUpload component...");
    $.ajaxFileUpload({
        url: url,
        secureuri: false,                   //是否启用安全提交,默认为false
        fileElementId: 'file_input',           //文件选择框的id属性
        dataType: 'text',                       //服务器返回的格式,可以是json或xml等
        success: function(data, status){        //服务器响应成功时的处理函数
            console.log(data);
            data = data.replace("<PRE>", "");
            data = data.replace("</PRE>", "");
            data = data.replace("<pre>", "");
            data = data.replace("</pre>", "");
            try {
                var b = $.parseJSON(data);
                if (b.view_report_url) {
					//$("#upload_progress_dialog").hide()
					window.setTimeout(function() {
                       window.location.href = b.view_report_url;
                    }, 1000);
				}
            } catch(e) {
	            // if there is existing report for the uploaded file,
	            // show the prompt dialog to let user choice:
	            //      a. show the last analysis report.
	            //      b. rescan the file.
            	console.log("failed to parse json, assume the response text is html: " + data);
			    window.setTimeout(function() {
	              //alert(e);
	              $("#upload_progress_dialog").html(data);
	              showUploadProgressDialog();
	            }, 1000);
            }
        },
        error: function(data, status, e){ //服务器响应失败时的处理函数
            console.log("error: " + e);
        	alert(e);
        }
    });
}

// 以AJAX形式提交文件
function uploadByAJAX(file, sha256, url) {
	console.log("uploading file via XMLHttpRequest...");
	console.log("url: " + url);

  var formData = new FormData();
  formData.append("file", file);
  formData.append("ajax", "true");
  if (sha256) {
    formData.append("sha256", sha256);
  }

  currentUpload = new XMLHttpRequest();
  currentUpload.upload.addEventListener("progress", uploadProgress, false);
  currentUpload.addEventListener("load", uploadComplete, false);
  currentUpload.addEventListener("error", uploadFailed, false);

  currentUpload.open("POST", url);
  currentUpload.send(formData);
}

function onUploadSHA256Succeed(r, file, sha256, url) {
    var rc = r.response_code;
    console.log("rc:" + rc);
    if (rc == 0) {
      // first case:
      // a last analysis report exist, show a prompt dialog to let user
      // choice: 1. show the last report or 2. rescan the file.
      showFileScanConfirmationDlg(r.view_report_url, r.last_analysis_date,
        r.last_analysis_ago, r.first_analysis_date, r.first_analysis_ago, r.rescan_url, r.ratio);
    } else if (rc == 1) {
      // 2nd case:
      // the files does exist on server, but no report for it, so do NOT need send file again
      // the server will arrange a scan, here return the status (queued in most times)
      //alert(r.permalink);
      window.setTimeout(function() {
        window.location.href = r.view_report_url;
      }, 1000);
    } else if (rc == 3) {
        // 4th case:
        // the files does NOT exist on server, send the file content
        // the server will save the file, arrange a scan and return the status.
        // deal with the returned status in uploadComplete function.
    	// FIXME, need support IE.
  	    submitFile(file, sha256, url);
     } else {
    	 alert("Invalid response code: " + rc);
     }
}

// 先把sha256提交上去看看有没有文件的报告
function uploadSHA256(fileName, file, sha256, url) {
	var d = {
      'sha256': sha256,
	    'fileName': fileName
    }

    $.ajax({
        type: "GET",
        async: true,
        url: "/check_file_scan_history",
        dataType: "json",
        data: d,
        cache: false,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        	console.log("error: " + XMLHttpRequest.responseText);
          //alert(XMLHttpRequest.responseText);
          //$("#error_dialog").html(XMLHttpRequest.responseText);
          //$("#error_dialog").modal("show");
          //window.setTimeout(function() {
          //  $("#error_dialog").modal("show");
          //}, 500);
          $("#upload_progress_dialog").html(XMLHttpRequest.responseText);
          showUploadProgressDialog();
          //alert(XMLHttpRequest.status);
          //alert(XMLHttpRequest.readyState);
          //alert(textStatus);
        },
        complete: function(XMLHttpRequest, textStatus) {
          //alert("complete:" + XMLHttpRequest.responseText); // 调用本次AJAX请求时传递的options参数
        },
        success: function(r) {
        	onUploadSHA256Succeed(r, file, sha256, url);
        }
   });
}

function submitFile(file, sha256, url) {
//  if (file && window.FormData && (new XMLHttpRequest().upload)) {
//    uploadByAJAX(file, sha256, url);
//  } else {
//    ajaxFileUpload(url);
//  }
	// FIXME, need support IE.
     //if (jQuery.browser.msie) {
  if ($.isIE()) {
    // FIXME
    var ie_version = window.browser?window.browser['version']:undefined
    if (ie_version !== undefined && ie_version<10) {
       ajaxFileUpload(url);

    } else {
      uploadByAJAX(file, sha256, url);
    }

    // ajaxFileUpload(url);
  } else if (file && window.FormData) {
    uploadByAJAX(file, sha256, url);
  } else {
    $("#form_file").submit();
    $("#upload_progress_1 span").html('<img style="display:block" src="./static/img/bar.gif">');
  }
}

function uploadFile(fileName, file, sha256) {
	if (!fileName) {
		//alert(getString("no_file_selected"));
		return;
	}

  var f = $("#form_file");
  var url = f.attr("action");

  console.log("url: " + url);

  if (sha256) {
	  uploadSHA256(fileName, file, sha256, url);
  } else {
	  submitFile(file, sha256, url);
  }
}

function canUseWorker() {
  if (window.FileReader && window.Worker) {
    //console.log("is ie: " + $.isIE());
    if ($.isIE()) {
      return false;
    }
    return true;
    // var a = parseInt(jQuery.browser.version, 10);
    // if (jQuery.browser.opera) {
      // return false
    // }
    // if (jQuery.browser.mozilla && a >= 13) {
      // return true
    // }
    // if (jQuery.browser.webkit && a >= 535) {
      // return true
    // }
//    if (jQuery.browser.msie && a >= 10) {
//    	return true;
//    }
  }
  return false
}
function scanFile(a,b) {

  //if (selectedFileName && !selectedFile) {
//	var b = $("#form_file").getData();
//	if (b.target.files)
//	selectedFile = b.target.files[0];
 // }
  //selectedFile = selectedFile?"":b;
  if (!selectedFileName) {
$('#no_file_info').removeClass("hidden")
    //alert(getString("no_file_selected"));
    return false;
  }

  if (selectedFile && selectedFile.size > 80 * 1024 * 1024) {
    alert(getString("max_file_size"));
    return false;
  }

  // FIXME, alert when the size is 0
  if (selectedFile && selectedFile.size == 0) {
    alert(getString("zero_file_size"));
    return false;
  }

  restoreUploadDlgHtml();
  showUploadProgressDialog();

  if (canUseWorker()) {
    console.log("calc sha256: " + selectedFileName);
    $("#upload_progress_container").addClass("hidden");
    $("#hash_progress").css("width", "0%");
    $("#hash_progress_container").removeClass("hidden").show();
    worker = new Worker("/static/js/sha256.js");
    worker.onmessage = function(b) {
      if (b.data.progress) {
        $("#hash_progress").css("width", b.data.progress + "%")
      } else {
        $("#hash_progress_container").addClass("hidden");
        $("#upload_progress_bar").css("width", "0%");
        $("#upload_progress_container").removeClass("hidden").show();
        console.log("sha256: " + b.data.sha256);
        uploadFile(selectedFileName, selectedFile, b.data.sha256)
      }
    };
    worker.postMessage({
      file: selectedFile
    })

  } else {
    console.log("Can not calc sha256.");
    $("#upload_progress_container").removeClass('hidden').show();
    uploadFile(selectedFileName, selectedFile, null)
  }

  return false;
}
function selectFile(a) {
  if (a.target.files) {
    selectedFile = a.target.files[0]
  }

  var b = $(this).val().split(/(\\|\/)/g);
  selectedFileName = b[b.length - 1];
  $("#file_name").text(selectedFileName);
  $("#scan_file_btn").focus();
}

function register($form,flag) {

	var b = $form;
	var c = b.getData();
  var isCompany = flag
  c.isCompany = isCompany

	$.ajax({
		type: "POST",
		async: true,
    // url:'/registration/finish',
		url: b.attr("action"),
		data: c,
		dataType: "html",
		cache: false,
		success: function(data) {
      // $($form.find("a.btn")).html('注册')
      $('body').html(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("get error (registration): " + XMLHttpRequest.status + ", " + XMLHttpRequest.responseText);
		},
		complete: function(XMLHttpRequest, textStatus) {
		  //alert(XMLHttpRequest.responseText); // 调用本次AJAX请求时传递的options参数
		},
    beforeSend:function(){
      $($form.find("a.btn")).html('<div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
    }
	})
}

function login() {
	var b = $("#login_frm");
	var c = b.getData();
	// if (c.username == "") {
	// 	alert(getString("input_email"));
	// 	return;
	// }

	// if (c.password == "") {
	// 	alert(getString("input_password"));
	// 	return;
	// }

 //  if (c.captcha == "") {
	// 	alert(getString("input_extracode"));
	// 	return;
	// }

	// $("#login_loading").removeClass("hidden").show();
	//c.response_format = "json";
	$.ajax({
		type: "POST",
		async: true,
		url: $("#login_frm").attr("action"),
		data: c,
		dataType: "html",
		cache: false,
		success: function(d, status, xhr) {
			try {
				var obj = jQuery.parseJSON(d);
				if (obj && typeof(obj.signed_in) != 'undefined' && obj.signed_in == 1) {
          if (obj.next) {
						window.location.href = obj.next;
					} else if (typeof(next_url) != 'undefined') {
						window.location.href = next_url;
					} else {
						window.location.reload();
					}
				} else {
					$("#dlg").html(d);
				}
            } catch(e) {
              console.log("get error: " + d);
				$("#dlg").html(d);
            }

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		  // alert(XMLHttpRequest.status + ", " + XMLHttpRequest.responseText);
		  //alert(XMLHttpRequest.status);
		  //alert(XMLHttpRequest.readyState);
		  //alert(textStatus);
		},
		complete: function(XMLHttpRequest, textStatus) {
		  //alert(XMLHttpRequest.responseText); // 调用本次AJAX请求时传递的options参数
		},
    beforeSend:function(){
      $("#login_btn").html('<div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
    }

	})
}

// use ajax to load the content of a model dialog and show it.
//function showDlg(dlgId, url, callback) {
//  var dlg = $("#" + dlgIt);
//  dlg.load(url, callback);
//  dlg.modal('show');
//}

function showDlg(url, callback) {
  var dlg = $("#dlg");
  dlg.load(url, callback);
  dlg.modal('show');
  //showDlg("dlg", url, callback);
}

// 在可视化中，点击域名的注册人或注册邮箱，会显示一个pane，其中列出该人名/email的历史变化
function buildNameOrEmailPane(data) {
  var s = "";
	if (data && data.length > 0) {
    s += "<span>"+getString("change_history")+"</span><br/>";
		$.each(data, function(i, h) {
			s += "<li>";
			s += h;
			s += "</li>";
		});
  }
  return s;
}

// emailList是域名注册邮箱的历史
// nameList是域名注册人名的历史
function createGraph(data, containerId, rootImg, tags, emailList, nameList) {

  console.log("data: " + data.nodes);

  var cy = window.cy = cytoscape({
    container: document.getElementById(containerId),
    minZoom: 0.1,
    style: [
      { selector: 'node[type = "DOMAIN"]',
        css: {'background-color': '#3fa9f5', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png) no-repeat 0 0','background-repeat':'no-repeat','background-position-x':'0','background-position-y':' 0','width':'21px','height':'20px', 'font-size': '10px' }
      },
      { selector: 'node[id = "' + data.root + '"]',
        css: {'background-color': '#f9f9f9', 'content': 'data(name)', 'background-image': 'url(/static/img/' + rootImg + '.png) no-repeat', 'width': '60px', 'height': '60px', 'font-size': '10px' }
      },
      { selector: 'node[type = "IP"]',
        css: {'background-color': '#33d8e5', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-44px','background-position-y':' 0','width':'21px','height':'20px', 'font-size': '10px'}
      },
      { selector: 'node[type = "SAMPLE"]',
        css: {'background-color': '#4bccf9', 'content': '', 'background-image': 'url(/static/img/visualiazation20.png)', 'background-repeat':'no-repeat','background-position-x':'-22px','background-position-y':' 0','width':'21px','height':'20px','font-size': '10px'}
      },
      { selector: 'node[type = "NAME"]',
        css: {'background-color': '#7ac943', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-88px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px'}
      },
      { selector: 'node[type = "EMAIL"]',
        css: {'background-color': '#1be2a0', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-66px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px'}
      },
      { selector: 'node[type = "TI_SAMPLE"]',
        css: {'background-color': '#f96969', 'content': '', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-176px','background-position-y':' 0','width':'20px','height':'21px',  'font-size': '10px'}
      },
      { selector: 'node[type = "TI_IP"]',
        css: {'background-color': '#f4b041', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-132px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px'}
      },
      { selector: 'node[type = "TI_DOMAIN"]',
        css: {'background-color': '#f63c3f', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-197px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px', 'text-max-width': 30, 'text-wrap': 'truncate'}
      },
      { selector: 'node[type = "TI_OTHER"]',
        css: {'background-color': '#f2d351', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-110px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px'}
      },
      { selector: 'node[type = "TI_URL"]',
        css: {'background-color': '#f7824d', 'content': 'data(name)', 'background-image': 'url(/static/img/visualiazation20.png)','background-repeat':'no-repeat','background-position-x':'-154px','background-position-y':' 0','width':'21px','height':'20px',  'font-size': '10px', 'text-max-width': 30, 'text-wrap': 'truncate'}
      },
      { selector: 'edge',
        css: {'content': 'data(relationship)', 'target-arrow-shape': 'triangle', 'width': 1}
      }
    ],
    elements: {
      nodes: data.nodes,
      edges: data.edges,
    },

    layout: { name: 'cose'},
    wheelSensitivity: 0.2,
    ready: function() {
      console.log("count of nodes: " + this.nodes().size());
      if (this.nodes().size() < 5) {
        this.zoomingEnabled(false);
        this.center();
      }
    }
    });

    // just use the regular qtip api but on cy elements
    cy.$("node").qtip({
    content: function() {
      var s = this.data('name');
      var type = this.data('type');
      if (type == "SAMPLE" || type == "TI_SAMPLE") {
        s = "<a href='/report/file/" + this.data('name') + "' target='_blank'>" + this.data('name') + "</a>";
      } else if (type == "DOMAIN" || type == "TI_DOMAIN" || type == "TI_URL") {
        s = "<a href='/query?q=" + this.data('name') + "' target='_blank'>" + this.data('name') + "</a>";
      } else if (type == "EMAIL") {
        if (emailList && emailList.length > 0) {
          s = "<div>" + buildNameOrEmailPane(emailList) + "</div>"
        }
      } else if (type == "NAME") {
        if (nameList && nameList.length > 0) {
          s = "<div>" + buildNameOrEmailPane(nameList) + "</div>"
        }
      } else if (type == "IP" || type == "TI_IP") {
        s = "<a href='/ip/" + this.data('name') + "' target='_blank'>" + this.data('name') + "</a>";
      }

      if (tags && this.data('id') == data.root) {
        s += "<div>" + buildTagPane(tags) + "</div>"
      }

      return s;
    },
    position: {
      my: 'top center',
      at: 'bottom center'
    },
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    }
  });
}

// 在可视化中，点击主node会显示一个pane，其中列出相关Tag
function buildTagPane(tags) {
  var s = "";
	if (tags && tags.length > 0) {
		$.each(tags, function(i, tag) {
			s += "<span class='label tag clickable-tag'>";
			s += "<a href='/tag/" + tag + "' target='_blank'>" + tag + "</a>";
			s += "</span><br/>";
		});
  }
  return s;
}

function showVoteDlg(initData) {

	// hide all title.
	$("#title_hash").addClass("hidden")
	$("#title_ip").addClass("hidden")
	$("#title_domain").addClass("hidden")

	// hide all items.
	$("#vote_safe").addClass("hidden")
	$("#vote_danger").addClass("hidden")
	$("#vote_malicious_site").addClass("hidden")
	$("#vote_remote_server").addClass("hidden")
	$("#vote_phishing_site").addClass("hidden")
	$("#vote_anonymous_service").addClass("hidden")
	$("#vote_normal_site").addClass("hidden")
	$("#vote_fail_host_ip").addClass("hidden")
	$("#vote_scan_ip").addClass("hidden")
	$("#vote_remote_server_ip").addClass("hidden")
	$("#vote_anonymous_service_ip").addClass("hidden")
	$("#vote_junk_mail_ip").addClass("hidden")
	$("#vote_dynamic_ip").addClass("hidden")
	$("#vote_gateway_ip").addClass("hidden")

	// uncheck all checkbox
	//$("#check_safe").removeAttr("checked");
	//$("#check_danger").removeAttr("checked");
	//$("#check_malicious_site").removeAttr("checked");
	//$("#check_remote_server").removeAttr("checked");
	//$("#check_phishing_site").removeAttr("checked");
	//$("#check_anonymous_service").removeAttr("checked");
	//$("#check_normal_site").removeAttr("checked");
	//$("#check_fail_host_ip").removeAttr("checked");
	//$("#check_scan_ip").removeAttr("checked");
	//$("#check_remote_server_ip").removeAttr("checked");
	//$("#check_anonymous_service_ip").removeAttr("checked");
	//$("#check_junk_mail_ip").removeAttr("checked");
	//$("#check_dynamic_ip").removeAttr("checked");

	$("#check_safe").val(0);
	$("#check_danger").val(0);
	$("#check_malicious_site").val(0);
	$("#check_remote_server").val(0);
	$("#check_phishing_site").val(0);
	$("#check_anonymous_service").val(0);
	$("#check_normal_site").val(0);
	$("#check_fail_host_ip").val(0);
	$("#check_scan_ip").val(0);
	$("#check_remote_server_ip").val(0);
	$("#check_anonymous_service_ip").val(0);
	$("#check_junk_mail_ip").val(0);
	$("#check_dynamic_ip").val(0);
	$("#check_gateway_ip").val(0);

	$("#voteComments").val(initData.comments);

    if(initData.kind=="hash")
	{
		$("#title_hash").removeClass("hidden")

		$("#vote_safe").removeClass("hidden")
		$("#vote_danger").removeClass("hidden")

		$("#ipDomainHash").val(initData.sha256);

		if (initData.normal_file == 1)
		{
			$("#check_safe").attr("checked",true);
		}
		if (initData.virus_File == 1)
		{
			$("#check_danger").attr("checked",true);
		}
	}
    else if (initData.kind=="domain")
	{
		$("#title_domain").removeClass("hidden")

		$("#vote_malicious_site").removeClass("hidden")
		$("#vote_remote_server").removeClass("hidden")
		$("#vote_phishing_site").removeClass("hidden")
		$("#vote_anonymous_service").removeClass("hidden")
		$("#vote_normal_site").removeClass("hidden")

		$("#ipDomainHash").val(initData.domain);

		if (initData.malicious_site == 1)
		{
			$("#check_malicious_site").attr("checked",true);
		}
		if (initData.remote_server == 1)
		{
			$("#check_remote_server").attr("checked",true);
		}
		if (initData.phishing_site == 1)
		{
			$("#check_phishing_site").attr("checked",true);
		}
		if (initData.anonymous_service == 1)
		{
			$("#check_anonymous_service").attr("checked",true);
		}
		if (initData.normal_site == 1)
		{
			$("#check_normal_site").attr("checked",true);
		}
	}
	else if (initData.kind=="ip")
	{
		$("#title_ip").removeClass("hidden")

		$("#vote_fail_host_ip").removeClass("hidden")
		$("#vote_scan_ip").removeClass("hidden")
		$("#vote_remote_server_ip").removeClass("hidden")
		$("#vote_anonymous_service_ip").removeClass("hidden")
		$("#vote_junk_mail_ip").removeClass("hidden")
		$("#vote_dynamic_ip").removeClass("hidden")
		$("#vote_gateway_ip").removeClass("hidden")

		$("#ipDomainHash").val(initData.ip);

		if (initData.fail_host == 1)
		{
			$("#check_fail_host_ip").attr("checked",true);
		}
		if (initData.scan_ip == 1)
		{
			$("#check_scan_ip").attr("checked",true);
		}
		if (initData.remote_server == 1)
		{
			$("#check_remote_server_ip").attr("checked",true);
		}
		if (initData.anonymous_service == 1)
		{
			$("#check_anonymous_service_ip").attr("checked",true);
		}
		if (initData.junk_mail == 1)
		{
			$("#check_junk_mail_ip").attr("checked",true);
		}
		if (initData.dynamic_ip == 1)
		{
			$("#check_dynamic_ip").attr("checked",true);
		}
		if (initData.gateway_ip == 1)
		{
			$("#check_gateway_ip").attr("checked",true);
		}
	}

	$("div.vote-modal").modal()

}

function openVoteDlg4Login(ipDomainHash,isLogin,alertInfo) {

  if (!isLogin) {
    $('#common-modal').modal('show')
    // alert(alertInfo);
    return;
  }
	var d = {
      'ipDomainHash' : ipDomainHash
    }

    $.ajax({
        type: "GET",
        async: true,
        url: "/getVoteLog4User",
        dataType: "json",
        data: d,
        cache: false,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        	console.log("error: " + XMLHttpRequest.responseText);
          //alert(XMLHttpRequest.responseText);
          //$("#error_dialog").html(XMLHttpRequest.responseText);
          //$("#error_dialog").modal("show");
          //window.setTimeout(function() {
          //  $("#error_dialog").modal("show");
          //}, 500);
          //$("#upload_progress_dialog").html(XMLHttpRequest.responseText);
          //showUploadProgressDialog();
          //alert(XMLHttpRequest.status);
          //alert(XMLHttpRequest.readyState);
          //alert(textStatus);
        },
        complete: function(XMLHttpRequest, textStatus) {
          //alert("complete:" + XMLHttpRequest.responseText); // 调用本次AJAX请求时传递的options参数
        },
        success: function(r) {
        	showVoteDlg(r);
          checkAvaLength_checked()
        }
   });
}

function SubmitVote() {
	var cks = $('.vote-modal').find("input:checked");
  var cks_values = [];
  cks.each(function(){
    $(this).val(1)
  });
  $.ajax({
    type: "POST",
    url: "/saveVoteResult",
    data: {
			"ipDomainHash": $("#ipDomainHash").val(),
			"comments": $("#voteComments").val(),
			"vote_safe": $("#check_safe").val(),
			"vote_danger": $("#check_danger").val(),
			"vote_malicious_site": $("#check_malicious_site").val(),
			"vote_remote_server": $("#check_remote_server").val(),
			"vote_phishing_site": $("#check_phishing_site").val(),
			"vote_anonymous_service": $("#check_anonymous_service").val(),
			"vote_normal_site": $("#check_normal_site").val(),
			"vote_fail_host_ip": $("#check_fail_host_ip").val(),
			"vote_scan_ip": $("#check_scan_ip").val(),
			"vote_remote_server_ip": $("#check_remote_server_ip").val(),
			"vote_anonymous_service_ip": $("#check_anonymous_service_ip").val(),
			"vote_junk_mail_ip": $("#check_junk_mail_ip").val(),
			"vote_dynamic_ip": $("#check_dynamic_ip").val(),
			"vote_gateway_ip": $("#check_gateway_ip").val()
    },
    success: function(data, textStatus) {
      $("div.vote-modal").modal('hide');
      saveVoteResultCallback(data == "success");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $("div.vote-modal").modal('hide');
      saveVoteResultCallback(data == "success");
      console.log("Failed to save vote result, error: " + XMLHttpRequest.responseText);
    }
  });
}
// trancate a string
function trancate(s, max) {
  if (!max) {
    max = 20;
  }

  if (s.length > max) {
    return s.substring(0, max) + "...";
  }

  return s;
}

function chooseRegType(){
  // if (isPersonal) {
      $($('.reg-header a').get(0)).trigger('click');
      if (window.localStorage) {
        localStorage.clear();
      }
      // $this.siblings("a").removeClass("active")
      // $this.addClass("active")
      // var isRight = $this.hasClass("right")
      // if (isRight) {
      //   $(".navs-slider-bar").addClass("right")
      //
      //   $(".comp").find(".vb-error").removeClass("vb-error")
      //   $(".comp").removeClass("hidden")
      //   $(".pri").addClass("hidden")
      // } else {
      //   $(".navs-slider-bar").removeClass("right")
      //
      //   $(".pri").find(".vb-error").removeClass("vb-error")
      //   $(".pri").removeClass("hidden")
      //   $(".comp").addClass("hidden")
      // }
  // }
}
