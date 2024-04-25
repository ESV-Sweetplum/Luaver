---Takes two equal-sized tables, and returns a tab bar. The first element of `tabName` creates a name that goes to the first element of `tabRoutes`, etc.
---@param tabNames string[]
---@param tabRoutes string[]
function RouterTabs(tabNames, tabRoutes)
    imgui.BeginTabBar("routerTab")

    for idx, v in pairs(tabNames) do
        if (imgui.BeginTabItem(v, routerHistory[#routerHistory]) == tabRoutes[idx]) then
            imgui.EndTabItem()
        end
        if (imgui.IsItemClicked()) then
            router.push(tabRoutes[idx])
        end
    end

    imgui.EndTabBar()
end
