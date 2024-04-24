---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputText` element.
---@param label string
---@param value string
---@return string
function InputText(label, value)
    _, value = imgui.InputText(label, value, 4096)
    return value
end
