$.fn.placeholder = function(option, callback) {
    var settings = $.extend({
        word: '',
        color: '#999',
        evtType: 'focus',
        zIndex: 20,
        diffPaddingLeft: 3,
        align:'left'
    }, option)
 
    function bootstrap($that) {
        // some alias
        var word    = settings.word
        var color   = settings.color
        var evtType = settings.evtType
        var zIndex  = settings.zIndex
        var diffPaddingLeft = settings.diffPaddingLeft
        var align =settings.align
 
        // default css
        var width       = $that.outerWidth()
        var height      = $that.outerHeight()
        var fontSize    = $that.css('font-size')
        var fontFamily  = $that.css('font-family')
        var paddingLeft = $that.css('padding-left')
 
        // process
        paddingLeft = parseInt(paddingLeft, 10) + diffPaddingLeft
 
        // redner
        var $placeholder = $('span.placeholder')
        $placeholder.css({
            position: 'absolute',
            zIndex: zIndex,
            color: color,
            // width: width + 'px',
            height: height + 'px',
            fontSize: fontSize,
            fontFamily: fontFamily,
            textAlign:align,
            display:'block'
            // marginTop:-1*height + 'px',
        }).text(word).hide()
 
        // 位置调整
        move()
 
        // textarea 不加line-heihgt属性
        if ($that.is('input')) {
            $placeholder.css({
                lineHeight: height + 'px'
            })
        }
        // $placeholder.appendTo(document.body)
 
        // 内容为空时才显示，比如刷新页面输入域已经填入了内容时
        var val = $that.val()
        if ( val == '' && $that.is(':visible') ) {
            $placeholder.show()
        }
 
        function hideAndFocus() {
            $placeholder.hide()
            $that[0].focus()
        }
        function move() {
            var offset = $that.offset()
            var top = 0
            // var top    = offset.top
            var left   = offset.left
            $placeholder.css({
                // top: top,
                // left: left
            })
        }
        function asFocus() {
            $placeholder.click(function() {
                hideAndFocus()
                // 盖住后无法触发input的click事件，需要模拟点击下
                setTimeout(function(){
                    $that.click()
                }, 100)
            })
            // IE有些bug，原本不用加此句
            $that.click(hideAndFocus)
            $that.blur(function() {
                var txt = $that.val()
                if (txt == '') {
                    $placeholder.show()
                }
            })
        }
        function asKeydown() {
            $placeholder.click(function() {
                $that[0].focus()
            })
        }
 
        if (evtType == 'focus') {
            asFocus()
        } else if (evtType == 'keydown') {
            asKeydown()
        }
        $that[0].onpaste=function(){
            hideAndFocus()
        }
        $that.keyup(function() {
            var txt = $that.val()
            if (txt == '') {
                $placeholder.show()
            } else {
                $placeholder.hide()
            }
        })
        // 窗口缩放时处理
        $(window).resize(function() {
            // alert($(this)[0].WindowState)
            // var this = $(this)
            // if (this.WindowState == FormWindowState.Normal)
            // {
            // this.WindowState = FormWindowState.Maximized;
            // }
            // else if (this.WindowState == FormWindowState.Maximized)
            // {
            // this.WindowState = FormWindowState.Normal;
            // } 
            move()
        })
 
        // cache
        $that.data('el', $placeholder)
        $that.data('move', move)
 
    }
 
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
}  