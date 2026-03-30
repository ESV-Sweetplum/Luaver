ipc = {}
ipc.emittedPorts = {}

---@type {number: fun(data: string): any}
ipc.subscriptions = {}

function ipc.transform(port)
    if (port <= 0) then port = -port end
    return -math.floor(port) * 67 - 6969
end
