FLOAT_FORMAT = "%.2f"

---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputFloat` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value number
---@param readOnly? boolean
---@return number
function InputFloat(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputFloat(label, value, 0, 0, FLOAT_FORMAT)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputFloat(label, value, 0, 0, FLOAT_FORMAT)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputFloat2` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value number[]
---@param readOnly? boolean
---@return number[]
function InputFloat2(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputFloat2(label, value, FLOAT_FORMAT)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputFloat2(label, value, FLOAT_FORMAT)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputFloat3` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value number[]
---@param readOnly? boolean
---@return number[]
function InputFloat3(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputFloat3(label, value, FLOAT_FORMAT)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputFloat3(label, value, FLOAT_FORMAT)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end

---Returns a state managed `imgui.InputFloat4` element. If `readOnly = true`, then the input will not be alterable.
---@param label string
---@param value number[]
---@param readOnly? boolean
---@return number[]
function InputFloat4(label, value, readOnly)
    if (readOnly) then
        _, value = imgui.InputFloat4(label, value, FLOAT_FORMAT)
    else
        value = state.GetValue(label .. inputCounter) or value
        _, value = imgui.InputFloat4(label, value, FLOAT_FORMAT)
        state.SetValue(label .. inputCounter, value)
        inputCounter = inputCounter + 1
    end
    return value
end
