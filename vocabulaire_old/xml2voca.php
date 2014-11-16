<?php
$fichier = glob("*.xml");

foreach($fichier as $nomFichier){
$nouveauNomFichier = str_replace(".xml",".voca",$nomFichier);
rename($nomFichier, $nouveauNomFichier);
echo "Renommage de $nomFichier en $nouveauNomFichier ...<br />";
}
echo"Fini!";