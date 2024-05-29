---Rounds a number to the nearest `roundingBoundary`.
---@param val number
---@param roundingBoundary number
---@return number
function roundToNearest(val, roundingBoundary)
  return round(val / roundingBoundary) * roundingBoundary
end

---Rounds a number to the nearest integer.
---@param val number
---@return integer
function round(val)
  local dec = val % 1
  if (dec >= 0.5) then return math.ceil(val) else return math.floor(val) end
end

math.round = round
math.roundToNearest = roundToNearest
