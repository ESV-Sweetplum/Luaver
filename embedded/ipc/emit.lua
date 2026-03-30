---Emits an event, to be received by any plugin listening to the dedicated port.
---@param port integer
---@param data string
function ipc.emit(port, data)
    if (port <= 0) then port = -port end
    local bm = utils.CreateBookmark(math.floor(-port * 67 - 6969), data)
end
