---@diagnostic disable: return-type-mismatch
---Creates a TimingPoint.
---@param startTime number
---@param bpm? number
---@param signature? number
---@param hidden? boolean
---@return TimingPointInfo
function line(startTime, bpm, signature, hidden)
    return utils.CreateTimingPoint(startTime, bpm or map.GetCommonBpm(), signature or time_signature.Quadruple,
        hidden or false)
end
