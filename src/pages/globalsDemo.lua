function main()
    Title("Here are examples of built-in globals:")
    imgui.Separator()
    imgui.PushItemWidth(150)

    InputInt2("Selected Start/End Times", { Region.startTime, Region.endTime }, true)
    -- The Region global shows you the start and end times of the user selection.

    InputInt("Detected Notes", #selected.notes, true) -- Either use the selected global,
    InputInt("Detected Lines", #SelectedLines, true)  -- or use Selected___ for currently selected objects.
    InputInt("Detected SVs", #selected.svs, true)     -- Both selected and Selected____ are supported.
    InputInt("Detected Bookmarks", #SelectedBookmarks, true)
end
