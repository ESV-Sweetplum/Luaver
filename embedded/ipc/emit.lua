---Emits an event, to be received by any plugin listening to the dedicated port.
---@param port integer
---@param data string
function ipc.emit(port, data)
    local bm = utils.CreateBookmark(ipc.transform(port), data)
    actions.AddBookmark(bm)
    table.insert(ipc.emittedPorts, port)
end
