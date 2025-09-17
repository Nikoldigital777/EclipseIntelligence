[Retell AI home page![light logo](https://mintcdn.com/retellai/_FxJdxv7mQoPqyGs/logo/logo-black.svg?fit=max&auto=format&n=_FxJdxv7mQoPqyGs&q=85&s=11dfae26479fc0bf0bf672443e7fc6d3)![dark logo](https://mintcdn.com/retellai/_FxJdxv7mQoPqyGs/logo/logo-white.svg?fit=max&auto=format&n=_FxJdxv7mQoPqyGs&q=85&s=8f464996a71744ac8fa6d086e39c46ce)](https://docs.retellai.com/)

Search...

Ctrl K

Search...

Navigation

Batch call

Create Batch Call

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

const batchCallResponse = await client.batchCall.createBatchCall({
  from_number: '+14157774444',
  tasks: [{ to_number: '+12137774445' }],
});

console.log(batchCallResponse.batch_call_id);
```

201

400

401

422

500

Copy

Ask AI

```
{
  "batch_call_id": "batch_call_dbcc4412483ebfc348abb",
  "name": "First batch call",
  "from_number": "+14157774444",
  "scheduled_timestamp": 1735718400,
  "total_task_count": 123
}
```

POST

/

create-batch-call

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

const batchCallResponse = await client.batchCall.createBatchCall({
  from_number: '+14157774444',
  tasks: [{ to_number: '+12137774445' }],
});

console.log(batchCallResponse.batch_call_id);
```

201

400

401

422

500

Copy

Ask AI

```
{
  "batch_call_id": "batch_call_dbcc4412483ebfc348abb",
  "name": "First batch call",
  "from_number": "+14157774444",
  "scheduled_timestamp": 1735718400,
  "total_task_count": 123
}
```

#### Authorizations

[​](https://docs.retellai.com/api-references/create-batch-call#authorization-authorization)

Authorization

string

header

required

Authentication header containing API key (find it in dashboard). The format is "Bearer YOUR\_API\_KEY"

#### Body

application/json

[​](https://docs.retellai.com/api-references/create-batch-call#body-from-number)

from\_number

string

required

The number you own in E.164 format. Must be a number purchased from Retell or imported to Retell.

Example:

`"+14157774444"`

[​](https://docs.retellai.com/api-references/create-batch-call#body-tasks)

tasks

object\[\]

required

A list of individual call tasks to be executed as part of the batch call. Each task represents a single outbound call and includes details such as the recipient's phone number and optional dynamic variables to personalize the call content.

Show child attributes

[​](https://docs.retellai.com/api-references/create-batch-call#body-tasks-to-number)

to\_number

string

required

The The number you want to call, in E.164 format. If using a number purchased from Retell, only US numbers are supported as destination.

Example:

`"+12137774445"`

[​](https://docs.retellai.com/api-references/create-batch-call#body-tasks-retell-llm-dynamic-variables)

retell\_llm\_dynamic\_variables

object

Add optional dynamic variables in key value pairs of string that injects into your Response Engine prompt and tool description. Only applicable for Response Engine.

Example:

```
{ "customer_name": "John Doe" }
```

[​](https://docs.retellai.com/api-references/create-batch-call#body-name)

name

string

The name of the batch call. Only used for your own reference.

Example:

`"First batch call"`

[​](https://docs.retellai.com/api-references/create-batch-call#body-trigger-timestamp)

trigger\_timestamp

number

The scheduled time for sending the batch call, represented as a Unix timestamp in milliseconds. If omitted, the call will be sent immediately.

Example:

`1735718400000`

#### Response

201

application/json

Successfully created a batch call.

[​](https://docs.retellai.com/api-references/create-batch-call#response-batch-call-id)

batch\_call\_id

string

required

Unique id of the batch call.

Example:

`"batch_call_dbcc4412483ebfc348abb"`

[​](https://docs.retellai.com/api-references/create-batch-call#response-name)

name

string

required

Example:

`"First batch call"`

[​](https://docs.retellai.com/api-references/create-batch-call#response-from-number)

from\_number

string

required

Example:

`"+14157774444"`

[​](https://docs.retellai.com/api-references/create-batch-call#response-scheduled-timestamp)

scheduled\_timestamp

number

required

Example:

`1735718400`

[​](https://docs.retellai.com/api-references/create-batch-call#response-total-task-count)

total\_task\_count

number

required

Number of tasks within the batch call

Was this page helpful?

YesNo

[List Voices](https://docs.retellai.com/api-references/list-voices) [Get Concurrency](https://docs.retellai.com/api-references/get-concurrency)

Assistant

Responses are generated using AI and may contain mistakes.