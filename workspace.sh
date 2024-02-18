workspace="spread-grid"

code ./.vscode/spread-grid.code-workspace

tmux new-session -d -s "$workspace"
tmux set-option -t "$workspace" -g mouse on

tmux new-window -t "$workspace:1" -n "console"

tmux new-window -t "$workspace:2" -n "kill"
tmux send-keys -t "$workspace:2" "tmux kill-session -t $workspace"

tmux new-window -t "$workspace:3" -n "example"
tmux split-window -h -t "$workspace:3"
tmux send-keys -t "$workspace:3.0" "cd example" C-m "npm start" C-m
tmux send-keys -t "$workspace:3.1" "cd example" C-m "npm run watch-src" C-m

tmux select-window -t "$workspace:3"
tmux attach-session -t "$workspace"