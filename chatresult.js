console.log("EZ Chat Result | Loaded");

const getMessage = (html) => {
    return game.messages.get($(html).data("messageId"))
}

const isGm = () => {
    return game.user.isGM;
}

const resultsList = {
    s: "Success",
    f: "Failure",
    cf: "Critical Failure",
    cs: "Critical Success"
}

const expandResult = (key) => {
    return resultsList[key];
}

Hooks.on("renderChatLog",  (application, html, data) => {
    html.on("click","li .ez-chat-result .controls button", (ev) => {
        // console.log(ev)
        const result = ev.target.dataset.result;
        const message = (getMessage(ev.target.closest("li")));
        if (!resultsList.hasOwnProperty(result)) {
            message.unsetFlag("ez-chat-result", "result")
        }
        else {
            message.setFlag("ez-chat-result", "result", result)
        }
    })
});

// Hooks.on("getChatLogEntryContext", (application, entryOptions) => {
//     console.log("EZ Chat Result | Chat Log Entry Context");
//     console.log(application);
//     console.log(entryOptions);
    // entryOptions.push({
    //     name: "Test <em data-aaa='hi'>WHAT</em>",
    //     condition: (li) => {
    //         return true;
    //     },
    //     icon: "",
    //     callback: async (li) => {
    //         const message = getMessage(li);
    //         console.log(message);
    //     }
    // })
// })

Hooks.on("renderChatMessage", (application, html, data) => {
    const message = getMessage(html);

    // console.log(message);
    if (!message.isRoll) {
        return;
    }

    const result = message.getFlag("ez-chat-result", "result")

    const showResults = !!result;
    const showControls = isGm() && !showResults;

    // isn't there a better way to do this?
    // ya prolly but i dont care lmao

    if (showResults) {
        if (isGm()) {
            const template = `
            <div class="ez-chat-result">
            <div class="hover-container">
            <div class="result result-${result} hover-off">
            ${expandResult(result)}
            </div>
            <div class="controls hover-on">
            <button type="button" data-tooltip="Clear Result" data-result="x">&times; ${expandResult(result)}</button>
            </div>
            </div>
            </div>
            `
            
            html.append(template)
        }
        else {
            const template = `
            <div class="ez-chat-result">
            <div class="result result-${result}">${expandResult(result)}</div>
            </div>
            `
            
            html.append(template)
        }
    }

    if (showControls) {

        const template = `
        <div class="ez-chat-result">
        <div class="controls">
            <button type="button" data-tooltip="Critical Failure" data-result="cf">CF</button>
            <button type="button" data-tooltip="Failure" data-result="f">F</button>
            <button type="button" data-tooltip="Success" data-result="s">S</button>
            <button type="button" data-tooltip="Critical Success" data-result="cs">CS</button>
        </div>
        </div>
        `

        html.append(template)
    }
})

