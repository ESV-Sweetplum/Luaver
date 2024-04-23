---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputInt` element.
---@param label string
---@param value integer
---@return integer
function InputInt(label, value)
  value = state.GetValue(label .. inputCounter)
  _, value = imgui.InputInt(label, value)
  state.SetValue(inputCounter .. "int", value)
  inputCounter = inputCounter + 1
  return value
end
