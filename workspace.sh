workspace="spread-grid"

cd "$(dirname "$0")"

code ./.vscode/spread-grid.code-workspace

tmux new-session -d -s "$workspace"
tmux set-option -t "$workspace" -g mouse on

tmux new-window -t "$workspace:1" -n "console"

tmux new-window -t "$workspace:2" -n "kill"
tmux send-keys -t "$workspace:2" "tmux kill-session -t $workspace"

tmux new-window -t "$workspace:3" -n "js"
tmux split-window -h -t "$workspace:3"
tmux send-keys -t "$workspace:3.0" "cd js" C-m "npm run watch" C-m
tmux send-keys -t "$workspace:3.1" "cd js" C-m "npm run build"

tmux new-window -t "$workspace:4" -n "react"
tmux split-window -h -t "$workspace:4"
tmux send-keys -t "$workspace:4.0" "cd react" C-m "npm run watch" C-m
tmux send-keys -t "$workspace:4.1" "cd react" C-m "npm run build"

tmux new-window -t "$workspace:5" -n "example"
tmux split-window -h -t "$workspace:5"
tmux send-keys -t "$workspace:5.0" "cd example" C-m "PORT=3000 npm start" C-m
tmux send-keys -t "$workspace:5.1" "cd example" C-m "npm run watch-src" C-m

tmux new-window -t "$workspace:6" -n "docs"
tmux split-window -h -t "$workspace:6"
tmux send-keys -t "$workspace:6.0" "cd docs" C-m "PORT=3001 npm start" C-m
tmux send-keys -t "$workspace:6.1" "cd docs" C-m "npm run watch-src" C-m

tmux select-window -t "$workspace:3"
tmux attach-session -t "$workspace"