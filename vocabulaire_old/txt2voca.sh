#!/bin/sh

for f in *txt
do
	echo $f
	exit
	sortie=$(echo "$f"|cut -d. -f1)".voca"
	echo "<?xml version='1.0' ?><vocabulaire langue='' >" >> "$sortie"
	cat "$f" | while read line:
	do
		if 
		echo "<mot>" >> "$sortie"

		echo "<etr>" >> "$sortie"
		echo $line | cut -d: -f1 >> "$sortie"
		echo "</etr>" >> "$sortie"

		echo "<fra>" >> "$sortie"
		echo $line | cut -d: -f2 >> "$sortie"
		echo "</fra>" >> "$sortie"

		echo "</mot>" >> "$sortie"
	done
	echo "</vocabulaire>" >> "$sortie"
done