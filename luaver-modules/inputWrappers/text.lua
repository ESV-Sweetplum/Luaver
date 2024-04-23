---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputText` element.
---@param label string
---@param value string
---@return string
function InputText(label, value)
  value = state.GetValue(label .. inputCounter)
  _, value = imgui.InputText(label, value, 4096)
  state.SetValue(inputCounter .. "int", value)
  inputCounter = inputCounter + 1
  return value
end
