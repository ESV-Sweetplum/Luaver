---Returns the sign of a number.
---@param x number
---@return 1 | 0 | -1
function sign(x)
  return x > 0 and 1 or x < 0 and -1 or 0
end

math.sign = sign
