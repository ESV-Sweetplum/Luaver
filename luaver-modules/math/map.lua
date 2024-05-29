---Given a number `val` that lies between `start1` and `end1`, produces a number between `start2` and `end2` such that the percentage completion through a number line remains the same. Uses identical syntax as [Arduino](https://www.arduino.cc/reference/en/language/functions/math/map/). Ignore `progressionExponent` if you want a linear map.
---@param val number
---@param start1 number
---@param end1 number
---@param start2 number
---@param end2 number
---@param progressionExponent? number
---@return number
function math.map(val, start1, end1, start2, end2, progressionExponent)
    progressionExponent = progressionExponent or 1
    baseProgress = (val - start1) / (end1 - start1)
    progress = baseProgress ^ progressionExponent;
    if (progressionExponent < 1) then
        progress = 1 - (1 - baseProgress) ^ (1 / progressionExponent)
    end

    return progress * (end2 - start2) + start2
end

---Provides a linearly interpolated value given that 0 ≤ `progress` ≤ 1.
---@param startVal number
---@param endVal number
---@param progress number
---@return number
function lerp(startVal, endVal, progress)
    return progress * (endVal - startVal) + startVal
end

math.lerp = lerp
