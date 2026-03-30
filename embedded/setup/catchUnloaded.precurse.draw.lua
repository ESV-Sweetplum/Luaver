if (not state
        or not imgui
        or not map
        or not utils
        or not actions
        or not vector
        or not bit32
        or not listen
        or not read
        or not write
    ) then
    return
end

state.IsWindowHovered = imgui.IsWindowHovered()
