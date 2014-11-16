<?php
//Inclusion de la bibliotheque
include('libTxtXml.php');

$dossier="vocabulaire";
echo "Placement dans le répertoire $dossier ...  ";
chdir($dossier);
echo "[Fait]<br />";


//On fait la liste de tous le fichiers texte
echo "Listage des fichiers texte...";
$fichiers = glob("*.txt");
echo "[Fait]<br />";

foreach ($fichiers as $fichierTxt) {
echo "<br />";

echo"Ouverture de $fichierTxt ... ";
//On ouvre le fichier .txt a lire:
$pointeurTxt = fopen ($fichierTxt,'r');
echo "[Fait]<br />";


//On ouvre le fichier .xml dans lequel on va ecrire:
$fichierXml = str_replace("txt", "voca", $fichierTxt);

if(file_exists($fichierXml)){
echo "Suppression de l'ancienne version de ".$fichierXml."<br />";
unlink($fichierXml);
}

echo"Ouverture de $fichierXml ... ";
$pointeurXml = fopen ($fichierXml,'a');
echo "[Fait]<br />";


echo"Démarrage de la conversion ... ";

//On fait la conversion grace au fichier bibliotheque libTxtXml
$xml = txt2xml($fichierTxt);

echo "[Terminé]<br />";


fputs($pointeurXml, $xml);

echo "Fermeture de $fichierXml et de $fichierTxt...  ";
//Puis on ferme les deux fichier
fclose ($pointeurTxt);
fclose ($pointeurXml);
echo "[Fait]<br /><br />";

}
?>

