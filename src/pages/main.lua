function main(params)
    Text("Welcome to Luaver!")

    Text("Here are examples of built-in globals:")
    Text("Selected StartTime: ", Region.startTime, "Selected EndTime: ", Region.endTime)
    Button("Detect selected objects within selection region", function() getSelectedObjects() end)

    Text("Detected Notes: ", #selected.notes) -- Either use the selected global,
    Text("Detected Lines: ", #SelectedLines)  -- or use Selected___ for currently selected objects.
    Text("Detected SVs: ", #selected.svs)     -- Both selected and Selected____ are supported.
    Text("Detected Bookmarks: ", #SelectedBookmarks)
end
