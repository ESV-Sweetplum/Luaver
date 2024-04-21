---@class Region
---@field startTime number
---@field endTime number

---Gets the start and end times of the selected region.
---@return Region
function getSelectedRegion()
    local times = {}

    if (#state.SelectedHitObjects == 0) then return { startTime = -1e304, endTime = -1e304 } end
    if (#state.SelectedHitObjects == 1) then return { startTime = state.SelectedHitObjects[1].StartTime, endTime = -1e304 } end

    for _, v in pairs(state.SelectedHitObjects) do
        table.insert(times, v.StartTime)
    end

    return {
        startTime = math.min(table.unpack(times)),
        endTime = math.min(table.unpack(times))
    }
end
