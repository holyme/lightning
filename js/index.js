(function(){
    // [util]
    var pad = function(str, length) {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    var getRandomInt = fabric.util.getRandomInt;

    var getRandomColor = function(){
        return (
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2)
        );
    };

    // [methods]

    var getTpl = function(){
        var selectTpl = $('#tpl-selector').val();
        $.get(selectTpl, function(result){
            tpl = result;
        });
    };

    var getLinksInfo = function(link){

        var linksGroup = link.split('][');
        if(linksGroup.length > 1){
            var httpLink = linksGroup[0].replace('[',''),
                appLink = linksGroup[1].replace(']',''),
                isComboLink = true,
                linkText = 'HTTP LINK : ' + httpLink + '\n\n' + 'APP  LINK : ' + appLink;
        }else{
            var linkText = 'HTTP LINK : ' + link;
        }

        return {
            linkText : linkText,
            isComboLink : isComboLink,
            httpLink : httpLink,
            appLink : appLink
        }

    };

    // buildCode
    var buildCode = function(){

        var pageTitle = $('#page-title').val();

        var svgCodeArray = [];

        var objs = canvas.getObjects().map(function(obj) {
            var codeString = '  <a xlink:href="'+obj.link+'">\n ' + obj.toSVG() + '\n   </a>';
            if(obj.httpLink){
                var codeString = '  <a xlink:href="'+obj.httpLink+'" httplink="'+obj.httpLink+'" applink="'+obj.appLink+'">\n   ' + obj.toSVG() + '\n   </a>';
            }

            svgCodeArray.push( codeString );
        });

        var svgCode = svgCodeArray.join('\n');

        svgCode = svgCode.replace(/(<g.*>)(<g.*?<\/g>)(<\/g>)/gi,'$1$3');


        // parse tpl
        var code = tpl;

        code = code.replace(/\$backgroundColor/g,$('#page-background-color').val());
        code = code.replace(/\$bgImage/g,info.bg);
        code = code.replace(/\$bgWidth/g,info.bgWidth);
        code = code.replace(/\$title/g,pageTitle);
        code = code.replace(/\$svnCode/g,svgCode);

        return code;

    };


    // [events]

    // background
    $('#fill-bg').click(function(){
        var bg = window.prompt('请填入图片URL(HTTP)','https://raw.githubusercontent.com/holyme/lightning/master/image/design-image.png');
        if(!bg)return;

        // measure image size
        $('#measure-image-box').attr('src',bg).load(function(){

            canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
            canvas.setWidth( this.offsetWidth );
            canvas.setHeight( this.offsetHeight );
            canvas.calcOffset();
            $('#canvas').fadeIn(500);

            // record
            info.bg = bg;
            info.bgWidth = this.offsetWidth;
            info.bgHeight = this.offsetHeight;
        })

        $('#add-rect').removeAttr('disabled');
        $('#welcome').hide();
    })


    // tpl selector
    $('#tpl-selector').change(function(){
        getTpl();
    });


    // add rect
    $('#add-rect').click(function(){
        var link = window.prompt('请填入超链接地址(双链接模式:HTTP链接与APP链接使用方括号分离)','[https://github.com/holyme/lightning][YourURLSchema://lighting/home]');
        if(!link)return;

        var linksInfo = getLinksInfo(link),
            linkText = linksInfo.linkText
            ;

        var text = new fabric.Text(linkText, {
          fontFamily:'arail',
          fontSize:14,
          textDecoration:'underline',
          fill:'#fff',
          textBackgroundColor: '#719CD3',
          padding:5
        });

        var rect = new fabric.Rect({
          left: -10,
          top: -10,
          fill: '#66C7EB',
          // fill : '#' + getRandomColor(),
          width: 600,
          height: 100,
          opacity: 0.51688
        });

        var group = new fabric.Group([  rect, text ], {
            top : 20,
            left : 20,
            transparentCorners: false,
            borderColor: 'gray',
            // cornerColor: 'black',
            cornerSize: 16
        });

        group.link = link;

        if(linksInfo.isComboLink) {
            group.httpLink = linksInfo.httpLink;
            group.appLink = linksInfo.appLink;
        }

        canvas.add(group);
        canvas.renderAll();
        canvas.calcOffset();

        $('#preview-page').removeAttr('disabled');
        $('#get-code').removeAttr('disabled');


    });

    // delete
    $(window).keydown(function(e) {

        if (e.target.tagName != 'INPUT' && ( e.keyCode == 8 || e.keyCode == 46 ) ) {
             var obj = canvas.getActiveObject();
             canvas.remove(obj);
             canvas.renderAll();
             return false;
        }
    });

    // dbclick
    fabric.util.addListener(fabric.document, 'dblclick', function(){
        var obj = canvas.getActiveObject();

        if(obj){

            var linkObj = obj.item(1),
                link = window.prompt('修改元素超链接(双链接模式:HTTP链接与APP链接使用方括号分离):',obj.link)
            ;
            if(!link)return;

            var linksInfo = getLinksInfo(link),
                linkText = linksInfo.linkText
                ;

            linkObj.set({ text:linkText });

            obj.link = link;
            if(linksInfo.isComboLink) {
                obj.httpLink = linksInfo.httpLink;
                obj.appLink = linksInfo.appLink;
            }

            canvas.renderAll();
            canvas.calcOffset();
        }

    });

    // Preview
    $('#preview-page').click(function(){
        var pWindow = window.open('about:blank');
        pWindow.document.write( buildCode() );
    });

    // Get Code !
    $('#get-code').zclip({
        path:'js/ZeroClipboard.swf',
        copy: function(){

            // parse tpl
            var pageCode = buildCode();

            pageCode = pageCode.replace(/0.51688/g,'0');

            $('#copyed-tip').fadeIn(500);

            setTimeout(function(){
                $('#copyed-tip').fadeOut(500);
            },5000);

            return pageCode;
        }
    });

    // [init]
    var canvas = new fabric.Canvas('canvas');
    var info = {};
    var tpl = '';
    getTpl();


})()