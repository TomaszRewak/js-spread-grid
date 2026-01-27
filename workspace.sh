workspace="spread-grid"

cd "$(dirname "$0")"

code ./.vscode/spread-grid.code-workspace

tmux kill-session -t "$workspace"

tmux new-session -d -s "$workspace"
tmux set-option -t "$workspace" -g mouse on

tmux new-window -t "$workspace:1" -n "console"

tmux new-window -t "$workspace:2" -n "kill"
tmux send-keys -t "$workspace:2" "tmux kill-session -t $workspace"

tmux new-window -t "$workspace:3" -n "js"
tmux send-keys -t "$workspace:3" "cd lib" C-m

tmux new-window -t "$workspace:4" -n "react"
tmux send-keys -t "$workspace:4" "cd react" C-m

tmux new-window -t "$workspace:5" -n "example"
tmux send-keys -t "$workspace:5" "cd example" C-m "PORT=3000 npm start" C-m

tmux new-window -t "$workspace:6" -n "docs"
tmux send-keys -t "$workspace:6" "cd docs" C-m "PORT=3001 npm start" C-m

tmux new-window -t "$workspace:7" -n "dash"
tmux split-window -h -t "$workspace:7"
tmux send-keys -t "$workspace:7.0" "cd dash" C-m ". venv/bin/activate" C-m "while true; do python3 usage.py; sleep 1; done" C-m
tmux send-keys -t "$workspace:7.1" "cd dash" C-m "npm run watch" C-m

tmux new-window -t "$workspace:8" -n "tests"
tmux send-keys -t "$workspace:8" "cd tests" C-m "npm test -- --watchAll=false"

tmux new-window -t "$workspace:9" -n "validate"
tmux send-keys -t "$workspace:9" "cd lib" C-m "tsc -w -p jsconfig.json" C-m

tmux new-window -t "$workspace:10" -n "release"
tmux send-keys -t "$workspace:10" "./release.sh patch"

tmux select-window -t "$workspace:3"
tmux attach-session -t "$workspace"
