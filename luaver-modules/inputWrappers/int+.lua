---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputInt` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value integer
---@param readOnly? boolean
---@return integer
function InputInt(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputInt(label, value, 0, 0)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputInt(label, value)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputInt2` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value integer[]
---@param readOnly? boolean
---@return integer[]
function InputInt2(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputInt2(label, value)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputInt2(label, value)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputInt3` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value integer[]
---@param readOnly? boolean
---@return integer[]
function InputInt3(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputInt3(label, value)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputInt3(label, value)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputInt4` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value integer[]
---@param readOnly? boolean
---@return integer[]
function InputInt4(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputInt4(label, value)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputInt4(label, value)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end
