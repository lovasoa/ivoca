hebrophir = {
 table : [
  { from: /''/g, to: '״' },
  { from: / y/g, to: ' י' },
  { from: /ou/g, to: 'וּ' },
  { from: /â/g, to: 'ָ' },
  { from: /ee/g, to: 'ֶ' },
  { from: /kh$/g, to: 'ך' },
  { from: /Kh|kh(?=[ .$])/g, to: 'ך' },
  { from: /kh/g, to: 'כ' },
  { from: /ch/g, to: 'ח' },
  { from: /ts$/g, to: 'ץ' },
  { from: /Ts|ts(?=[ .])/g, to: 'ץ' },
  { from: /ts/g, to: 'צ' },
  { from: /sh/g, to: 'שׁ' },
  { from: /s/g, to: 'שׂ' },
  { from: /a/g, to: 'ַ' },
  { from: /é/g, to: 'ֵ' },
  { from: /o/g, to: 'ֹ' },
  { from: /è/g, to: 'ֶ' },
  { from: /e/g, to: 'ְ' },
  { from: /i/g, to: 'ִ' },
  { from: /-/g, to: '־'},
  { from: /ô/g, to: 'וֹ' },
  { from: /u/g, to: 'ֻ' },
  { from: /p/g, to: 'פּ' },
  { from: /P/g, to: 'ף' },
  { from: /b/g, to: 'בּ' },
  { from: /</g, to: 'ּ' },
  { from: /â/g, to: 'א' },
  { from: /'/g, to: 'א' },
  { from: /v/g, to: 'ב' },
  { from: /g/g, to: 'ג' },
  { from: /d/g, to: 'ד' },
  { from: /h/g, to: 'ה' },
  { from: /w/g, to: 'ו' },
  { from: /z/g, to: 'ז' },
  { from: /y/g, to: 'ִי' },
  { from: /k/g, to: 'כּ' },
  { from: /l/g, to: 'ל' },
  { from: /m$/g, to: 'ם' },
  { from: /M|m(?=[ .])/g, to: 'ם' },
  { from: /m/g, to: 'מ' },
  { from: /n$/g, to: 'ן' },
  { from: /N|n(?=[ .])/g, to: 'ן' },
  { from: /n/g, to: 'נ' },
  { from: /ç/g, to: 'ס' },
  { from: /_/g, to: 'ע' },
  { from: /f$/g, to: 'ף' },
  { from: /F|f(?=[ .])/g, to: 'ף' },
  { from: /f/g, to: 'פ' },
  { from: /q/g, to: 'ק' },
  { from: /r/g, to: 'ר' },
  { from: /T/g, to: 'ט' },
  { from: /t/g, to: 'ת' },
  { from: /\|/g, to: '' }, //Separator to prevent to consecutive letters from being merged
  ],

 equiv : function(txt){
    for (var j=0; j<this.table.length; j++) {
        var repl = this.table[j];
        txt = txt.replace(repl.from, repl.to);
    }
    return txt;
 },
 
    autoTransliterate : function ($els) {
        $els.each(function(){
            var $el = $(this);
            var hebrText = hebrophir.equiv($el.val());
            var $hebr = $("<span dir='rtl'>")
                            .attr("id", $el.attr("id"))
                            .val(hebrText)
                            .text(hebrText)
                            .addClass("hebrophir");

            var el = $el.get(0), hebr = $hebr.get(0);
            $el.attr("id",'') //It's now the span that has the id
                .addClass("hebr-trans")
                .after($hebr)
                .data("originallang", hebrText)
                .on("change blur keyup mouseup", function(){
                    hebr.value = hebr.innerHTML = hebrophir.equiv(el.value);
                    el.setAttribute("data-originallang", hebr.value);
                });
        });
        return $els;
    },
 
    disableAutoTrans : function ($els) {
    //Can be called either on the hebrew text or on the transliteration
        $els.parent().find(".hebr-trans").each(function(){
            var $trans = $(this);
            var $hebr = $trans.siblings(".hebrophir");
            $trans.removeClass("hebr-trans")
                    .off() //remove event handlers
                    .attr("id", $hebr.attr("id"))
                    .data("originallang","");
            $hebr.remove();
        });
        return $els;
    }
}
