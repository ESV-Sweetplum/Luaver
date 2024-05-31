function main(params)
    Title("Welcome to Luaver!")
    imgui.Separator()
    imgui.Text("Click on the tabs above to navigate through")
    imgui.Text("Luaver's key features, such as globals and inputs.")
    imgui.Text("To get started making your OWN plugin, take a look at")
    imgui.PushStyleColor(imgui_col.Text, { 1, 0.7, 0.7, 255 })
    imgui.Text("_layout.lua")
    imgui.PopStyleColor()
    imgui.SameLine(0, 4)
    imgui.Text("and the pages inside")
    imgui.PushStyleColor(imgui_col.Text, { 1, 0.7, 0.7, 255 })
    imgui.SameLine(0, 4)
    imgui.Text("src/pages.")
    imgui.PopStyleColor()
    if (hasChanged(Region.startTime)) then
        Text(Region.startTime)
    end
    -- if (hasChanged(Region.startTime)) or (hasChanged(Region.endTime)) then
    --     print("Selected Region Has Changed")
    -- end
    print(cacheCounter)
end
