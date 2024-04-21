---@diagnostic disable: return-type-mismatch
---Creates a Bookmark.
---@param startTime number
---@param note string
---@return BookmarkInfo
function bm(startTime, note)
    return utils.CreateBookmark(startTime, note)
end
