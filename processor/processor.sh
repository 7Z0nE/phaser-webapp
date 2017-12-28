#!/bin/bash
while true; do
	if [ -z "$(ls -A "queue")" ]; then
		echo "affe"
	else
		currentToken=$(ls -t queue | head -1)
		echo $currentToken
		currentConfig=queue/$currentToken/config
		
		type=$(sed -n '1p' < $currentConfig)
		bpm=$(sed -n '2p' < $currentConfig)
		length=$(sed -n '3p' < $currentConfig)
		repetitions=$(sed -n '4p' < $currentConfig)
		factor=$(sed -n '5p' < $currentConfig)

		currentData=data.$type
		./scripts/phase queue/$currentToken/$currentData finished/$currentToken$currentData $bpm $length $repetitions $factor
		rm -r -f queue/$currentToken
	fi
done
