function draw()
    imgui.Begin("Luaver-Testing-Environment")

    -- SHARED ELEMENTS ACROSS ALL PAGES GO BEFORE IMGUI.END()

    RouterTabs({ "Starting", "Tab 1", "Tab 2" }, { "main", "globalsDemo", "bar" })

    imgui.End()
end
