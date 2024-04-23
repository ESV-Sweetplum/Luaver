function main(params)
    local settings = {
        bruh = 1,
        moment = 2
    }

    Title("Welcome to Luaver!")

    settings.bruh = InputInt("label", settings.bruh)
    settings.moment = InputInt("label1", settings.moment)

    Text(#routerHistory)

    imgui.Separator()
end
