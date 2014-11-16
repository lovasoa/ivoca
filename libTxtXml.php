<?php

//----------------------------------------------------
function ajouterMot($fra, $etr){
$motXML = "
<mot>
	<fra>".$fra."</fra>
	<etr>".$etr."</etr>
</mot>";
if ($lisible !== TRUE){
	$motXML=preg_replace('/\s+/', '', $motXML);
}
return $motXML;
}

//----------------------------------------------------

function ligneAnoeud($ligne){
$seps = array("=", ":"); //Tous les séparateurs possibles
foreach ( $seps as $sep ){
		if(strpos($ligne, $sep) !== FALSE){
			/*Si la ligne contient le caractère sep,
			on le choisit pour délimiter le mot étranger du mot français*/ 
			break;
		}
}

$item = explode($sep, $ligne, 2);

//On enlève les retours chariot et les antislashs de $fra et $etr
$etr = epurer ($item['0']);
$fra = epurer ($item['1']);

//On ne forme pas de XML si la ligne est vide
if (empty($etr) || empty($fra)){return "";}
	
//On ecrit le mot dans le fichier xml
return ajouterMot($fra, $etr);
}

//----------------------------------------------------

function epurer ($item){
//On enlève les retours chariot et les antislashs de $item
	return trim(stripslashes($item));
}

//----------------------------------------------------

function ligne1($ligne){
$items = explode(':',$ligne);
	if($items[0]=='langue'){
		return '<vocabulaire langue="'.epurer($items[1]).'" >'."\n";
	}else{
		return '<vocabulaire langue="" >'."\n".ligneAnoeud($ligne);
	}
}

//----------------------------------------------------

function txt2xml($fichierTxt){
//On enregistre le contenu du fichier texte dans la variable $contenu:
$contenu = file ($fichierTxt);

//On met l'entete xml
$xml = '<?xml version="1.0" ?>';


//Puis on fait une boucle sur chaque ligne du fichier source
foreach ($contenu as $clef => $ligne) {

//On s'occupe tout particulièrement de la première ligne:
	if($clef==0){
		$xml .= ligne1($ligne);
	}else{
		//On ecrit le mot dans le fichier xml
		$xml .= ligneAnoeud($ligne);
	}
}

$xml .= '</vocabulaire>';

return $xml;
}