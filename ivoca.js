/*
Ivoca, par Ophir LOJKINE
*/

//On n'éxécute rien tant que la page n'est pas chargée
$(document).ready(function(){

//Cette variable sert à savoir si l'utilisateur s'est trompé ou a affiché la correction pour le mot actuel
var bonDuPremierCoup = true;

//Ceci est la fonction qui permet de choisir un mot et de l'afficher:
function nouveauMot() {

	//On commence par tout remettre à zéro
	reinitialiser();

	//On choisi notre mot de façon à avoir plus de chances de tirer un mot du début de la liste
	for (var i=0; ; i++){
		if (Math.random() < 0.4){
			numChoisi = i % voca.mots.length; //numChoisi: variable globale
			break;
		}
	}
	var elementActuel = voca.mots[numChoisi];

	//On va choisir si on pose la question en français ou dans la langue étrangère (l1 ou l2):

	//On choisi la langue du mot que l'on va demander de traduire
	var nbr = Configuration.getLangueOrig() || Math.round(Math.random()) + 1;

    //1. le mot à traduire
    $("#question").text(elementActuel["l"+nbr]);

	var nbr2 = nbr % 2 + 1; // 1 si nbr était 2 et 2 si nbr était 1
	$("#reponse").text(elementActuel["l" + nbr2]);	//2. la reponse (mais elle est dans une div invisible)
    
	var traduireEn = voca.langues[nbr2-1]//nbr2 vaut 1 ou 2, et les index des tableaux commencent à 0
	if (traduireEn){
		$("#langue").text("en "+traduireEn);		//3. l'instruction (la langue dans laquelle on doit traduire)
	}

        $("#texte").attr("data-anylang-to",   voca.langues[nbr2-1]);

	bonDuPremierCoup = true; //On commence un nouveau mot, l'utilisateur ne s'est pas encore trompé
}
$("#reponse").click(nouveauMot);//Quand l'utilisateur clique sur la correction, on change de mot

//Ceci est la fonction qui remet le formulaire à zéro:
function reinitialiser(){
	//La question redevient blanche (elle était peut-être verte si l'utilisateur avait donné une bonne réponse, ou rouge...)
	$('#question').css("color", "white");

	//La réponse devient invisible...
	$("#correction").hide(100);
	
	//... et le bouton doit donc proposer d'afficher la réponse, et non de la cacher.
	$("#bouton").text("Afficher la réponse");

	//L'affichage du pourcentage de bonnes réponses est mis à jour
	pourcentage();

    //Le champ de texte pour saisir sa réponse se vide, et obtient le focus.
	//On enlève la méthode de saisie d'alphabet étranger (qu'elle soit là ou pas)
	$("#texte").val("").focus();

        //On enlève le texte translitéré
        $("#anylang-trans").html("");
}

//Ceci est la fonction de mise à jour du pourcentage de bonnes réponses:
function pourcentage(){
	
	//On regarde combien de questions ont été posées jusqu'à présent.
	var total = voca.nbrQuestions;
	
	//Si aucune question n'a encore été posée, alors il est inutile de continuer
	if (total != 0){
		//On regarde combien de bonnes réponses ont été données
		var correct = voca.points;
	
		//On calcule le pourcentage à partir de ses informations. (Si tu veux le changer en note sur 20, c'est ici)
		var pourcent = Math.round(correct / total * 100);
		
		//On affiche le pourcentage
		$("#pourcentage").text(pourcent);
		return pourcent;
	}
	return 0;
}

//Ceci est la fonction principale du script: elle va chercher le fichier de vocabulaire et en extrait les mots et leurs traduction
function telecharger(){
	// On crée une variable locale, qu'on initialise à false.
	var requete = false;

	$("#question").text("Téléchargement du vocabulaire...");
	$("#reponse").text("Téléchargement du vocabulaire...");


	//Let the variable fichier be equal to everything that était after le question mark, dans l'url
	 fichier = document.location.hash.substring(1); //Variable globale
	 //On cherche l'extension du fichier. C'est un peu inutile, puisque l'utilisateur était sensé avoir utilisé mon sélecteur de vocabulaire, mais bon...

	 //Si le fichier n'est pas nul (si il y avait quelquechose après le # dans l'url)
	 if(fichier){
	        var storedVoca;
	        if (window.localStorage){
	            storedVoca = JSON.parse(localStorage.getItem(fichier));
	        }
	 		$.ajax(fichier, {
	 		    "dataType" : "xml",
	 		    "error" : function(xhr, status, err) {
                    if (storedVoca) {
                        //On n'a pas accès au réseau, mais heureusement, le fichier était stocké en local
                        voca = storedVoca;
                    } else {
	     		        var retry = confirm("Impossible de télécharger le vocabulaire ("
	     		                +status+": "+err
	     		                +")\n"
	     		                +"De plus, le fichier n'est pas stocké sur cet appareil."
	     		                +"Réessayer ?");
	     		        if (retry) telecharger();
	     		        else window.location="./index.php";
	     		    }
	 		    },
	 		    "success" : function(data, textStatus, jqXHR ) {
	 		        var newVoca = parseXMLVoca(data);

	 		        if (storedVoca) {
	 		            if (storedVoca.mots.length === newVoca.mots.length){
	 		                //La liste n'a pas changé. On continue à utiliser l'ancienne
	 		                voca = storedVoca;
	 		            } else {
	 		                //Le nombre de mots dans la liste a changé
	 		                var usenew = confirm("Une nouvelle version de la liste de vocabulaire est disponible."
	 		                    +"Voulez-vous l'utiliser? (vous perdrez votre avancement actuel)");
	 		                if (usenew) voca = newVoca;
	 		                else voca = storedVoca
	 		            }
	 		        } else voca = newVoca;

	 		 		//On initialise la liste de mots
		     		vocaModif();
				    //Et on affiche un mot grâce à la fonction adhoc
				    nouveauMot();
	 		    },
	 		    "complete" : function() {
	 		        //Exécuté que la requête ait réussi ou non
	 		        synchroniserInterface();
	 		    }
	 		    
	 		});
	 }else{
	 	//sinon on avertit l'utilisateur puis on le redirige
		 alert("Aucun fichier de vocabulaire valide spécifié");
		 window.location="./index.php";
	 }
}
telecharger(); //On lance le téléchargement au chargement de la page


function array_shuffle (inputArray){
//Retourne un array contenant les mêmes éléments que arr, dans un ordre aléatoire
    //Copie le tableau (ou pseudo-tableau) reçu en paramètre, pour ne pas le modifier
    var arr = Array.prototype.slice.call(inputArray),
        i=arr.length-1, j, tmp;
    do {
        j = Math.floor( Math.random() * (i+1) );
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    } while(i--);
    return arr;
}


function synchroniserInterface () {
	//Affiche le nombre total de mots dans la liste
	$("#nbrMotsTotal").text(voca.mots.length);
	$("#points").text(voca.points);
	//Si l'utilisateur connaît sa liste de vocabulaire, on lui fait remarquer discrètement
	if (voca.points > voca.mots.length && pourcentage()>=90){
	    $("#nbrMotsTotal").css('color', '#0F0');
	}
	//On met à jour le nombre total de questions posées
	$('#nbrMots').text(voca.nbrQuestions);
}

function vocaModif() {
//Fonction à exécuter lorsque l'objet voca est modifié
    synchroniserInterface();
    if (window.localStorage){
        window.localStorage.setItem(fichier, JSON.stringify(voca));
    }
}

//Fonction de création de la liste de vocabulaire à partir du fichier XML
function parseXMLVoca (xml) {
    var motsxml = xml.getElementsByTagName("mot");
    var mots = new Array(motsxml.length);
    for (var i=0; i<motsxml.length; i++){
        mots[i] = {
            "l1" : motsxml[i].getAttribute("l1"),
            "l2" : motsxml[i].getAttribute("l2")
        };
    }

    var vocaxml = xml.documentElement;
    var langues = [vocaxml.getAttribute("l1"), vocaxml.getAttribute("l2")];
	
	return {
	    "mots" : array_shuffle(mots),
	    "langues" : langues,
	    "nbrQuestions" : 0, //Le nombre total de questions posées à l'utilisateur
	    "points" : 0 //Le nombre de réponses justes
	}
}


//Cette fonction est appellée pour afficher la réponse, mais aussi pour la cacher, comme son nom ne l'indique pas
function afficherReponse (){

    //Cache ou affiche la correction, selon son état actuel
	$("#correction").toggle(100);
	//Affiche le texte correspondant dans le bouton
	$("#bouton").text(($("#correction").is(":visible") ? "Cacher" : "Afficher") + " la réponse");
	//Et on repositionne le mec sur son champ de texte
	$("#texte").focus();
	
	//L'utilisateur vient de tricher. Donc même si il fait bon, on ne compte pas comme bonDuPremierCoup
	bonDuPremierCoup = false;
}
$("#afficherReponse").click(afficherReponse);
	
//Ceci est la vonction appelée quand l'utilisateur appuie sur entrée
function valider(){
	
	//On incrémente le nombre de questions posées
	voca.nbrQuestions++;

	//On stocke la réponse de l'utilisateur dans Freponse (F comme faux)
	var Freponse = $("#texte").attr("data-anylang-equiv");
	//Et on va chercher la bonne réponse dans la div de réponse.
	var Vreponse = 	$("#reponse").text().split("/");
	/*Le split() sert à séparer les différentes réponses possibles
	Par exemple si la réponse est "prout/pet" l'utilisateur doit répondre "prout" OU "pet".
	La variable Vreponse est donc un array qui contient autant d'éléments que de réponses possibles
	*/

	//On parcour l'array Vreponse
	for(i=0; i<Vreponse.length; i++){
		//Et pour chaque solution possible, on la compare à la réponse donnée par l'utilisateur.
		//La fonction simplifier sert à donner une certaine tolérence au script.
		//Par exemple, si la réponse est "marchen (er marchet, er marchete, er hat gemarchet)", on tolère " marchen, marchet, marchete  ,hat gemarchet".
		if( simplifier(Freponse) == simplifier(Vreponse[i])){
			//Réorganisation de la liste
			if (bonDuPremierCoup) motALaFin();
			else motAuDebut();
			voca.points++;
			//On colore la question en vert
			$('#question').css("color","#0F0");
			//On attend 0,3 secondes, et on met un nouveau mot
			setTimeout(nouveauMot, 300);
			//On sort de la condition, de la boucle, de la fonction... On sort, quoi.
			vocaModif();
			return false;
		}
	}
	//On a parcouru toutes les réponses possibles et on n'en a trouvé aucune de juste
	//Donc l'utilisateur a eu faux:
    //On le traite de con
    /*fonctionnalité non encore implémentée*/
    //Il n'a donc pas eu bon du premier coup
    bonDuPremierCoup = false;
    //On met la question en rouge
    $('#question').css("color", "red");
    vocaModif();
    //Et on remet tout à zéro
    setTimeout(reinitialiser, 500);
}

$("#formulaire").submit(function(evt){
    valider();
    //On empêche le formulaire de faire recharger la page
    evt.preventDefault();
    return false;
});
$(document).keypress(function(evt){
    //Valider la réponse quand l'utilisateur appuie sur entrée
    //Même si il n'est pas dans le formulaire
    switch(evt.which) {
        case 13:
            valider();
            evt.preventDefault();
            return false;
        default:
            break;
    }
});

$("#formulaire").click(function(evt){
//On peut valider en cliquant sur la zone de réponse 
//mais pas sur le champ de texte lui-même
    if (!$(evt.target).is("input")) valider();
});

$("#recommencer").click(function(){
    //Commence une nouvelle partie, en supprimant l'avancement actuel
    if (window.localStorage){
        localStorage.removeItem(fichier);
    }
    window.location.reload();
})

//Cette fonction met le mot actuel au début de la liste
function motALaFin (){
	var elementActuel = voca.mots.splice(numChoisi, 1)[0];
	voca.mots.push(elementActuel);
}
//Cette fonction met le mot actuel à la fin de la liste
function motAuDebut (){
	var elementActuel = voca.mots.splice(numChoisi, 1)[0];
	voca.mots.unshift(elementActuel);
}

function simplifier(verbe){
  var peuImporte = [ /,/g, / /g, /\+/g, /\(/g, /\)/g, //Ignorer certains caractères non alphanumériques
                        new RegExp('ְ','g'), //Ignorer les e en hébreu
                        /\[[^\]]+\]/g //Ni ce qui est entre crochets
                    ];
    var remplacements = [
        {from:/ß/g, to:"ss"},
        {from:/è/g, to:"e"},
        {from:/é/g, to:"e"},
    ];
  for (var i = peuImporte.length-1; i>=0; i--){
      verbe = verbe.replace(peuImporte[i],"");
  }
  for (var i = remplacements.length-1; i>=0; i--){
      verbe = verbe.replace(remplacements[i].from,remplacements[i].to);
  }
	return verbe;
}

});//Fin du $(document).ready


Configuration = {
    getLangueOrig : function getLangueOrig() {
        return this.langueOrig;
    }
}

window.onload = function () {
    //Va en haut de la page (cache la barre d'adresse sur mobile)
    window.scrollTo(0, 1);
}
