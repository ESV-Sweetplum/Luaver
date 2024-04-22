---Takes two equal-sized tables, and returns a tab bar. The first element of `tabName` creates a name that goes to the first element of `tabRoutes`.
---@param tabNames string[]
---@param tabRoutes string[]
function RouterTabs(tabNames, tabRoutes)
    imgui.BeginTabBar("routerTab")

    for idx, v in pairs(tabNames) do
        if (imgui.BeginTabItem(v)) then
            router.push(tabRoutes[idx])
            imgui.EndTabItem()
        end
    end

    imgui.EndTabBar()
end
