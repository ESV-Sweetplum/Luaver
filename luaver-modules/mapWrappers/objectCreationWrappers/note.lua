---@diagnostic disable: return-type-mismatch
---Creates a HitObject.
---@param startTime number
---@param lane 1|2|3|4|5|6|7|8
---@param endTime? number
---@param hitSound? any
---@param editorLayer? integer
---@return BookmarkInfo
function note(startTime, lane, endTime, hitSound, editorLayer)
    return utils.CreateHitObject(startTime, lane, endTime or 0, hitSound or 0, editorLayer or 0)
end
