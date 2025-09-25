# Event Sender

This worker is responsible for reading events from the outbox table and reacting to them.

It's an initial implementation, which is very simple and straightforward. At the beginning I started to create a big structure for it but then I realize I would create a gigantic structure for no real need. Even it being a side project, I don't want it to be extremely complex without a real need. It's better to improve the structure as the project evolves.

## Limitations

As this worker reads each entry from the table and only send one e-mail, it works fine. But if I needed to do multiple tasks for the same event, it could become a problem, as some tasks could be completed while others don't. In this case if I retried to execute the tasks, it could duplicate e-mails or something like this. So for more complex workflows, other solutions are necessary.
