function main()
    local settings = {
        exampleBoolean = false,
        someNumbers = { 1, 2 },
        someText = "luaver is fun",
        randomFloat = 69
    }

    imgui.PushItemWidth(150)

    settings.exampleBoolean = RadioBoolean("Off", "On", settings.exampleBoolean)

    Tooltip("This is a tooltip to explain your inputs")

    if (settings.exampleBoolean) then
        settings.someNumbers = InputInt2("Some Numbers", settings.someNumbers)
        settings.someText = InputText("Some Text", settings.someText)
        settings.randomFloat = InputFloat("This float is between 0 and 100", clamp(settings.randomFloat, 0, 100))

        Button("pass float to a different page",
            function() router.push("paramDemo", { testingValue = settings.randomFloat }) end)
    end
end
