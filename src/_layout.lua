function draw()
    imgui.Begin("Luaver-Testing-Environment")

    -- SHARED ELEMENTS ACROSS ALL PAGES GO BEFORE IMGUI.END()

    RouterTabs({ "Starting", "Globals", "Inputs" }, { "main", "globalsDemo", "inputsDemo" })

    imgui.End()
end
