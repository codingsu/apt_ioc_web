function getPartOfInfo(list,tb_id, num, operate) {
  // var parent = $("#" + tb_id);
  // var seletor = parent.children("tbody").children("tr:" + operate + "(" + (num - 1) + ")");
  // return $(seletor);
  var tar = Array.prototype.filter.call(list, function(obj,idx) {
    if (idx >= num) {
      return $(obj)
    };
  });
  return $(tar);
}

function regClickEvent(list,tb_id, btn_container_id, num) {
    var btn = $("#" + btn_container_id).find("button");
    btn.click(function() {
        // var list = getPartOfInfo(list,tb_id, num, "gt");
        if (btn.html() == getString("show_more")) {
            btn.addClass("less")
            btn.html(getString("show_less"))
            list.removeClass("hidden");
            // list.show();
        } else if (btn.html() == getString("show_less")) {
            btn.removeClass("less")
            btn.html(getString("show_more"))
            var top = $("#"+tb_id).parents("div.panel").offset().top
            $('html, body').animate({
                scrollTop:$("#"+tb_id).parents("div.panel").offset().top }, 1000);
            list.addClass("hidden");
        };
    })
}

function initInfo(list, num, tb_id, btn_container_id) {
  if (list.length > num) {
    var listMore = getPartOfInfo(list,tb_id, num, "gt");
    listMore.addClass("hidden");
    initBadge(btn_container_id, list);
    regClickEvent(listMore,tb_id, btn_container_id, num);
    $("#" + btn_container_id).removeClass("hidden"); 
  }
}

function initBadge(btn_container_id, list) {
  var btnContainer = $("#" + btn_container_id);
  var spanBadge = btnContainer.find("span.vb-badge");
  if (spanBadge.text().trim() == "") {
      spanBadge.text(getString("list.count1")+list.length+getString("list.count2"));
  }
}

function isIE(version) {
  if (version == null || version.trim() == "") {
    return navigator.userAgent.indexOf("MSIE") > 0 } else {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
      var v = "MSIE " + version
      return navigator.userAgent.indexOf(v) > 0
    } else {
      return false }
  }
}
/*body height:main_body padding-top:59,所以不减 nav_height*/
function initBodyMinHeight() {
  var screenHeight =$(window).height();
  footer_height =$("footer").length==1?$("footer")[0].offsetHeight:0;
  main_body = $(".main_body");
  main_body.css("min-height", screenHeight - footer_height);
}

function setVerticalMiddle(ele) {
  var screenHeight = window.innerHeight ? window.innerHeight : window.clientHeight,
      eleHeight = ele.height(),
      gapHeight = screenHeight - eleHeight - 140,
      top = gapHeight / 2;
  if (!IsPC()) { gapHeight = screenHeight - eleHeight - 140 - 100 };
  top = gapHeight / 2;
  ele.css("margin-top", top);
}

function setMsgByDevice(ele, percentagelist) {
  var windowWidth = window.innerWidth ? window.innerWidth : window.clientWidth;
  if (IsPC()) { ele.css({ width: windowWidth * percentagelist[0] }) } else { ele.css({ width: windowWidth * percentagelist[1] }) }
}

function setMsgPos(img, msgContainer) {
  var top = img.offset().top,
    height = img.height(),
    bottom = top + height,
    msgHeight = msgContainer.height(),
    gapHeight = height - msgHeight,
    msgTop = top + gapHeight / 2;
  msgContainer.css({ "top": -1 * 2 * height / 3 - msgHeight, "width": img.width() * 0.4 });
}
function isNullInput(input){
  return  input.length == 0;
}
function isValidEmail(email) {
  var emailReg = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
  var isValidEmail = emailReg.test(email)
  return isValidEmail
}

function isSame(v1, v2) {
  return v1 == v2 }

function isCorrectExtraCode(inputcode) {}

function isCorrectPsw(password) {
  var reg1=/^(?=.*\d).{8,16}$/;
  var reg2=/^(?=.*[a-zA-Z]).{8,16}$/;
  var reg3=/^(?=.*(?=[\x20-\x7e])[^a-zA-Z0-9]).{8,16}$/;
  // var reg3=/(?=.*[^a-zA-Z0-9].*).{8,16}/i;
  var blank=0;
  blank+=reg1.test(password);
  blank+=reg2.test(password);
  blank+=reg3.test(password);
  if(blank>=2){
      return true;
  }
  else{
      return false;
  }
}

function checkFormatBeforeSubmit(checkHandler,checkTarget,info,comparePsw){
  checkTarget.blur(function(){
    var isValid = checkHandler($(this).val());
    //不合法
    if (!isValid) {
      $(this).parents("div.control-container").removeClass("vb-success").addClass("vb-error");
      $(this).next().next("p.error").html(info[0]).removeClass("hidden");
    } else {
    //合法
    //需要比较密码
      if (comparePsw) {
        //校验两次密码是否相同
        var val1 = $(this).val();
        // var val2 = $(checkTarget[0])==$(this)?$(checkTarget[1]).val():$(checkTarget[0]).val()
        var val2 = $(this).attr("id")=="password"?$("#reg_confrim").val():$("#reg_password").val();
        if (val1!=undefined&&val2!=undefined) {
          if(isSame(val1,val2)){
            //密码相同
            $(this).next().next("p.error").addClass("hidden")
            $(this).parents("div.control-container").removeClass("vb-error").addClass("vb-success");
          } else {
            //密码不同，报错：不一致
            $(this).next().next("p.error").html(info[1]);
            $(this).next().next("p.error").removeClass("hidden");
            $(this).parents("div.control-container").removeClass("vb-success").addClass("vb-error");
          }

        };
      }else{
        $(this).parents("div.control-container").removeClass("vb-error").addClass("vb-success");
        $(this).next().next("p.error").html(info[0]).addClass("hidden");
      }

    }
  }).focus(function(){
    $(this).parents("div.control-container").removeClass("vb-error").removeClass("vb-success");
    $(this).next().next("p.error").html("")
  });
}

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}


/*user body height*/
function initUserBodyMinHeight() {
  var screenHeight = window.innerHeight ? window.innerHeight : (window.clientHeight?window.clientHeight:window.screen.height),
  screenWidth = window.innerWidth ? window.innerWidth:(window.clientWidth?window.clientWidth:window.screen.width),
  nav_height = $("header")[0].offsetHeight,//60,
  footer_height =$("footer").length==1?$("footer")[0].offsetHeight:0,
  main_body = $(".main_body");
  main_body.css("min-height", screenHeight - footer_height - nav_height - 20)
}

function dlgCloseBtnSet(id){//this function's name is not appropriate,but in same use
  $("div#"+id+".modal.fade[role='dialog']").each(function(){
    $(this).on('hidden.bs.modal',function(){
      $(this).empty();
    });
  });
}
function searchAlertHide(){
  var $info=$('form#form_search>span>span.warn-info.search-wrong');
  $info.addClass('hidden');
  var $q=$('#q');
  if($('#search_input').length==0){
    $q.attr('placeholder',getString('tip_ana'));
  }
  else if(!IsPC()){
    $q.placeholder({word:'IP,domain,hash'});
  }
}
function searchAlert(string){
  var $info=$('form#form_search>span>span.warn-info.search-wrong');
  $info.html(string);
  $info.removeClass('hidden');
  var $q=$('#q');
  if($('#search_input').length==0){//to distinguish if not index
    $q.removeAttr('placeholder');
  }
  else if(!IsPC()){//index on mobile
    $q.placeholder({word:''});
  }
}

function alertModal(str,success){// a function for vote alert success:1 blue 2:red
  var modalstr="<div class='modal fade bs-example-modal-sm' id='alertModal' tabindex='-1' role='dialog'>";
  modalstr+="<div class='modal-dialog modal-sm'><div class='modal-content'>";
  modalstr+="<div class='modal-header'><button type='button' class='close' data-dismiss='modal'><span>×</span></button></div>";
  modalstr+="<div class='modal-body text-center'><h1 style='margin-top:20px' class='md-font-size ";
  modalstr+=success?"blue":"tip error";
  modalstr+=" title-info'>"+str+"</h1>";
  modalstr+="<button class='btn btn-default mdless-font-size center-block' style='width:100%' data-dismiss='modal'>关闭</button>";
  modalstr+="</div></div></div></div>";
  $(modalstr).appendTo('body')
  .modal('show')
  .on('hidden.bs.modal',function(){
    $(this).remove();
  });
}
function formatUrl(url,len){
  var res = ""
  var gap = len - url.length
  if (gap >= 0) {
    res = url
  } else {
    var temp  = {}
    var el = document.createElement('a');
    el.href = url;
    temp.protocol = el.protocol;
    temp.host = el.host;
    temp.pathname = el.search?el.pathname.substring(0,el.pathname.length - 1):el.pathname;
    temp.filename = temp.pathname.substring(temp.pathname.lastIndexOf("/") + 1);
    temp.search = el.search;
    var hostRemainedLen = len - temp.host.length - temp.protocol.length - 2 - (el.search?Number(1):Number(0));
    res = temp.protocol+"//";
    if (hostRemainedLen >= 0) {
      res += temp.host;
      var pathRemainedLen = hostRemainedLen - temp.filename.length;
      if (pathRemainedLen >= 0) {
        res += temp.pathname.substring(0,pathRemainedLen) + "..." + temp.filename
        var searchRemainedLen = pathRemainedLen - temp.search
        if (searchRemainedLen >= 0) {
          res += temp.search
        } else {
          res += temp.search.substring(0,searchRemainedLen) + "..."
        }
      } else {
        res += "..." + temp.filename.substring(0,hostRemainedLen) +"..."
      }
    } else {
      res += temp.host.substring(0,temp.host.indexOf(temp.host.slice(hostRemainedLen))) + "...";
    }
  }
  return res;
}