<!DOCTYPE html>

<html manifest="manifest.php">

<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Ivoca | Choix du fichier de revision</title>
<link rel="stylesheet" media="screen" type="text/css" title="Design" href="style.css" />
<meta name="keywords" content="beta, test, Amorphose, Ululo, Henri IV, informatique, reviser, apprendre, Ivoca, etranger, vocabulaire, gadgets" />
<meta name="description" content="Ivoca: choix du fichier de vocabulaire a reviser" />
<style type="text/css">
a{color:#900530;}
.edit {
    font-size:0.5em;
    font-style:italic;
    text-decoration:none;
}
</style>
</head>

<body>

<div id="resultat" style="text-align:left;">
<p>Bienvenue sur <b>Ivoca</b></p>
<p>Choisissez la liste de vocabulaire que vous d&eacute;sirez r&eacute;viser:</p>
<ul>

<?php
$dossier="vocabulaire";

$html_els = Array();
$dates = Array();

if ($handle = opendir($dossier)) {
    /* Ceci est la façon correcte de traverser un dossier. */
    while (false !== ($fichier = readdir($handle))) {
        $nomListe = basename($fichier, ".xml");
        if ($fichier === $nomListe.".xml"){
                $date=filemtime($dossier.'/'.$fichier);
                array_push($dates, $date);
                array_push($html_els, '<li><a href="interro.html#'
                        .$dossier.'/'.rawurlencode($fichier)
                        .'" title="Dernière modification le '.date("j M Y à H:i:s",$date).'" >'
                        .$nomListe
                        .'</a>&nbsp;'
                        .'<a class="edit" href="edivoca.html#'.rawurlencode($nomListe).'">[modifier]</a>'
                        .'</li>');
        }
    }
    closedir($handle);

    array_multisort($dates, SORT_DESC, SORT_NUMERIC, $html_els); //Trie les fichiers du plus vieux au plus récent;
    foreach($html_els as $html) echo $html;
}
?>
</ul>
<a class="edit" href="edivoca.html">Créer une nouvelle liste de vocabulaire</a>
</div>

<script src="../jQuery/jquery.min.js"></script>
<script>
var appCache = window.applicationCache;
if(!navigator.onLine)$(".edit").remove();
</script>
</body>
</html>
