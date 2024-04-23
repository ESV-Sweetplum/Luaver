---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputInt` element.
---@param label string
---@param value integer
---@return integer
function InputInt(label, value)
    value = state.GetValue(label .. inputCounter) or value
    _, value = imgui.InputInt(label, value)
    state.SetValue(label .. inputCounter, value)
    inputCounter = inputCounter + 1
    return value
end
