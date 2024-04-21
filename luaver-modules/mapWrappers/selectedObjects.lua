SelectedNotes = {} ---@type HitObjectInfo[]
SelectedLines = {} ---@type TimingPointInfo[]
SelectedSVs = {} ---@type ScrollVelocityInfo[]
SelectedBookmarks = {} ---@type BookmarkInfo[]

selected = {
    notes = {}, ---@type HitObjectInfo[]
    lines = {}, ---@type TimingPointInfo[]
    svs = {}, ---@type ScrollVelocityInfo[]
    bookmarks = {}, ---@type BookmarkInfo[]
}

function getSelectedObjects()
    local region = getSelectedRegion()

    for _, v in pairs(map.HitObjects) do
        if (v.StartTime >= region.startTime) and (v.StartTime <= region.endTime) then
            table.insert(SelectedNotes, v)
        end
    end

    for _, v in pairs(map.TimingPoints) do
        if (v.StartTime >= region.startTime) and (v.StartTime <= region.endTime) then
            table.insert(SelectedLines, v)
        end
    end

    for _, v in pairs(map.ScrollVelocities) do
        if (v.StartTime >= region.startTime) and (v.StartTime <= region.endTime) then
            table.insert(SelectedSVs, v)
        end
    end

    for _, v in pairs(map.Bookmarks) do
        if (v.StartTime >= region.startTime) and (v.StartTime <= region.endTime) then
            table.insert(SelectedBookmarks, v)
        end
    end

    state.SetValue("SelectedNotes", SelectedNotes)
    state.SetValue("SelectedLines", SelectedLines)
    state.SetValue("SelectedSVs", SelectedSVs)
    state.SetValue("SelectedBookmarks", SelectedBookmarks)
end

function getSelectedObjectsState()
    SelectedNotes = state.GetValue("SelectedNotes") or {}
    SelectedLines = state.GetValue("SelectedLines") or {}
    SelectedSVs = state.GetValue("SelectedSVs") or {}
    SelectedBookmarks = state.GetValue("SelectedBookmarks") or {}

    setSelectedTable()
end

function setSelectedTable()
    selected.notes = SelectedNotes
    selected.lines = SelectedLines
    selected.svs = SelectedSVs
    selected.bookmarks = SelectedBookmarks
end
