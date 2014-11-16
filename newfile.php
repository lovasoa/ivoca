<?php
if ($_POST["password"] !== "kangourou") die("Mot de passe incorrect");

$filename = $_POST['filename'];
$xml = $_POST['xml'];

if (get_magic_quotes_gpc()) {
    $xml = stripslashes($xml);
    $filename = stripslashes($filename);
}

if (strpos($filename, "/") !== False){
    die("Erreur: le nom de la liste ne doit pas contenir le caractère '/' (slash).");
}

//On parse le xml pour vérifier si il est valide
try {
    $xmlObj = new SimpleXMLElement($xml);
    $xml = $xmlObj->asXML();
} catch (Exception $e) {
    echo 'Document xml invalide : ' . $e->getMessage();
}

$path = "vocabulaire/".$filename.".xml";
if (@file_put_contents($path, $xml)){
	echo "Fichier enregistré";
	//Modifie la date de dernier accès de index.php, pour que le cache du client soit mis à jour
	touch("./index.php");
}else {
    echo "Erreur: impossible d'enregistrer le fichier";
}
?>
