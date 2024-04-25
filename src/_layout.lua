function draw()
    imgui.Begin("Luaver-Testing-Environment")

    -- SHARED ELEMENTS ACROSS ALL PAGES GO BEFORE IMGUI.END()

    RouterTabs({ "Info", "Globals", "Inputs" }, { "main", "globalsDemo", "inputsDemo" })

    imgui.End()
end
