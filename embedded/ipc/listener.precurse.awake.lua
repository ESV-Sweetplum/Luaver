listen(function(action, type, fromLua)
    if (not next(ipc.subscriptions)) then return end
    if (not fromLua or tonumber(action.Type) ~= 39 or type ~= history_type.New) then return end

    print(action)
end)
