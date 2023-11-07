
module DashJsGrid
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/dashjsgrid.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_js_grid",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "dash_js_grid.min.js",
    external_url = "https://unpkg.com/dash_js_grid@0.0.1/dash_js_grid/dash_js_grid.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_js_grid.min.js.map",
    external_url = "https://unpkg.com/dash_js_grid@0.0.1/dash_js_grid/dash_js_grid.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
