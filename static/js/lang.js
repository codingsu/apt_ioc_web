function setLang(lang) { $.cookie("VB_LANG", lang, { path: "/", secure: false }); }
function getLang() { return $.cookie("VB_LANG") ? $.cookie("VB_LANG") :"zh" }