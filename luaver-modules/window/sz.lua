---@class WindowSize
---@field x number
---@field y number

sz = { x = 0, y = 0 } ---@type WindowSize

---Gets the current window size.
---@return WindowSize
function refreshSZ()
    sz.x = imgui.GetWindowSize()[1]
    sz.y = imgui.GetWindowSize()[2]
    return sz
end

---Returns `true` if the scrollbar is visible, and `false` if it's not.
---@return boolean
function isScrollbarVisible()
    return imgui.GetScrollMaxY() ~= 0
end
