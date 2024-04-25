function main(params)
    local settings = {
        testingValue = 0
    }

    -- Since state variables are obtained after the first settings call, we cannot place params within the settings table constructor.
    -- I hate this stupid fucking language (even though this problem is entirely my fault LOL)

    if (params.testingValue) then settings.testingValue = params.testingValue end

    Text("The inputted setting is", settings.testingValue)

    Button("Return home", router.push)
end
