<?php

if(isset($_GET['fichier'])){
$fichier=$_GET['fichier'];
}else{
echo "veuillez spécifier un fichier";
}

$resultat = "";

//On enregistre le contenu du fichier texte dans la variable $contenu:
$contenu = file ($fichier);

foreach ($contenu as $item) {

$verif = strip_tags($item);
if(!empty ( $verif) ){
$item = str_replace("\r", "", $item);
$item = str_replace("\n", "", $item);
$item = str_replace("</fra>", "=", $item);
$item = str_replace("</etr>", "\r\n", $item);
$item = strip_tags($item);

$resultat .= $item;
}
}

echo $resultat;

?>