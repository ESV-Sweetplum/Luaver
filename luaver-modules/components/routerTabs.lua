---Takes two equal-sized tables, and returns a tab bar. The first element of `tabName` creates a name that goes to the first element of `tabRoutes`, etc.
---@param tabNames string[]
---@param tabRoutes string[]
function RouterTabs(tabNames, tabRoutes)
    imgui.BeginTabBar("routerTab")

    for idx, v in pairs(tabNames) do
        flags = 0
        if (routerHistory[#routerHistory] == tabRoutes[idx]) then flags = 2 end
        if imgui.BeginTabItem(v, nil, flags) then
            imgui.EndTabItem()
        end

        if (imgui.IsItemClicked()) then
            router.push(tabRoutes[idx])
        end
    end

    imgui.EndTabBar()
end
