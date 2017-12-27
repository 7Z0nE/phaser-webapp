#!/bin/bash
path=$1
while true; do
	if [ -z "$(ls -A "$path/queue")" ]; then
		echo "affe"
	else
		currentFile=$(ls -t $path/queue | head -1)
		./scripts/phase $path/queue/$currentFile $path/finished/$currentFile 120 4 32 0.8
		rm -f $path/queue/$currentFile
	fi
done
