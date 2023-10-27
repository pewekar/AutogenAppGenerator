let assistantCount = 1;
/*
window.onload = function() {
    initializePage();
};
*/
function initializePage() {
    const useEnvVarCheckbox = document.getElementById("useEnvVar");
    const apiKeyGroup = document.getElementById("apiKeyGroup");

    // Uncheck the "Use Environment Variable" checkbox
    useEnvVarCheckbox.checked = true;

    // Show the API key box
    apiKeyGroup.style.display = "none";
}
function removeAssistantAgent(id) {
    const assistantDiv = document.getElementById(id);
    if (assistantDiv) {
        assistantDiv.remove();
    }
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
    newAssistantInput.className = 'padded-input';
    
    newAssistantDiv.appendChild(newAssistantLabel);
    newAssistantDiv.appendChild(newAssistantInput);

    const newSystemMessageLabel = document.createElement('label');
    newSystemMessageLabel.htmlFor = `systemMessage_${assistantCount}`;
    newSystemMessageLabel.innerHTML = 'System Message:';

    const newSystemMessageInput = document.createElement('input');
    newSystemMessageInput.type = 'text';
    newSystemMessageInput.id = `systemMessage_${assistantCount}`;

    newAssistantDiv.appendChild(newSystemMessageLabel);
    newAssistantDiv.appendChild(newSystemMessageInput);

    // new code
    const newAddButton = document.createElement('button');  // New code
    newAddButton.className = 'add-button';  // New code
    newAddButton.innerHTML = '+';  // New code
    newAddButton.onclick = addAssistantAgent;  // New code
    newAssistantDiv.appendChild(newAddButton);  // New code

    const newRemoveButton = document.createElement('button');
    newRemoveButton.className = 'remove-button';
    newRemoveButton.innerHTML = '-';
    newRemoveButton.onclick = () => removeAssistantAgent(newAssistantDiv.id);
    newAssistantDiv.appendChild(newRemoveButton);
    // new code ends

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
    script += `from autogen import AssistantAgent, UserProxyAgent\n`;
    
    // Generate llm_config structure
    if (apiKey) {
        script += `api_key = "${apiKey}"\n`;
    } else {
        script += `import os\n`;
        script += `api_key = os.environ["OPENAI_API_KEY"]\n`;
    }
    let llm_config = `llm_config={\n    "request_timeout": 600,\n    "seed": 42,\n    "config_list": config_list,\n    "temperature": 0\n}`;
    script += `config_list = [\n    {\n        'model': '${model}',\n        'api_key': api_key\n    }\n]\n`;
    script += llm_config + '\n';
    
    script += `# Assistant Agents\n`;
    for (let i = 0; i < assistantCount; i++) {
        const assistantName = document.getElementById(`assistantName_${i}`).value || `assistant_${i}`;
        const systemMessage = document.getElementById(`systemMessage_${i}`).value;
        script += `assistant_${i} = AssistantAgent(name="${assistantName}", system_message="${systemMessage}", llm_config=llm_config)\n`;
    }

    const userProxyName = document.getElementById("userProxyName").value || "userProxy";
    script += `\n# User Proxy Agent\n`;
    script += `userProxy = UserProxyAgent(name="${userProxyName}",\n`;
    script += `human_input_mode="NEVER",\n`;
    script += `max_consecutive_auto_reply=10,\n`;
    script += `is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),\n`;
    script += `code_execution_config={"work_dir": "web"},\n`;
    script += `llm_config=llm_config,\n`;
    script += `system_message=\"\"\"A human admin\"\"\")\n`; 
/*  script += `system_message=\"\"\"Reply TERMINATE if the task has been solved at full satisfaction.\n`;
    script += `Otherwise, reply CONTINUE, or the reason why the task is not solved yet.\"\"\"\n`;
    script += `)\n`;
    script += `userProxy.initiate_chat(assistant_0, message="${task}")\n`;*/
        // Check the number of Assistant Agents
    if (assistantCount === 1) {
    // If there's only one Assistant Agent
    script += `userProxy.initiate_chat(assistant_0, message="${task}", clear_history=True)\n`;
    } else {
    // If there's more than one Assistant Agent
    script += `# Create groupchat\n`;
    script += `groupchat = autogen.GroupChat(\n`;
    script += `    agents=[userProxy`;

    // Add the assistant agents to the groupchat
    for (let i = 0; i < assistantCount; i++) {
        script += `, assistant_${i}`;
    }

    script += `], messages=[])\n`;
    script += `manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)\n`;

    script += `\n# Start the conversation\n`;
    script += `userProxy.initiate_chat(\n`;
    script += `    manager, message="${task}")\n`;
    // ... rest of your existing code for handling multiple Assistant Agents ...
    }
/*
    script += `# Pass responses between multiple AssistantAgents\n`;
    for (let i = 0; i < assistantCount - 1; i++) {
        script += `response = userProxy.get_last_response(assistant_${i})\n`;
        script += `next_response = userProxy.send_message(assistant_${i + 1}, message=response['choices'][0]['message']['content'])\n`;
    }
*/
    document.getElementById("generatedScript").value = script;
}
