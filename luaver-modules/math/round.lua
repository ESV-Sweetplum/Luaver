function roundToNearest(val, roundingEstimate)
  return round(val * roundingEstimate) / roundingEstimate
end

function round(val)
  local dec = val % 1
  if (dec >= 0.5) then return math.ceil(val) else return math.floor(val) end
end

math.round = round
math.roundToNearest = roundToNearest
