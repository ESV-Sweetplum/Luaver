---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputFloat` element.
---@param label string
---@param value number
---@return number
function InputFloat(label, value)
  value = state.GetValue(label .. inputCounter)
  _, value = imgui.InputFloat(label, value)
  state.SetValue(inputCounter .. "int", value)
  inputCounter = inputCounter + 1
  return value
end
