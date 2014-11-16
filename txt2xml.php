<?php
require_once("libTxtVoca.php");
header("Content-type: text/XML");
echo txt2xml($_GET["file"]);