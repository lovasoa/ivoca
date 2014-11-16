#!/usr/bin/python
#coding: utf8

f = open("/dev/stdin")

try:
	etranger = f.readline().split(":")[1].strip()
except:
	etranger = ""
	f.seek(0)

print """<?xml version="1.0" ?>
<vocabulaire l1='%s' l2='%s' >"""%(etranger, "français")

for ligne in f:
	print '<mot l1="%s" l2="%s" />' % tuple(mot.strip().replace('"', "'") for mot in ligne.split("="))

print "</vocabulaire>"
