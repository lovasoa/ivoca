<?php
/*
Liste des ressources de Ivoca, pour une utilisation hors ligne
*/

$resources = Array("index.php",
		"interro.html",
		"linux-libertine.otf",
		"style.css",
		"space.jpg",
		"hebrophir.js",
		"ivoca.js",
		"space.jpg",
		"jquery.min.js");

// Add the correct Content-Type for the cache manifest
header('Content-Type: text/cache-manifest');

//On ne met jamais le manifeste lui-même en cache
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date dans le passé

// Write the first line
echo "CACHE MANIFEST\n";

$dir = 'vocabulaire';

$lastUpdate = 0;

function nouveauFichier ($fichier) {
	global $lastUpdate;
	echo str_replace(' ', '%20', $fichier) . "\n";
	$update = filemtime($fichier);
	echo "#update : ".date('l jS \of F Y h:i:s A',$update)."\n";
	if ($update>$lastUpdate) $lastUpdate=$update;
}

//Ajout des resources définies manuellement plus haut au manifest
array_walk($resources, 'nouveauFichier');

// Affiche la date de mise à jour
echo "\n# Last update: " . date('l jS \of F Y h:i:s A',$lastUpdate) . "\n";
?>

NETWORK:
*
