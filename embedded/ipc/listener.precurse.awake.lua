listen(function(action, status, fromLua)
    if (not next(ipc.subscriptions)) then return end
    if (not fromLua or tonumber(action.Type) ~= 39 or status ~= history_type.New) then return end

    ---@diagnostic disable-next-line: undefined-field
    local bm = action.Bookmark ---@type Bookmark
    for port, fn in pairs(ipc.subscriptions) do
        if (math.abs(ipc.transform(port) - bm.StartTime) < 1e-8 and type(fn) == "function") then
            fn(bm.Note)
            return
        end
    end
end)
