$(function(){
    var filename;
    var $l2 = $("#l2"),
        $l1 = $("#l1"),
        $lastCouple = $("#lastCouple"),
        $table = $("#main table");

    var langs = {
        langs : [],
        setLang : function(n, langName, updateTable){
            //if updateTable is true, the first row of the table will be changed to reflect the new lang name
            var oldLang = this.langs[n-1];
            if (oldLang === langName) return; //Nothing to do
            if (updateTable) $("#l"+n).val(langName);
            var $inputs = $table.find(".l"+n)
                            .not($lastCouple.find("input"))
                            .removeClass(oldLang)
                            .addClass(langName);
            $inputs.attr("data-anylang-to", langName);
            this.langs[n-1] = langName;
        },
        getLang : function (n) {
            return this.langs[n-1];
        }
    };

    function newLine(words) {
        //words[0] is the word in langueage l1, etc...
        if (!words)words=new Array(langs.langs.length);
        var $newLine = $lastCouple.clone().attr("id", "");

        for (var i=0; i<langs.langs.length; i++){
            var numLang = i+1;
            var lang = langs.getLang(numLang);
            var $input = $newLine.find(".l"+numLang)
                .val(words[i]||'')
                .addClass(lang);
            $input.attr("data-anylang-to", lang);
            Anylang.attach($input[0], $newLine.find("span.anylang-trans")[0]);
        }
        $newLine.find("input:first").focus();
        $lastCouple.before($newLine);
        return $newLine;
    }

    //Automatically duplicate the last row, so that there is always an empty row at the end of the table
    $lastCouple.find("input").focus(function(){
        $newLine = newLine();
        $this = $(this);
        var i=0; while(i<1e3 && !($this.hasClass("l"+(++i))));
        $newLine.find(".l"+i).focus();
    });


    $table.find("th input").on("change blur keyup mouseup", function(el){
        //The name of a lang was changed
        var $el = $(this);
        //id is l1 or l2. Extract the number in langNum
        var langNum = parseInt($el.attr("id").slice(1));
        langs.setLang(langNum, $el.val());
    });

    function loadFile(name) {
        filename = name;
        var file = "vocabulaire/"+name+".xml";
        jQuery.ajax({
         type: 'GET', // Le type de ma requete
          url: file, // L'url vers laquelle la requete sera envoyee 
          dataType : "xml",
          success: function(data, textStatus, jqXHR) {
                //We got the file
                $voc = $(data).find("vocabulaire");
                //Clear the table
                $(".couple").not($lastCouple).remove();
                var i=0, lng;
                while((lng = $voc.attr("l"+(++i))) !== undefined){//Only one = (affectation)
                    //Set the ith lang and update the table accordingly
                   langs.setLang(i, lng, true);
                }
                $voc.find("mot").each(function(){
                    var $this = $(this);
                    var words = [];
                    for (var i=langs.langs.length; i>0; i--){
                        var w = $this.attr("l"+i+"-trans") || $this.attr("l"+i);
                        if (!w) alert("Fichier de vocabulaire incorrect")
                        words.unshift(w);
                    }
                    newLine(words);
                });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // Une erreur s'est produite lors de la requete
            if (errorThrown == "Not Found"){
                alert("Aucune liste de vocabulaire nommée '"
                + decodeURIComponent(filename)
                + "' ne semble présente sur le serveur.\n\n"
                + "Création d'une nouvelle liste.");
            } else {
                alert("Erreur : "+ errorThrown);
            }
            console.log(jqXHR, textStatus, errorThrown);
          }
        });
    }
    if (window.location.hash) {
        var filename = decodeURIComponent(window.location.hash.slice(1));
        loadFile(filename); //Script was called with an argument
    }

    function toXML() {
        $xml = $("<xml><vocabulaire>");
        $voc = $xml.find("vocabulaire");
        for (var i=langs.langs.length; i>0; i--){
            $voc.attr("l"+i, langs.getLang(i))
        }
        $(".couple").each(function(){
            var $this = $(this);
            var $mot = $("<mot />");
            var numLangs = 0;
            for (var i=langs.langs.length; i>0; i--){
                var $input = $this.find(".l"+i);
                var val = $input.val();
                if (val) numLangs++;
                var originallang = $input.attr("data-anylang-equiv");
                $mot.attr("l"+i, originallang || val);
                if (originallang) $mot.attr("l"+i+"-trans", val);
            }
            if (numLangs === langs.langs.length) $voc.append($mot);
        });
        var xml = '<?xml version="1.0" encoding="UTF-8"?>' + $xml.html();
        console.log(xml);
        return xml;
    }
    function save () {
        if (!filename) filename=prompt("Nom de la liste de vocabulaire:");
        if (!filename) return; //User aborted
        jQuery.ajax({
            type: 'POST', // Le type de ma requete
            url: "newfile.php", // L'url vers laquelle la requete sera envoyee 
            data : {
                "password" : prompt("Mot de passe :"),
                "xml" : toXML(),
                "filename" : filename
            },
            success: function(data, textStatus, jqXHR) {
                alert(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Une erreur s'est produite lors de la requete
                alert("Erreur"+ errorThrown);
                console.log(errorThrown);
            }
        });
    }
    $("#save").click(save);
    $(window).keypress(function(event) {
        if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
        //L'utilisateur a appuyé sur Ctrl-s
        save();
        event.preventDefault();
        return false;
    });

    $("#open").click(function(){
        filename = prompt("Nom de la liste à ouvrir:");
        if (filename) loadFile(filename);
    })
});  
