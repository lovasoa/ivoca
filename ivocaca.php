<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">

<head>
<meta charset="utf8" />
<title>Ivocaca | Choix du fichier de revision</title>
<link rel="stylesheet" media="screen" type="text/css" title="Design" href="styleCaca.css" />
<meta name="keywords" content="beta, test, Amorphose, Ululo, Henri IV, informatique, reviser, apprendre, Ivoca, etranger, vocabulaire, gadgets" />
<meta name="description" content="Ivoca: choix du fichier de vocabulaire a reviser" />
</head>

<body>
Bienvenue sur <b>Ivocaca</b>, l'espace de r&eacute;visions de vocabulaire g&eacute;r&eacute; par vous-m&ecirc;me.
<br />
<br />

<div id="resultat" style="text-align:left;">

<p style="font-size:15px;">Choisissez la liste de vocabulaire que vous d&eacute;sirez r&eacute;viser:</p>
<ul>

<?php



function myglob( $patt, $drp=0 ) { //copié-collé internet : http://schplurtz.free.fr/wiki/dokuwiki/php-chez-free
        $dir=dirname( $patt );
        $pat=basename( $patt );
        $md=($drp & GLOB_MARK)==GLOB_MARK;
        $reponse=array();
        if (is_dir($dir) && ($d = @opendir($dir))) {
                $gl = array( ',/,', '/\./', '/\*/', '/\?/', '/^/', '/$/', ',/\.\*,', ',^/\^\.\*,'  );
                $re = array( '\\/', '\.',   '.*',   '.',    '/^',  '\$/', '/[^.].*',  '/^[^.].*' );
                $newpat=preg_replace( $gl, $re, $pat );
                        while (($filename = @readdir($d)) !== false) {
                                if( $filename == '.' || $filename == '..' )
                                        continue;
                                if( preg_match( $newpat, $filename )) {
                                        $reponse[]= $dir . '/' . $filename . (($md && is_dir($dir.'/'.$filename)) ? '/' : '');
                                }
                }
        }
        if(($drp & GLOB_NOCHECK)&&count($reponse)==0)
                return array($patt);
        if($drp & GLOB_NOSORT)
                return $reponse;
        sort( $reponse );
        return $reponse;
}


$dossier="vocabulaire";
$fichiers = myglob("$dossier/*.xml");


foreach ($fichiers as $fichier) {
$nomFichier = basename($fichier, ".txt.xml");
$nomFichier = str_replace('ec_', '', $nomFichier);
$nomFichier = str_replace('pg_', '', $nomFichier);

$nomFichier = str_replace('_', ' ', $nomFichier);

    echo '<li><a href="ivocaca.html#'.$fichier.'">'.$nomFichier.'</a></li>';
}
?>
</ul>
</div>
</body>
</html>
