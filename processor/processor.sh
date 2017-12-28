#!/bin/bash
path=$1
while true; do
	if [ -z "$(ls -A "$path/queue")" ]; then
		echo "affe"
	else
		currentToken=$(ls -t $path/queue | head -1)
		currentConfig=$path/queue/$(currentToken)/config
		currentData=data.wav
		./scripts/phase $path/queue/$currentToken/$currentData $path/finished/$currentToken$currentData 120 4 32 0.8
		rm -r -f $path/queue/$currentToken
	fi
done
