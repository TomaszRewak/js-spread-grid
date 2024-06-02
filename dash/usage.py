import dash_spread_grid
from dash import Dash, callback, html, Input, Output, _dash_renderer
from time import time

_dash_renderer._set_react_version("18.2.0")


appData = {
    'fetcher-eu-001': {'tags': ['fetcher', 'eu', 'core'], 'startedAt': time() - 60_000_000, 'stoppedAt': None, 'isRequired': True},
    'fetcher-eu-002': {'tags': ['fetcher', 'eu', 'core'], 'startedAt': None, 'stoppedAt': time() - 60_000, 'isRequired': True},
    'fetcher-apac-001': {'tags': ['fetcher', 'apac', 'core'], 'startedAt': time() - 120_000, 'stoppedAt': None, 'isRequired': True},
    'fetcher-us-001': {'tags': ['fetcher', 'us', 'core'], 'startedAt': time() - 80_000, 'stoppedAt': None, 'isRequired': True},
    'logger-eu-001': {'tags': ['logger', 'eu', 'metrics'], 'startedAt': time() - 4_000, 'stoppedAt': None, 'isRequired': False},
    'logger-apac-001': {'tags': ['logger', 'apac', 'metrics'], 'startedAt': None, 'stoppedAt': time() - 60_000, 'isRequired': False},
    'logger-us-001': {'tags': ['logger', 'us', 'metrics'], 'startedAt': time() - 80_000, 'stoppedAt': None, 'isRequired': False},
    'consolidator-comp-001': {'tags': ['consolidator', 'global', 'core'], 'startedAt': time() - 2_000_000, 'stoppedAt': None, 'isRequired': True},
}    

app = Dash(__name__)
app.layout = html.Div([
    dash_spread_grid.DashSpreadGrid(
        id='grid',
        data=appData,
        columns=[
            {'id': 'status', 'header': '', 'width': 25, 'labels': ['not-filterable']},
            {'id': 'name', 'header': 'Name'},
            {'id': 'start', 'header': '', 'width': 30, 'labels': ['button', 'not-filterable']},
            {'id': 'restart', 'header': '', 'width': 30, 'labels': ['button', 'not-filterable']},
            {'id': 'stop', 'header': '', 'width': 30, 'labels': ['button', 'not-filterable']},
            {'id': 'startedAt', 'header': 'Started', 'labels': ['time']},
            {'id': 'stoppedAt', 'header': 'Stopped', 'labels': ['time']},
            {'id': 'isRequired', 'header': 'Required'},
            {'id': 'tags', 'header': 'Tags'}
        ],
        rows=[
            {'type': 'HEADER'},
            {'type': 'FILTER'},
            {'type': 'DATA-BLOCK'},
            {'type': 'CUSTOM', 'id': 'summary'}
        ],
        formatting=[
            {
                'column': {'id': 'status'},
                'value': 'data[row.id].stoppedAt ? "stopped" : data[row.id].startedAt ? "running" : "inactive"',
                'style': 'value === "running" ? {background: "#3d9943"} : value === "stopped" ? {background: "#ff5454"} : {background: "#ededed"}',
                'text': '""'
            },
            {
                'column': {'id': 'name'},
                'value': 'row.id'
            },
            {
                'row': {'id': 'summary'},
                'text': '""',
                'style': '{background: "#78c9ff", border: {width: 1, color: "#78c9ff"}}'
            },
            {
                'column': {'id': 'start'},
                'row': [{'type': 'DATA'}, {'id': 'summary'}],
                'text': '"▷"',
                'value': '!data[row.id] || !data[row.id].startedAt'
            },
            {
                'column': {'id': 'restart'},
                'row': [{'type': 'DATA'}, {'id': 'summary'}],
                'text': '"⟳"',
                'value': 'true'
            },
            {
                'column': {'id': 'stop'},
                'row': [{'type': 'DATA'}, {'id': 'summary'}],
                'text': '"▢"',
                'value': '!data[row.id] || data[row.id].startedAt'
            },
            {
                'column': {'label': 'button'},
                'row': [{'type': 'DATA'}],
                'style': '{textAlign: "center", background: "#f7e540", border: {width: 1, color: "#f7bd1e"}}'
            },
            {
                'column': {'label': 'button'},
                'row': [{'id': 'summary'}],
                'style': '{textAlign: "center", background: "#fcb830", border: {width: 1, color: "#c48c1b"}}'
            },
            {
                'column': {'label': 'button'},
                'row': [{'type': 'DATA'}, {'id': 'summary'}],
                'condition': '!value',
                'style': '{background: "#b4b4b4"}'
            },
            {
                'column': {'label': 'time'},
                'text': '''
                    (() => {
                        if (!value) return "";
                        const timeDiff = Date.now() - value;
                        let text = "";
                        if (timeDiff > 86_400_000_000)
                            text += `${Math.floor(timeDiff / 86_400_000_000)}d `;
                        if (timeDiff > 3_600_000)
                            text += `${Math.floor(timeDiff / 3_600_000 % 24).toString().padStart(2, "0")}h `;
                        if (timeDiff > 60_000)
                            text += `${Math.floor(timeDiff / 60_000 % 60).toString().padStart(2, "0")}m `;
                        text += `${Math.floor(timeDiff / 1000 % 60).toString().padStart(2, "0")}s`;
                        return text;
                    })()
                '''
            },
            {
                'column': {'id': 'startedAt'},
                'style': '''
                    (() => {
                        if (!value) return {};
                        const progress = Math.min(1, (Date.now() - value) / 120_000) * 0.5 + 0.5;
                        return {background: `rgb(255, ${255 * progress}, ${255 * progress})`};
                    })()
                '''
            },
            {
                'column': {'id': 'isRequired'},
                'text': 'value ? "✔" : "✘"',
                'style': 'value ? {textAlign: "center", foreground: "#3d9943"} : {textAlign: "center", foreground: "#ff5454"}'
            },
            {
                'column': {'id': 'isRequired'},
                'condition': 'value && !data[row.id].startedAt',
                'style': '{background: "#ffb3b3"}'
            },
            {
                'column': {'label': 'not-filterable'},
                'row': {'type': 'FILTER'},
                'edit': False,
                'text': '""'
            },
            {
                'row': {'id': 'summary'},
                'column': {'id': 'name'},
                'text': '`Total: ${rows.length - 3}`',
                'style': '{textAlign: "right"}'
            },
            {
                'column': {'id': 'tags'},
                'text': 'value.join(", ")',
            },
            {
                'column': {'id': 'name'},
                'row': {'type': 'FILTER'},
                'edit': {
                    'validate': '/^[a-z-0-9_]*$/i.test(string)',
                    'parse': '{regex: new RegExp([...string].join(".*"), "i"), source: string}'
                },
                'text': 'newValue?.source || "(eg. \\"fe-eu-1\\")"'
            },
            {
                'column': {'id': 'tags'},
                'row': {'type': 'FILTER'},
                'edit': {
                    'parse': 'new Set(string.split(",").map(tag => tag.trim()))'
                },
                'text': 'newValue ? [...newValue].join(", ") : "(eg. \\"fetcher, eu\\")"'
            }
        ],
        filtering=[
            {
                'column': {'id': 'name'},
                'condition': 'expression.regex.test(text)'
            },
            {
                'column': {'id': 'tags'},
                'condition': 'value.filter(tag => expression.has(tag)).length === expression.size'
            }
        ]
    ),
    html.Div(id='output')
])


# @callback(Output('output', 'children'), Input('grid', 'clicked_cell'))
# def display_output(clicked_cell):
#     print(clicked_cell)
#     return f'Cell clicked: {clicked_cell}'


@callback(Output('output', 'children'), Input('grid', 'active_rows'), Input('grid', 'active_columns'))
def display_active(active_rows, active_columns):
    print(active_rows, active_columns)
    return f'Active rows: {active_rows}, Active columns: {active_columns}'


if __name__ == '__main__':
    app.run_server(debug=True)
