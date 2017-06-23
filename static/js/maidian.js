(function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
mixpanel.init("40eb2e7c7c9c8e218deaab4af6edde86");
$(function(){
  if (username) {
    mixpanel.identify(username +"|"+Math.random()*100);
    mixpanel.people.set({
      "username":username
    })  
  };
  
  $("body").click(function(e){
      var $cur = $(e.target||e.srcElement)
      var transData = {}
      if ($cur.hasClass("hook")) {
        if ($cur.hasClass("hook-tab")) {
          //tab
          var parent = $cur.parents("ul.res-tab").prop("id") //domain_tab|domain,tabs|ip,report_tab|report

          var href = $cur.prop("href")
          var to = href.substring(href.indexOf("#"))
          transData.page = parent=="domain_tab"?"域名页":(parent=="report_tab"?"文件页":"IP页")
          transData.tar = toChinese(to)
        } else if ($cur.hasClass("hook-reg")) {
          //from interest
          if ($cur.parents(".link4RightInterest").length > 0){
            var href = $cur.prop("href")
            var eqPos = href.indexOf("=")
            var type = ""
            if (eqPos!=-1) {
              //个人+企业
              var val = href.substring(eqPos+1)
              type = val=="1"?"个人":"企业"
            }else {
              //定制
              type = "定制"
            }
            transData.page = "账号权益页"
            transData.type = type
          } else {
            if ($cur.hasClass("reg")) {
              //main page
              type = "注册入口"
              transData.page = "网站header"
            } 
          }
          transData.tar = type
        }
        mixpanel.track(transData.tar,{"which-page":transData.page})
      }
    }) 
})
function toChinese(tar){
  var res = tar;
  switch(tar){
    case "#ti":res="威胁情报";break;
    case "#ip":res="IP分析|反查域名";break;
    case "#sub_domain":res="子域名";break;
    case "#whois":res="Whois";break;
    case "#ca":res="数字证书";break;
    case "#chart":res="可视分析";break;
    case "#detect_res":res="检测结果";break;
    case "#static_info":res="静态信息";break;
    case "#action_ana":res="行为分析";break;
    case "#net":res="网络活动";break;
    case "#graph":res="可视分析";break;
    case "#intell_community":res="情报社区";break;
    case "#apk_static":res="APK静态分析";break;
    case "#port":res="端口与服务";break;
  }
  return res
}