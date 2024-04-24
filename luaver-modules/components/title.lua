---Creates a large `imgui.Text` element.
---@param text string | number
function Title(text)
    imgui.Dummy({ 0, 3 })
    imgui.Text(text)
    imgui.Dummy({ 0, 3 })
end
