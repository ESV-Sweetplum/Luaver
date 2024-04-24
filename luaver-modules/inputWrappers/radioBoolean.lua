function RadioBoolean(falseLabel, trueLabel, value)
  if imgui.RadioButton(falseLabel, not value) then value = false end
  imgui.SameLine()
  if imgui.RadioButton(trueLabel, value) then value = true end

  return value
end
