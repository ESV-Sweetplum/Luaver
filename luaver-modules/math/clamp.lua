---Restricts `value` between `min` and `max`.
---@param value number
---@param min number
---@param max number
---@return number
function clamp(value, min, max)
    return math.max(math.min(max, value), min)
end

math.clamp = clamp
