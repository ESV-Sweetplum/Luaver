---@diagnostic disable: return-type-mismatch
---Creates a ScrollVelocity.
---@param startTime number
---@param multiplier? number
---@return ScrollVelocityInfo
function sv(startTime, multiplier)
    return utils.CreateScrollVelocity(startTime, multiplier or 1)
end
