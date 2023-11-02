//script.js
let assistantCount = 1;
let assistantAgentTypes = [];
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
    // Managing Agent Type dropdown selection
    document.getElementById("assistantAgentType_0").onchange = function () {
        assistantAgentTypes[0] = this.value; 
    }

    // Managing RAG checkbox and URL input box visibility for User Proxy
    document.getElementById("userProxyRAG").onchange = function () {
        if (this.checked) {
            document.getElementById("userProxyURL").style.display = "block";
        } else {
            document.getElementById("userProxyURL").style.display = "none";
        }
    }
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

    // Managing agent type dropdown selection
    let assistantAgentType = document.createElement('select');
    assistantAgentType.id = `assistantAgentType_${assistantCount}`;
    assistantAgentType.onchange = function () {
        assistantAgentTypes[assistantCount] = this.value;
    }
    // Populating the dropdown with options
    let option1 = document.createElement('option');
    option1.value = "Assistant";
    option1.text = "Assistant";
    option1.selected = true;
    assistantAgentType.add(option1);

    let option2 = document.createElement('option');
    option2.value = "RAG";
    option2.text = "RAG";
    assistantAgentType.add(option2);

    let option3 = document.createElement('option');
    option3.value = "Teachable";
    option3.text = "Teachable";
    assistantAgentType.add(option3);    
    // Similar existing operations...

    const newAssistantLabel = document.createElement('label');
    newAssistantLabel.htmlFor = `assistantName_${assistantCount}`;
    newAssistantLabel.innerHTML = 'Assistant Agent Name:';
    newAssistantLabel.style.marginTop = "20px";

    const newAssistantInput = document.createElement('input');
    newAssistantInput.type = 'text';
    newAssistantInput.id = `assistantName_${assistantCount}`;
    newAssistantInput.className = 'padded-input';
    newAssistantInput.placeholder = 'Assistant Agent Name'; // Set the default value as a placeholder
    newAssistantInput.addEventListener('focus', function() {
        if (this.value === this.placeholder) {
          this.value = '';
        }
    });

    newAssistantDiv.appendChild(assistantAgentType);
    //newAssistantDiv.appendChild(newAssistantLabel);
    newAssistantDiv.appendChild(document.createElement('br'));
    newAssistantDiv.appendChild(newAssistantInput);

    const newSystemMessageLabel = document.createElement('label');
    newSystemMessageLabel.htmlFor = `systemMessage_${assistantCount}`;
    newSystemMessageLabel.innerHTML = 'System Message:';

    const newSystemMessageInput = document.createElement('input');
    newSystemMessageInput.type = 'text';
    newSystemMessageInput.id = `systemMessage_${assistantCount}`;
    newSystemMessageInput.placeholder = 'System Message'; 

    //newAssistantDiv.appendChild(newSystemMessageLabel);
    newAssistantDiv.appendChild(newSystemMessageInput);

    
    // Hide or display the 'System Message' box based on selected Assistant Agent Type
    assistantAgentType.onchange = function () {
        assistantAgentTypes[assistantCount] = this.value;
        if (this.value !== "Assistant") {
            newSystemMessageInput.style.display = 'none';
        } else {
            newSystemMessageInput.style.display = 'block';
        }
    }

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
    

    var imports = [];
    var agentConfig = "";
    let script = `# AutoGen Script\n\n`;
    script += '# Import Section - Uncomment import lines as needed\n';
    script += '#import autogen\n';
    script += `from autogen import AssistantAgent, UserProxyAgent\n`;
    script += `#from autogen.agentchat.contrib.retrieve_assistant_agent import RetrieveAssistantAgent\n`;
    script += `#from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent\n`;
    script += `#from autogen.agentchat.contrib.teachable_agent import TeachableAgent\n`;
    script += `#from autogen.ChatCompletion import ChatCompletion\n`;
    script += `#import chromadb\n\n`;
    script += `# LLM Key\n`;

    
    if (apiKey) {
        script += `api_key = "${apiKey}"\n`;
    } else {
        script += `import os\n`;
        script += `api_key = os.environ.get("OPENAI_API_KEY")\n`;
        script += `\n\n`;
    }
    // Generate llm_config structure
    script += `# Configuration\n`;
    let llm_config = `llm_config={\n    "request_timeout": 600,\n    "seed": 42,\n    "config_list": config_list,\n    "temperature": 0\n}`;
    script += `config_list = [\n    {\n        'model': '${model}',\n        'api_key': api_key\n    }\n]\n\n`;
    script += llm_config + '\n';
    script += `\n\n`;
    script += `# Messaging\n`;
    script += "#ChatCompletion.start_logging()\n";                                                                   
    script += "termination_msg = \"\"\"lambda x: isinstance(x, dict) and 'TERMINATE' == str(x.get('content', ''))[-9:].upper()\"\"\"\n";
    script += `\n\n`;

    script += `# Assistant Agents\n`;
    for (let i = 0; i < assistantCount; i++) {
        const assistantAgentTypes = document.getElementById(`assistantAgentType_${i}`).value;
        const assistantName = document.getElementById(`assistantName_${i}`).value || `assistant_${i}`;
        const systemMessage = document.getElementById(`systemMessage_${i}`).value;

        if (assistantAgentTypes[i] == "RAG") {
            // Your RAG script here
            script += `assistant_${i} = RetrieveAssistantAgent(name="${assistantName}", system_message=You are a helpful assistant."${systemMessage}", llm_config=llm_config)\n`;
        } else if (assistantAgentTypes[i] == "Teachable") {
            // Your Teachable script here
            script += `assistant_${i} = TeachableAgent(name="${assistantName}", system_message="${systemMessage}", llm_config=llm_config, teach_config={"verbosity": 0, "reset_db": True, "path_to_db_dir": "./teachable_agent_db", recall_threshold": 1.5})\n`;
        } else {
            // Default Assistant script here
            script += `assistant_${i} = AssistantAgent(name="${assistantName}", system_message="${systemMessage}", llm_config=llm_config)\n`;
        }
        
    }
        
    const useRAG = document.getElementById("userProxyRAG").checked;
    const userProxyName = document.getElementById("userProxyName").value || "userProxy";
    var userProxyURL = document.getElementById("userProxyURL").value;
    if (useRAG) {
        // If the Use RAG checkbox is selected, add specific RAG-related code here
        script += `\n# RAG User Proxy Agent\n`;
        script += `userProxy = RetrieveUserProxyAgent(\n`;                                                                  
        script += `    name="${userProxyName}",\n`;                                                                         
        script += `    is_termination_msg=termination_msg,\n`;                                                              
        script += `    system_message="Assistant who has extra content retrieval power for solving difficult problems.",\n`;
        script += `    human_input_mode="TERMINATE",\n`;                                                                    
        script += `    max_consecutive_auto_reply=3,\n`;                                                                    
        script += `    retrieve_config={\n`;                                                                                
        script += `        "task": "code",\n`;                                                                              
        script += `        "docs_path": "${userProxyURL}",\n`;                                                              
        script += `        "chunk_token_size": 1000,\n`;                                                                    
        script += `        "model": config_list[0]["model"],\n`;                                                            
        script += `        "client": chromadb.PersistentClient(path="/tmp/chromadb"),\n`;                                   
        script += `        "collection_name": "groupchat",\n`;                                                              
        script += `        "get_or_create": True,\n`;                                                                       
        script += `    },\n`;                                                                                               
        script += `    code_execution_config=False,  # we don't want to execute code in this case.\n`;                      
        script += `)\n`;   
    } else {
        // If the Use RAG checkbox is not selected, add the regular code here
    
    script += `\n# User Proxy Agent\n`;
    script += `userProxy = UserProxyAgent(name="${userProxyName}",\n`;
    script += `human_input_mode="NEVER",\n`;
    script += `max_consecutive_auto_reply=10,\n`;
    script += `is_termination_msg=termination_msg,\n`;
    script += `code_execution_config={"work_dir": "web"},\n`;
    script += `llm_config=llm_config,\n`;
    script += `system_message=\"\"\"A human admin\"\"\")\n`; 
    }
    /*  script += `system_message=\"\"\"Reply TERMINATE if the task has been solved at full satisfaction.\n`;
    script += `Otherwise, reply CONTINUE, or the reason why the task is not solved yet.\"\"\"\n`;
    script += `)\n`;
    script += `userProxy.initiate_chat(assistant_0, message="${task}")\n`;*/
        // Check the number of Assistant Agents
    script += `\n`;
    script += `# Initiate Chat\n`;
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
    prompt = f"Here's a Python script. Please optimize it for readability and performance.\n\n{script}"

    response = openai.Completion.create(
      engine="text-davinci-002",
      prompt=prompt,
      max_tokens=200
    )

    optimized_script = response.choices[0].text.strip()

    script += `# Pass responses between multiple AssistantAgents\n`;
    for (let i = 0; i < assistantCount - 1; i++) {
        script += `response = userProxy.get_last_response(assistant_${i})\n`;
        script += `next_response = userProxy.send_message(assistant_${i + 1}, message=response['choices'][0]['message']['content'])\n`;
    }
*/
    document.getElementById("generatedScript").value = script;
}
