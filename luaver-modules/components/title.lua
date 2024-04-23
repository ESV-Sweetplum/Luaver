---Creates a large `imgui.Text` element.
---@param text string | number
function Title(text)
    imgui.Dummy({ 0, 5 })
    imgui.Text(text)
    imgui.Dummy({ 0, 5 })
end
