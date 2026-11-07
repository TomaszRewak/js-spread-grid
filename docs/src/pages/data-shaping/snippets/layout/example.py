from dash_spread_grid import DashSpreadGrid

# collapse: false
grid = DashSpreadGrid(
    id='grid',
    data=data,
    columns=[{'type': 'HEADER'}, {'type': 'DATA-BLOCK'}],
    rows=[{'type': 'HEADER'}, {'type': 'DATA-BLOCK'}],
    hidden_columns=['team', 'registered'],
    hidden_rows=['Alice'],
    enable_layout_management_context_menu=True,
)