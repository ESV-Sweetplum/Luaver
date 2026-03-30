function ipc.subscribe(port, fn)
    ipc.subscriptions[port] = fn
end

function ipc.unsubscribe(port)
    ipc.subscriptions[port] = nil
end
