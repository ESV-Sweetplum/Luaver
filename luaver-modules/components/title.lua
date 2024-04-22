---Creates a large `imgui.Text` element.
---@param text string | number
function Title(text)
    imgui.SetWindowFontScale(1.5)
    imgui.Text(text)
    imgui.SetWindowFontScale(1)
end
