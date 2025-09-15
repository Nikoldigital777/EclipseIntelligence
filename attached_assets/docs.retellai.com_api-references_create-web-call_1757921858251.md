[Retell AI home page![light logo](https://mintcdn.com/retellai/_FxJdxv7mQoPqyGs/logo/logo-black.svg?fit=max&auto=format&n=_FxJdxv7mQoPqyGs&q=85&s=11dfae26479fc0bf0bf672443e7fc6d3)![dark logo](https://mintcdn.com/retellai/_FxJdxv7mQoPqyGs/logo/logo-white.svg?fit=max&auto=format&n=_FxJdxv7mQoPqyGs&q=85&s=8f464996a71744ac8fa6d086e39c46ce)](https://docs.retellai.com/)

Search...

Ctrl K

Search...

Navigation

Call (V2)

Create Web Call

[Documentation](https://docs.retellai.com/general/introduction) [API Reference](https://docs.retellai.com/api-references/create-phone-call) [Video Tutorials](https://docs.retellai.com/videos/introduction) [Deprecation Notice](https://docs.retellai.com/deprecation-notice/9-30)

JavaScript

Javascript

Copy

Ask AI

```
import Retell from 'retell-sdk';

const client = new Retell({
  apiKey: 'YOUR_RETELL_API_KEY',
});

const webCallResponse = await client.call.createWebCall({ agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD' });

console.log(webCallResponse.agent_id);
```

201

400

401

402

422

429

500

Copy

Ask AI

```
{
  "call_type": "web_call",
  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9p",
  "call_id": "Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6",
  "agent_id": "oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD",
  "agent_version": 1,
  "call_status": "registered",
  "metadata": {},
  "retell_llm_dynamic_variables": {
    "customer_name": "John Doe"
  },
  "collected_dynamic_variables": {
    "last_node_name": "Test node"
  },
  "custom_sip_headers": {
    "X-Custom-Header": "Custom Value"
  },
  "data_storage_setting": "everything",
  "opt_in_signed_url": true,
  "start_timestamp": 1703302407333,
  "end_timestamp": 1703302428855,
  "duration_ms": 10000,
  "transcript": "Agent: hi how are you doing?\nUser: Doing pretty well. How are you?\nAgent: That's great to hear! I'm doing well too, thanks! What's up?\nUser: I don't have anything in particular.\nAgent: Got it, just checking in!\nUser: Alright. See you.\nAgent: have a nice day",
  "transcript_object": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "transcript_with_tool_calls": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "scrubbed_transcript_with_tool_calls": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "recording_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav",
  "recording_multi_channel_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav",
  "scrubbed_recording_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav",
  "scrubbed_recording_multi_channel_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav",
  "public_log_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/public_log.txt",
  "knowledge_base_retrieved_contents_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/kb_retrieved_contents.txt",
  "latency": {
    "e2e": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "llm": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "llm_websocket_network_rtt": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "tts": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "knowledge_base": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "s2s": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    }
  },
  "disconnection_reason": "agent_hangup",
  "call_analysis": {
    "call_summary": "The agent called the user to ask question about his purchase inquiry. The agent asked several questions regarding his preference and asked if user would like to book an appointment. The user happily agreed and scheduled an appointment next Monday 10am.",
    "in_voicemail": false,
    "user_sentiment": "Positive",
    "call_successful": true,
    "custom_analysis_data": {}
  },
  "call_cost": {
    "product_costs": [\
      {\
        "product": "elevenlabs_tts",\
        "unit_price": 1,\
        "cost": 60\
      }\
    ],
    "total_duration_seconds": 60,
    "total_duration_unit_price": 1,
    "combined_cost": 70
  },
  "llm_token_usage": {
    "values": [\
      123\
    ],
    "average": 123,
    "num_requests": 123
  }
}
```

POST

/

v2

/

create-web-call

Try it

JavaScript

Javascript

Copy

Ask AI

```
import Retell from 'retell-sdk';

const client = new Retell({
  apiKey: 'YOUR_RETELL_API_KEY',
});

const webCallResponse = await client.call.createWebCall({ agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD' });

console.log(webCallResponse.agent_id);
```

201

400

401

402

422

429

500

Copy

Ask AI

```
{
  "call_type": "web_call",
  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9p",
  "call_id": "Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6",
  "agent_id": "oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD",
  "agent_version": 1,
  "call_status": "registered",
  "metadata": {},
  "retell_llm_dynamic_variables": {
    "customer_name": "John Doe"
  },
  "collected_dynamic_variables": {
    "last_node_name": "Test node"
  },
  "custom_sip_headers": {
    "X-Custom-Header": "Custom Value"
  },
  "data_storage_setting": "everything",
  "opt_in_signed_url": true,
  "start_timestamp": 1703302407333,
  "end_timestamp": 1703302428855,
  "duration_ms": 10000,
  "transcript": "Agent: hi how are you doing?\nUser: Doing pretty well. How are you?\nAgent: That's great to hear! I'm doing well too, thanks! What's up?\nUser: I don't have anything in particular.\nAgent: Got it, just checking in!\nUser: Alright. See you.\nAgent: have a nice day",
  "transcript_object": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "transcript_with_tool_calls": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "scrubbed_transcript_with_tool_calls": [\
    {\
      "role": "agent",\
      "content": "hi how are you doing?",\
      "words": [\
        {\
          "word": "hi",\
          "start": 0.7,\
          "end": 1.3\
        }\
      ]\
    }\
  ],
  "recording_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav",
  "recording_multi_channel_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav",
  "scrubbed_recording_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav",
  "scrubbed_recording_multi_channel_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav",
  "public_log_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/public_log.txt",
  "knowledge_base_retrieved_contents_url": "https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/kb_retrieved_contents.txt",
  "latency": {
    "e2e": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "llm": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "llm_websocket_network_rtt": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "tts": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "knowledge_base": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    },
    "s2s": {
      "p50": 800,
      "p90": 1200,
      "p95": 1500,
      "p99": 2500,
      "max": 2700,
      "min": 500,
      "num": 10,
      "values": [\
        123\
      ]
    }
  },
  "disconnection_reason": "agent_hangup",
  "call_analysis": {
    "call_summary": "The agent called the user to ask question about his purchase inquiry. The agent asked several questions regarding his preference and asked if user would like to book an appointment. The user happily agreed and scheduled an appointment next Monday 10am.",
    "in_voicemail": false,
    "user_sentiment": "Positive",
    "call_successful": true,
    "custom_analysis_data": {}
  },
  "call_cost": {
    "product_costs": [\
      {\
        "product": "elevenlabs_tts",\
        "unit_price": 1,\
        "cost": 60\
      }\
    ],
    "total_duration_seconds": 60,
    "total_duration_unit_price": 1,
    "combined_cost": 70
  },
  "llm_token_usage": {
    "values": [\
      123\
    ],
    "average": 123,
    "num_requests": 123
  }
}
```

#### Authorizations

[​](https://docs.retellai.com/api-references/create-web-call#authorization-authorization)

Authorization

string

header

required

Authentication header containing API key (find it in dashboard). The format is "Bearer YOUR\_API\_KEY"

#### Body

application/json

[​](https://docs.retellai.com/api-references/create-web-call#body-agent-id)

agent\_id

string

required

Unique id of agent used for the call. Your agent would contain the LLM Websocket url used for this call.

Example:

`"oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD"`

[​](https://docs.retellai.com/api-references/create-web-call#body-agent-version)

agent\_version

integer

The version of the agent to use for the call.

Example:

`1`

[​](https://docs.retellai.com/api-references/create-web-call#body-metadata)

metadata

object

An arbitrary object for storage purpose only. You can put anything here like your internal customer id associated with the call. Not used for processing. You can later get this field from the call object.

[​](https://docs.retellai.com/api-references/create-web-call#body-retell-llm-dynamic-variables)

retell\_llm\_dynamic\_variables

object

Add optional dynamic variables in key value pairs of string that injects into your Response Engine prompt and tool description. Only applicable for Response Engine.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#body-retell-llm-dynamic-variables-key)

retell\_llm\_dynamic\_variables.{key}

any

Example:

```
{ "customer_name": "John Doe" }
```

#### Response

201

application/json

Successfully created a web call.

[​](https://docs.retellai.com/api-references/create-web-call#response-call-type)

call\_type

enum<string>

required

Type of the call. Used to distinguish between web call and phone call.

Available options:

`web_call`

Example:

`"web_call"`

[​](https://docs.retellai.com/api-references/create-web-call#response-access-token)

access\_token

string

required

Access token to enter the web call room. This needs to be passed to your frontend to join the call.

Example:

`"eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9p"`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-id)

call\_id

string

required

Unique id of the call. Used to identify in LLM websocket and used to authenticate in audio websocket.

Example:

`"Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6"`

[​](https://docs.retellai.com/api-references/create-web-call#response-agent-id)

agent\_id

string

required

Corresponding agent id of this call.

Example:

`"oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD"`

[​](https://docs.retellai.com/api-references/create-web-call#response-agent-version)

agent\_version

integer

required

The version of the agent.

Example:

`1`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-status)

call\_status

enum<string>

required

Status of call.

- `registered`: Call id issued, starting to make a call using this id.

- `ongoing`: Call connected and ongoing.

- `ended`: The underlying websocket has ended for the call. Either user or agent hanged up, or call transferred.

- `error`: Call encountered error.


Available options:

`registered`,

`not_connected`,

`ongoing`,

`ended`,

`error`

Example:

`"registered"`

[​](https://docs.retellai.com/api-references/create-web-call#response-metadata)

metadata

object

An arbitrary object for storage purpose only. You can put anything here like your internal customer id associated with the call. Not used for processing. You can later get this field from the call object.

[​](https://docs.retellai.com/api-references/create-web-call#response-retell-llm-dynamic-variables)

retell\_llm\_dynamic\_variables

object

Add optional dynamic variables in key value pairs of string that injects into your Response Engine prompt and tool description. Only applicable for Response Engine.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-retell-llm-dynamic-variables-key)

retell\_llm\_dynamic\_variables.{key}

any

Example:

```
{ "customer_name": "John Doe" }
```

[​](https://docs.retellai.com/api-references/create-web-call#response-collected-dynamic-variables)

collected\_dynamic\_variables

object

Dynamic variables collected from the call. Only available after the call ends.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-collected-dynamic-variables-key)

collected\_dynamic\_variables.{key}

any

Example:

```
{ "last_node_name": "Test node" }
```

[​](https://docs.retellai.com/api-references/create-web-call#response-custom-sip-headers)

custom\_sip\_headers

object

Custom SIP headers to be added to the call.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-custom-sip-headers-key)

custom\_sip\_headers.{key}

string

Example:

```
{ "X-Custom-Header": "Custom Value" }
```

[​](https://docs.retellai.com/api-references/create-web-call#response-data-storage-setting)

data\_storage\_setting

enum<string> \| null

Data storage setting for this call's agent. "everything" stores all data, "everything\_except\_pii" excludes PII when possible, "basic\_attributes\_only" stores only metadata.

Available options:

`everything`,

`everything_except_pii`,

`basic_attributes_only`

Example:

`"everything"`

[​](https://docs.retellai.com/api-references/create-web-call#response-opt-in-signed-url)

opt\_in\_signed\_url

boolean

Whether this agent opts in for signed URLs for public logs and recordings. When enabled, the generated URLs will include security signatures that restrict access and automatically expire after 24 hours.

Example:

`true`

[​](https://docs.retellai.com/api-references/create-web-call#response-start-timestamp)

start\_timestamp

integer

Begin timestamp (milliseconds since epoch) of the call. Available after call starts.

Example:

`1703302407333`

[​](https://docs.retellai.com/api-references/create-web-call#response-end-timestamp)

end\_timestamp

integer

End timestamp (milliseconds since epoch) of the call. Available after call ends.

Example:

`1703302428855`

[​](https://docs.retellai.com/api-references/create-web-call#response-duration-ms)

duration\_ms

integer

Duration of the call in milliseconds. Available after call ends.

Example:

`10000`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript)

transcript

string

Transcription of the call. Available after call ends.

Example:

`"Agent: hi how are you doing?\nUser: Doing pretty well. How are you?\nAgent: That's great to hear! I'm doing well too, thanks! What's up?\nUser: I don't have anything in particular.\nAgent: Got it, just checking in!\nUser: Alright. See you.\nAgent: have a nice day"`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-object)

transcript\_object

object\[\]

Transcript of the call in the format of a list of utterance, with timestamp. Available after call ends.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-object-role)

role

enum<string>

required

Documents whether this utterance is spoken by agent or user.

Available options:

`agent`,

`user`,

`transfer_target`

Example:

`"agent"`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-object-content)

content

string

required

Transcript of the utterances.

Example:

`"hi how are you doing?"`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-object-words)

words

object\[\]

required

Array of words in the utterance with the word timestamp. Useful for understanding what word was spoken at what time. Note that the word timestamp is not guaranteed to be accurate, it's more like an approximation.

Example:

```
[{ "word": "hi", "start": 0.7, "end": 1.3 }]
```

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-with-tool-calls)

transcript\_with\_tool\_calls

object\[\]

Transcript of the call weaved with tool call invocation and results. It precisely captures when (at what utterance, which word) the tool was invoked and what was the result. Available after call ends.

- Option 1
- Option 2
- Option 3
- Option 4

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-with-tool-calls-role)

role

enum<string>

required

Documents whether this utterance is spoken by agent or user.

Available options:

`agent`,

`user`,

`transfer_target`

Example:

`"agent"`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-with-tool-calls-content)

content

string

required

Transcript of the utterances.

Example:

`"hi how are you doing?"`

[​](https://docs.retellai.com/api-references/create-web-call#response-transcript-with-tool-calls-words)

words

object\[\]

required

Array of words in the utterance with the word timestamp. Useful for understanding what word was spoken at what time. Note that the word timestamp is not guaranteed to be accurate, it's more like an approximation.

Example:

```
[{ "word": "hi", "start": 0.7, "end": 1.3 }]
```

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-transcript-with-tool-calls)

scrubbed\_transcript\_with\_tool\_calls

object\[\]

Transcript of the call weaved with tool call invocation and results, without PII. It precisely captures when (at what utterance, which word) the tool was invoked and what was the result. Available after call ends.

- Option 1
- Option 2
- Option 3
- Option 4

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-transcript-with-tool-calls-role)

role

enum<string>

required

Documents whether this utterance is spoken by agent or user.

Available options:

`agent`,

`user`,

`transfer_target`

Example:

`"agent"`

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-transcript-with-tool-calls-content)

content

string

required

Transcript of the utterances.

Example:

`"hi how are you doing?"`

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-transcript-with-tool-calls-words)

words

object\[\]

required

Array of words in the utterance with the word timestamp. Useful for understanding what word was spoken at what time. Note that the word timestamp is not guaranteed to be accurate, it's more like an approximation.

Example:

```
[{ "word": "hi", "start": 0.7, "end": 1.3 }]
```

[​](https://docs.retellai.com/api-references/create-web-call#response-recording-url)

recording\_url

string

Recording of the call. Available after call ends.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav"`

[​](https://docs.retellai.com/api-references/create-web-call#response-recording-multi-channel-url)

recording\_multi\_channel\_url

string

Recording of the call, with each party’s audio stored in a separate channel. Available after the call ends.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav"`

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-recording-url)

scrubbed\_recording\_url

string

Recording of the call without PII. Available after call ends.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording.wav"`

[​](https://docs.retellai.com/api-references/create-web-call#response-scrubbed-recording-multi-channel-url)

scrubbed\_recording\_multi\_channel\_url

string

Recording of the call without PII, with each party’s audio stored in a separate channel. Available after the call ends.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/recording_multichannel.wav"`

[​](https://docs.retellai.com/api-references/create-web-call#response-public-log-url)

public\_log\_url

string

Public log of the call, containing details about all the requests and responses received in LLM WebSocket, latency tracking for each turntaking, helpful for debugging and tracing. Available after call ends.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/public_log.txt"`

[​](https://docs.retellai.com/api-references/create-web-call#response-knowledge-base-retrieved-contents-url)

knowledge\_base\_retrieved\_contents\_url

string

URL to the knowledge base retrieved contents of the call. Available after call ends if the call utilizes knowledge base feature. It consists of the respond id and the retrieved contents related to that response. It's already rendered in call history tab of dashboard, and you can also manually download and check against the transcript to view the knowledge base retrieval results.

Example:

`"https://retellai.s3.us-west-2.amazonaws.com/Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6/kb_retrieved_contents.txt"`

[​](https://docs.retellai.com/api-references/create-web-call#response-latency)

latency

object

Latency tracking of the call, available after call ends. Not all fields here will be available, as it depends on the type of call and feature used.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-e2e)

latency.e2e

object

End to end latency (from user stops talking to agent start talking) tracking of the call. This latency does not account for the network trip time from Retell server to user frontend. The latency is tracked every time turn change between user and agent.

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-llm)

latency.llm

object

LLM latency (from issue of LLM call to first speakable chunk received) tracking of the call. When using custom LLM. this latency includes LLM websocket roundtrip time between user server and Retell server.

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-llm-websocket-network-rtt)

latency.llm\_websocket\_network\_rtt

object

LLM websocket roundtrip latency (between user server and Retell server) tracking of the call. Only populated for calls using custom LLM.

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-tts)

latency.tts

object

Text-to-speech latency (from the triggering of TTS to first byte received) tracking of the call.

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-knowledge-base)

latency.knowledge\_base

object

Knowledge base latency (from the triggering of knowledge base retrival to all relevant context received) tracking of the call. Only populated when using knowledge base feature for the agent of the call.

[​](https://docs.retellai.com/api-references/create-web-call#response-latency-s2s)

latency.s2s

object

Speech-to-speech latency (from requesting responses of a S2S model to first byte received) tracking of the call. Only populated for calls that uses S2S model like Realtime API.

[​](https://docs.retellai.com/api-references/create-web-call#response-disconnection-reason)

disconnection\_reason

enum<string>

The reason for the disconnection of the call. Read details desciption about reasons listed here at [Disconnection Reason Doc](https://docs.retellai.com/reliability/debug-call-disconnect#understanding-disconnection-reasons).

Available options:

`user_hangup`,

`agent_hangup`,

`call_transfer`,

`voicemail_reached`,

`inactivity`,

`max_duration_reached`,

`concurrency_limit_reached`,

`no_valid_payment`,

`scam_detected`,

`dial_busy`,

`dial_failed`,

`dial_no_answer`,

`invalid_destination`,

`telephony_provider_permission_denied`,

`telephony_provider_unavailable`,

`sip_routing_error`,

`marked_as_spam`,

`user_declined`,

`error_llm_websocket_open`,

`error_llm_websocket_lost_connection`,

`error_llm_websocket_runtime`,

`error_llm_websocket_corrupt_payload`,

`error_no_audio_received`,

`error_asr`,

`error_retell`,

`error_unknown`,

`error_user_not_joined`,

`registered_call_timeout`

Example:

`"agent_hangup"`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis)

call\_analysis

object

Post call analysis that includes information such as sentiment, status, summary, and custom defined data to extract. Available after call ends. Subscribe to `call_analyzed` webhook event type to receive it once ready.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis-call-summary)

call\_analysis.call\_summary

string

A high level summary of the call.

Example:

`"The agent called the user to ask question about his purchase inquiry. The agent asked several questions regarding his preference and asked if user would like to book an appointment. The user happily agreed and scheduled an appointment next Monday 10am."`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis-in-voicemail)

call\_analysis.in\_voicemail

boolean

Whether the call is entered voicemail.

Example:

`false`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis-user-sentiment)

call\_analysis.user\_sentiment

enum<string>

Sentiment of the user in the call.

Available options:

`Negative`,

`Positive`,

`Neutral`,

`Unknown`

Example:

`"Positive"`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis-call-successful)

call\_analysis.call\_successful

boolean

Whether the agent seems to have a successful call with the user, where the agent finishes the task, and the call was complete without being cutoff.

Example:

`true`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-analysis-custom-analysis-data)

call\_analysis.custom\_analysis\_data

object

Custom analysis data that was extracted based on the schema defined in agent post call analysis data. Can be empty if nothing is specified.

[​](https://docs.retellai.com/api-references/create-web-call#response-call-cost)

call\_cost

object

Cost of the call, including all the products and their costs and discount.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-call-cost-product-costs)

call\_cost.product\_costs

object\[\]

required

List of products with their unit prices and costs in cents

[​](https://docs.retellai.com/api-references/create-web-call#response-call-cost-total-duration-seconds)

call\_cost.total\_duration\_seconds

number

required

Total duration of the call in seconds

Example:

`60`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-cost-total-duration-unit-price)

call\_cost.total\_duration\_unit\_price

number

required

Total unit duration price of all products in cents per second

Example:

`1`

[​](https://docs.retellai.com/api-references/create-web-call#response-call-cost-combined-cost)

call\_cost.combined\_cost

number

required

Combined cost of all individual costs in cents

Example:

`70`

[​](https://docs.retellai.com/api-references/create-web-call#response-llm-token-usage)

llm\_token\_usage

object

LLM token usage of the call, available after call ends. Not populated if using custom LLM, realtime API, or no LLM call is made.

Show child attributes

[​](https://docs.retellai.com/api-references/create-web-call#response-llm-token-usage-values)

llm\_token\_usage.values

number\[\]

required

All the token count values in the call.

[​](https://docs.retellai.com/api-references/create-web-call#response-llm-token-usage-average)

llm\_token\_usage.average

number

required

Average token count of the call.

[​](https://docs.retellai.com/api-references/create-web-call#response-llm-token-usage-num-requests)

llm\_token\_usage.num\_requests

number

required

Number of requests made to the LLM.

Was this page helpful?

YesNo

[Create Phone Call](https://docs.retellai.com/api-references/create-phone-call) [Get Call](https://docs.retellai.com/api-references/get-call)

Assistant

Responses are generated using AI and may contain mistakes.