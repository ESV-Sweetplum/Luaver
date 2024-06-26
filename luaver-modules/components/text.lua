---Creates an `imgui.Text` element. If multiple parameters are given, they are combined and separated with a space.
---@param ... string | number | boolean
function Text(...)
    local tbl = {}

    for _, v in pairs({ ... }) do table.insert(tbl, tostring(v)) end

    imgui.Text(table.concat(tbl, " "))
end
