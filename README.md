# TcpClientToNplServer
Sending npl protocol message to npl server by node socket client

### Start Npl Server
```lua
--[[
Author: leio
Date: 2020/10/29
Desc: testing simple server
-----------------------------------------------
NPL.load("(gl)script/test/network/CustomDataServer.lua");
test_start_simple_server();
-----------------------------------------------
]]
NPL.load("(gl)script/ide/commonlib.lua"); -- many sub dependency included

-- for sending data to client by npl protocol
NPL.AddPublicFile("script/test/network/FakeClient.lua", 1);
-- for receiving data from client
NPL.AddPublicFile("script/test/network/CustomDataServer.lua", 2);

function test_start_simple_server()
	NPL.StartNetServer("127.0.0.1", "60001");
	input = input or {};
	local rts_name = "worker1";
	local worker = NPL.CreateRuntimeState(rts_name, 0);
	worker:Start();
	
	log("=====simple server is now started=========\n\n")
end

local function activate()
	log("server received: \n")
	commonlib.echo(msg);

    local user_id = "simpleclient";
	if(not msg.nid) then
		-- quick authentication, just accept any connection as simpleclient
		msg.nid = user_id;
		NPL.accept(msg.tid, msg.nid);
	end
    local data = {
        title = "hello world from server"
    }
    -- send data by npl protocol
    NPL.SetProtocol(user_id,0);
    NPL.activate("simpleclient:script/test/network/FakeClient.lua", {data})
    -- send data by custom protocol
    NPL.SetProtocol(user_id,2);
    local json = NPL.ToJson(data, true)
    NPL.activate("simpleclient:tcp", {json});
end
NPL.this(activate)
```
### Start Node Client
```js
node .\main.js

function writeFullPathNplMsg() {
    const buff = Buffer.from('A (worker1)script/test/network/CustomDataServer.lua\n\n16: {TestCase="TP"}', 'utf8');
    return buff;
}
function writeNplMsg() {
    const buff = Buffer.from('A (worker1)2\n\n16: {TestCase="TP"}', 'utf8');
    return buff;
}
```
#### Received npl protocol msg
![image](https://user-images.githubusercontent.com/5885941/97576441-21eb9280-1a29-11eb-907c-d9516aa56b47.png)
#### Received json msg
![image](https://user-images.githubusercontent.com/5885941/97576179-c9b49080-1a28-11eb-8024-29b8d9c2b14a.png)
#### The format of npl protocol 
 - [NPLMsgIn_parser](https://github.com/LiXizhi/NPLRuntime/blob/dev/Client/trunk/ParaEngineClient/NPL/NPLMsgIn_parser.h#L94)