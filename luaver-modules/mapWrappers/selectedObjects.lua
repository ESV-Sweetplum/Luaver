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
    SelectedNotes = state.SelectedHitObjects ---@type HitObjectInfo[]
    SelectedLines = {} ---@type TimingPointInfo[]
    SelectedSVs = {} ---@type ScrollVelocityInfo[]
    SelectedBookmarks = {} ---@type BookmarkInfo[]

    for _, v in pairs(map.TimingPoints) do
        if (v.StartTime >= Region.startTime) and (v.StartTime <= Region.endTime) then
            table.insert(SelectedLines, v)
        end
    end

    for _, v in pairs(map.ScrollVelocities) do
        if (v.StartTime >= Region.startTime) and (v.StartTime <= Region.endTime) then
            table.insert(SelectedSVs, v)
        end
    end

    for _, v in pairs(map.Bookmarks) do
        if (v.StartTime >= Region.startTime) and (v.StartTime <= Region.endTime) then
            table.insert(SelectedBookmarks, v)
        end
    end

    state.SetValue("SelectedNotes", SelectedNotes)
    state.SetValue("SelectedLines", SelectedLines)
    state.SetValue("SelectedSVs", SelectedSVs)
    state.SetValue("SelectedBookmarks", SelectedBookmarks)

    setSelectedTable()
end

function getSelectedObjectsState()
    SelectedNotes = state.GetValue("SelectedNotes") or {} ---@type HitObjectInfo[]
    SelectedLines = state.GetValue("SelectedLines") or {} ---@type TimingPointInfo[]
    SelectedSVs = state.GetValue("SelectedSVs") or {} ---@type ScrollVelocityInfo[]
    SelectedBookmarks = state.GetValue("SelectedBookmarks") or {} ---@type BookmarkInfo[]

    local oldStart = Region.startTime
    local oldEnd = Region.endTime

    Region = getSelectedRegion()

    if (oldStart ~= Region.startTime) or (oldEnd ~= Region.endTime) then
        getSelectedObjects()
    end
end

function setSelectedTable()
    selected.notes = SelectedNotes
    selected.lines = SelectedLines
    selected.svs = SelectedSVs
    selected.bookmarks = SelectedBookmarks
end
