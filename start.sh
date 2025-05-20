#!/bin/sh

tmux kill-session -t start
set -e

tmux new-session -d -s start
tmux split-window -t start -h
tmux select-pane -t 0
tmux split-window -t start -v
tmux select-pane -t 2
tmux split-window -t start -v

tmux select-pane -t 0
tmux send 'cd middleware/SSR-master-server-main' ENTER
tmux send 'node app.js 3000' ENTER

tmux select-pane -t 1
tmux send 'cd middleware/SSR-master-server-main' ENTER
tmux send 'node app.js 3001' ENTER

tmux select-pane -t 2
tmux send 'cd middleware-bbdd/SSR-master-server-main' ENTER
tmux send 'node app.js' ENTER

tmux select-pane -t 3
tmux send 'cd servicio' ENTER
tmux send 'node app.js 4000' ENTER

systemctl restart haproxy mosquitto

curl http://10.100.0.119:5000/ >/dev/null
curl http://10.100.0.119:5000/ >/dev/null

tmux attach-session -t start

tmux kill-session -t start
