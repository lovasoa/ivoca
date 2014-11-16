<?php
$site = "http://www.seconde2.lautre.net/vocabulaire/";
echo "Lecture de $site ...  ";

$source = file_get_contents($site);
echo "[Fait]<br />";

echo "Recherche de fichiers de vocabulaire... ";
$tableau = explode ("liste.php?liste=", $source);
$longueur = count($tableau)-1;
echo "[Fait] (".$longueur." fichiers trouvés)<br />";


$liste = Array();
echo "Extraction des noms de fichier...";
foreach($tableau as $num => $element){
	if($num != 0){
		$adresse = explode ('"', $element);
		$liste[] = $adresse[0];
		
	}
}
echo "[Fait]<br />";

$dossier="vocabulaire";
echo "Placement dans le répertoire ".$dossier."...";
chdir($dossier);
echo "[Fait]<br />";


foreach($liste as $num => $fichier){
echo"Ouverture de ".$fichier."...  ";
$pointeur = fopen ($fichier,'a');
echo "[Fait]<br />";
echo "Copie de ".$site.$fichier."...  ";
fputs($pointeur, file_get_contents($site.$fichier));
echo "[Fait]<br />";
fclose($pointeur);
}
echo "--------------------------------<br />";
echo "Démarrage de la conversion des fichiers obtenus<br />";
echo "--------------------------------<br />";

include("conversion.php");
?>