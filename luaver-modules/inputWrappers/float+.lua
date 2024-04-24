FLOAT_FORMAT = "%.2f"

---@diagnostic disable: return-type-mismatch, cast-local-type
---Returns a state managed `imgui.InputFloat` element.
---@param label string
---@param value number
---@return number
function InputFloat(label, value)
    _, value = imgui.InputFloat(label, value, 0, 0, FLOAT_FORMAT)
    return value
end

---Returns a state managed `imgui.InputFloat2` element..
---@param label string
---@param value number[]
---@return number[]
function InputFloat2(label, value)
    _, value = imgui.InputFloat2(label, value)
    return value
end

---Returns a state managed `imgui.InputFloat3` element.
---@param label string
---@param value number[]
---@return number[]
function InputFloat3(label, value)
    _, value = imgui.InputFloat3(label, value)
    return value
end

---Returns a state managed `imgui.InputFloat4` element.
---@param label string
---@param value number[]
---@return number[]
function InputFloat4(label, value)
    _, value = imgui.InputFloat2(label, value)
    return value
end
