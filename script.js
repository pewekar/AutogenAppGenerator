let assistantCount = 1;

function initializePage() {
    const useEnvVarCheckbox = document.getElementById("useEnvVar");
    const apiKeyGroup = document.getElementById("apiKeyGroup");

    // Uncheck the "Use Environment Variable" checkbox
    useEnvVarCheckbox.checked = false;

    // Show the API key box
    apiKeyGroup.style.display = "block";
}

function addAssistantAgent() {
    const newAssistantDiv = document.createElement('div');
    newAssistantDiv.className = 'input-group';
    newAssistantDiv.id = `assistant_${assistantCount}`;

    const newAssistantLabel = document.createElement('label');
    newAssistantLabel.htmlFor = `assistantName_${assistantCount}`;
    newAssistantLabel.innerHTML = 'Assistant Agent Name:';

    const newAssistantInput = document.createElement('input');
    newAssistantInput.type = 'text';
    newAssistantInput.id = `assistantName_${assistantCount}`;

    newAssistantDiv.appendChild(newAssistantLabel);
    newAssistantDiv.appendChild(newAssistantInput);

    document.getElementById('assistantAgents').appendChild(newAssistantDiv);
    assistantCount++;
}

function toggleAPIKeyBox() {
    const useEnvVar = document.getElementById("useEnvVar").checked;
    const apiKeyGroup = document.getElementById("apiKeyGroup");
    if (useEnvVar) {
        apiKeyGroup.style.display = "none";
    } else {
        apiKeyGroup.style.display = "block";
    }
}

function copyToClipboard() {
    const textarea = document.getElementById("generatedScript");
    textarea.select();
    document.execCommand("copy");
}

function generateScript() {
    const apiKey = document.getElementById("apiKey").value;
    const model = document.getElementById("model").value;
    const task = document.getElementById("task").value;

    let script = `# AutoGen Script\n`;

    if (apiKey) {
        script += `api_key = "${apiKey}"\n`;
    } else {
        script += `import os\n`;
        script += `api_key = os.environ["OPENAI_API_KEY"]\n`;
    }

    script += `config_list = [\n    {\n        'model': '${model}',\n        'api_key': api_key\n    }\n]\n`;

    script += `# Assistant Agents\n`;
    for (let i = 0; i < assistantCount; i++) {
        const assistantName = document.getElementById(`assistantName_${i}`).value || `assistant_${i}`;
        script += `assistant_${i} = autogen.AssistantAgent(name="${assistantName}", llm_config={"config_list": config_list})\n`;
    }

    const userProxyName = document.getElementById("userProxyName").value || "userProxy";
    script += `\n# User Proxy Agent\n`;
    script += `userProxy = autogen.UserProxyAgent(name="${userProxyName}")\n`;
    script += `userProxy.initiate_chat(assistant_0, message="${task}")\n`;

    script += `# Pass responses between multiple AssistantAgents\n`;
    for (let i = 0; i < assistantCount - 1; i++) {
        script += `response = userProxy.get_last_response(assistant_${i})\n`;
        script += `next_response = userProxy.send_message(assistant_${i + 1}, message=response['choices'][0]['message']['content'])\n`;
    }

    document.getElementById("generatedScript").value = script;
}
