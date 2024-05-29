---Returns two state managed `imgui.RadioButton` elements.
---@param falseLabel string
---@param trueLabel string
---@param value boolean
---@return boolean
function RadioBoolean(falseLabel, trueLabel, value)
    if imgui.RadioButton(falseLabel, not value) then value = false end
    imgui.SameLine()
    if imgui.RadioButton(trueLabel, value) then value = true end
    return value
end

---Returns `#labels` state managed `imgui.RadioButton` elements. Highlight one by passing the array index as the value (indexed from 1). `sz` determines the number of elements that can fit on one row before creating a new row.
---@param labels string[]
---@param value integer
---@param sz? integer
---@return integer
function RadioMatrix(labels, value, sz)
    sz = sz or 1e69
    for i, v in ipairs(labels) do
        if imgui.RadioButton(v, value == i) then value = i end
        if (i % sz ~= 0) then imgui.SameLine() end
    end
    return value
end
