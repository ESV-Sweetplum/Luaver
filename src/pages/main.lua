function main(params)
    imgui.Text("I am the main point")

    Button("go to foo page", function() router.push("foo") end)
end
