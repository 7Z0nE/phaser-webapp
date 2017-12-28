#!/bin/bash
path=$1
while true; do
	if [ -z "$(ls -A "queue")" ]; then
		echo "affe"
	else
		currentToken=$(ls -t queue | head -1)
		currentConfig=queue/$(currentToken)/config
		currentData=data.wav
		./scripts/phase queue/$currentToken/$currentData finished/$currentToken$currentData 120 4 32 0.8
		rm -r -f $pathqueue/$currentToken
	fi
done
