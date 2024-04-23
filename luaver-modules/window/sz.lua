sz = { x = 0, y = 0 }

function refreshSZ()
    sz.x = imgui.GetWindowSize()[1]
    sz.y = imgui.GetWindowSize()[2]
    return sz
end

function isScrollbarVisible()
    return imgui.GetScrollMaxY() ~= 0
end
